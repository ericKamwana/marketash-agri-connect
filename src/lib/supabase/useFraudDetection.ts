
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FraudCheckParams {
  userId: string;
  productId: string;
  bidAmount: number;
  previousBids?: number;
}

export function useFraudDetection() {
  const { supabase, user } = useSupabase();
  const queryClient = useQueryClient();

  // Check if a bid might be fraudulent
  const checkBidForFraud = async ({ 
    userId, 
    productId, 
    bidAmount, 
    previousBids = 0 
  }: FraudCheckParams) => {
    if (!userId) {
      throw new Error("User ID is required for fraud check");
    }

    try {
      // 1. Check user history for suspicious patterns
      const { data: userBidHistory, error: historyError } = await supabase
        .from('bids')
        .select('id, status, amount')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (historyError) throw historyError;

      // 2. Count recently rejected bids
      const recentRejections = userBidHistory?.filter(
        bid => bid.status === 'rejected'
      ).length || 0;

      // 3. Check for rapid bid changes on the same product
      const { data: recentBidsOnProduct, error: recentBidsError } = await supabase
        .from('bids')
        .select('created_at')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentBidsError) throw recentBidsError;

      // Calculate risk score based on various factors
      let riskScore = 0;
      
      // Factor 1: High number of rejected bids
      if (recentRejections >= 3) riskScore += 30;
      else if (recentRejections >= 1) riskScore += 10;
      
      // Factor 2: Unusual bid amount (much higher than base price)
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('base_price')
        .eq('id', productId)
        .single();

      if (!productError && productData) {
        const basePrice = productData.base_price;
        const bidRatio = bidAmount / basePrice;
        
        if (bidRatio > 3) riskScore += 30; // More than 3x base price
        else if (bidRatio > 2) riskScore += 15; // More than 2x base price
      }
      
      // Factor 3: Rapid bidding (multiple bids in short period)
      if (recentBidsOnProduct && recentBidsOnProduct.length > 3) {
        riskScore += 15;
      }
      
      // Factor 4: New account with high bids
      const { data: userCreatedAt, error: userError } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', userId)
        .single();
        
      if (!userError && userCreatedAt) {
        const accountAge = new Date().getTime() - new Date(userCreatedAt.created_at).getTime();
        const accountAgeDays = accountAge / (1000 * 60 * 60 * 24);
        
        if (accountAgeDays < 1 && bidAmount > 500) riskScore += 40; // New account with large bid
        else if (accountAgeDays < 7 && bidAmount > 1000) riskScore += 20; // Newer account with very large bid
      }

      // Determine if bid is likely fraudulent based on risk score
      const isFraudulent = riskScore >= 50;

      // Log for monitoring purposes (in a real app, this would go to a monitoring system)
      console.log(`Fraud check for user ${userId}: Risk score ${riskScore}`);
      
      return {
        isFraudulent,
        riskScore,
        riskFactors: {
          recentRejections,
          rapidBidding: recentBidsOnProduct?.length || 0,
          bidAmount
        }
      };
    } catch (error) {
      console.error("Fraud detection error:", error);
      return {
        isFraudulent: false, // Default to allowing the bid if check fails
        riskScore: 0,
        error
      };
    }
  };

  // Mutation for processing a bid with fraud detection
  const useProcessBidWithFraudCheckMutation = () => {
    return useMutation({
      mutationFn: async ({ 
        productId, 
        bidAmount 
      }: { 
        productId: string;
        bidAmount: number;
      }) => {
        if (!user) throw new Error("User must be authenticated to place bids");
        
        // First check for fraud
        const fraudCheck = await checkBidForFraud({
          userId: user.id,
          productId,
          bidAmount
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
        
        // If passed fraud check, submit the bid
        const { data, error } = await supabase.from('bids').insert({
          product_id: productId,
          user_id: user.id,
          amount: bidAmount,
          status: 'accepted'
        }).select().single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bids'] });
        toast.success("Your bid has been placed successfully!");
      },
      onError: (error) => {
        toast.error(`Bid failed: ${error.message}`);
      },
    });
  };

  return {
    checkBidForFraud,
    useProcessBidWithFraudCheckMutation,
  };
}
