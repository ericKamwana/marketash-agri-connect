
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./supabase-provider";
import { toast } from "sonner";
import { useFraudDetection } from "./useFraudDetection";
import { bidSchema } from "@/lib/validations/schema";

export interface Bid {
  id: string;
  product_id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'outbid';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export function useBids() {
  const { supabase, user } = useSupabase();
  const queryClient = useQueryClient();
  const { checkBidForFraud } = useFraudDetection();

  // Place a bid with conflict resolution and fraud detection
  const placeBid = async ({ 
    productId, 
    bidAmount 
  }: { 
    productId: string; 
    bidAmount: number 
  }) => {
    if (!user) {
      throw new Error("You must be logged in to place a bid");
    }

    // Validate the bid using Zod schema
    try {
      bidSchema.parse({
        productId,
        bidAmount,
        userId: user.id,
      });
    } catch (error: any) {
      throw new Error(error.errors?.[0]?.message || "Invalid bid data");
    }

    // Start a transaction for atomic operations
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('base_price, quantity')
      .eq('id', productId)
      .single();

    if (productError) {
      console.error("Error fetching product:", productError);
      throw new Error("Could not verify product information");
    }

    if (!product || product.quantity <= 0) {
      throw new Error("This product is no longer available");
    }

    // Check for bid conflicts
    const { data: highestBid, error: bidError } = await supabase
      .from('bids')
      .select('amount')
      .eq('product_id', productId)
      .eq('status', 'accepted')
      .order('amount', { ascending: false })
      .limit(1)
      .single();

    // Only throw for errors other than "no rows found"
    if (bidError && bidError.code !== 'PGRST116') {
      console.error("Error checking highest bid:", bidError);
      throw new Error("Could not verify current highest bid");
    }

    const currentHighestAmount = highestBid ? highestBid.amount : product.base_price;

    // Verify bid amount is higher than current highest
    if (bidAmount <= currentHighestAmount) {
      throw new Error(`Your bid must be higher than the current highest bid of $${currentHighestAmount.toFixed(2)}`);
    }

    // Perform fraud check
    const fraudCheck = await checkBidForFraud({
      userId: user.id,
      productId,
      bidAmount,
    });

    if (fraudCheck.isFraudulent) {
      // Record the rejected bid with reason
      await supabase.from('bids').insert({
        product_id: productId,
        user_id: user.id,
        amount: bidAmount,
        status: 'rejected',
        rejection_reason: `Fraud risk score: ${fraudCheck.riskScore}`
      });
      
      throw new Error("Your bid was flagged by our system. Please contact support if you believe this is an error.");
    }

    // With optimistic concurrency control
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        // 1. Mark previous highest bid as outbid
        if (highestBid) {
          const { error: updateError } = await supabase
            .from('bids')
            .update({ status: 'outbid' })
            .eq('product_id', productId)
            .eq('status', 'accepted');
            
          if (updateError) throw updateError;
        }
        
        // 2. Insert new bid
        const { data: newBid, error: insertError } = await supabase
          .from('bids')
          .insert({
            product_id: productId,
            user_id: user.id,
            amount: bidAmount,
            status: 'accepted'
          })
          .select()
          .single();
          
        if (insertError) throw insertError;
        
        // 3. Create notification for product owner
        const { data: productOwner, error: ownerError } = await supabase
          .from('products')
          .select('user_id')
          .eq('id', productId)
          .single();
          
        if (!ownerError && productOwner) {
          await supabase.from('notifications').insert({
            user_id: productOwner.user_id,
            type: 'bid',
            title: 'New Bid Received',
            message: `A new bid of $${bidAmount.toFixed(2)} was placed on your product`,
            reference_id: productId,
            read: false
          });
        }
        
        // 4. Create notification for previous high bidder if they exist
        if (highestBid) {
          const { data: previousBidder, error: previousBidderError } = await supabase
            .from('bids')
            .select('user_id')
            .eq('product_id', productId)
            .eq('status', 'outbid')
            .neq('user_id', user.id)
            .order('amount', { ascending: false })
            .limit(1)
            .single();
            
          if (!previousBidderError && previousBidder && previousBidder.user_id !== user.id) {
            await supabase.from('notifications').insert({
              user_id: previousBidder.user_id,
              type: 'outbid',
              title: 'You Have Been Outbid',
              message: `Someone has placed a higher bid on a product you were bidding on`,
              reference_id: productId,
              read: false
            });
          }
        }
        
        return newBid;
      } catch (error: any) {
        // If error is due to concurrent update, retry
        if (error.code === '23505' && retries < maxRetries - 1) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 200 * retries));
        } else {
          console.error("Bid placement error:", error);
          throw new Error("Failed to place bid. Please try again.");
        }
      }
    }
    
    throw new Error("Failed to place bid due to concurrent updates. Please try again.");
  };

  // Use the placeBid function with react-query
  const usePlaceBidMutation = () => {
    return useMutation({
      mutationFn: placeBid,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["bids", variables.productId],
        });
        queryClient.invalidateQueries({
          queryKey: ["products", variables.productId],
        });
        toast.success("Your bid has been placed successfully!");
      },
      onError: (error) => {
        toast.error(`Bid failed: ${error.message}`);
      },
    });
  };

  // Get user's bids
  const fetchUserBids = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          id,
          product_id,
          amount,
          status,
          created_at,
          updated_at,
          products:product_id (
            title,
            base_price,
            unit,
            image
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user bids:", error);
      throw error;
    }
  };

  // Use the fetchUserBids function with react-query
  const useUserBidsQuery = () => {
    return useQuery({
      queryKey: ["bids", "user", user?.id],
      queryFn: fetchUserBids,
      enabled: !!user,
    });
  };

  // Get bids for a specific product
  const fetchProductBids = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          id,
          user_id,
          amount,
          status,
          created_at,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching bids for product ${productId}:`, error);
      throw error;
    }
  };

  // Use the fetchProductBids function with react-query
  const useProductBidsQuery = (productId: string) => {
    return useQuery({
      queryKey: ["bids", "product", productId],
      queryFn: () => fetchProductBids(productId),
      enabled: !!productId,
    });
  };

  return {
    usePlaceBidMutation,
    useUserBidsQuery,
    useProductBidsQuery,
  };
}
