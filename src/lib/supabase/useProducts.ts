
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./supabase-provider";
import { toast } from "sonner";

// Product type interface
export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  base_price: number;
  unit: string;
  quantity: number;
  location: string;
  harvest_date: string;
  category: string;
  created_at: string;
  user_id: string;
  farmer: {
    name: string;
    image: string;
    rating: number;
  };
}

export interface ProductBid {
  id: string;
  product_id: string;
  bidder_id: string;
  bid_amount: number;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  quantity: number;
  bidder: {
    name: string;
    image: string;
  };
}

export function useProducts() {
  const { supabase, user } = useSupabase();
  const queryClient = useQueryClient();

  // Fetch all products
  const fetchProducts = async (search: string = "") => {
    let query = supabase
      .from("products")
      .select(`
        *,
        farmer:users!farmer_id(name, image, rating)
      `);

    if (search) {
      query = query.ilike("title", `%${search}%`).or(`description.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }

    return data as Product[];
  };

  // Use the fetchProducts function with react-query
  const useProductsQuery = (search: string = "") => {
    return useQuery({
      queryKey: ["products", search],
      queryFn: () => fetchProducts(search),
      staleTime: 60 * 1000, // 1 minute
    });
  };

  // Fetch a single product by ID
  const fetchProductById = async (id: string) => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        farmer:users!farmer_id(name, image, rating)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw new Error(error.message);
    }

    return data as Product;
  };

  // Use the fetchProductById function with react-query
  const useProductQuery = (id: string) => {
    return useQuery({
      queryKey: ["products", id],
      queryFn: () => fetchProductById(id),
      enabled: !!id,
    });
  };

  // Create a new product
  const createProduct = async (product: Omit<Product, "id" | "created_at" | "user_id" | "farmer">) => {
    if (!user) {
      throw new Error("You must be logged in to create a product");
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        ...product,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw new Error(error.message);
    }

    return data;
  };

  // Use the createProduct function with react-query
  const useCreateProductMutation = () => {
    return useMutation({
      mutationFn: createProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
        toast.success("Product created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create product: ${error.message}`);
      },
    });
  };

  // Create a bid on a product
  const createBid = async (bid: {
    product_id: string;
    bid_amount: number;
    quantity: number;
  }) => {
    if (!user) {
      throw new Error("You must be logged in to place a bid");
    }

    const { data, error } = await supabase
      .from("product_bids")
      .insert({
        ...bid,
        bidder_id: user.id,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating bid:", error);
      throw new Error(error.message);
    }

    return data;
  };

  // Use the createBid function with react-query
  const useCreateBidMutation = () => {
    return useMutation({
      mutationFn: createBid,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["products", variables.product_id, "bids"],
        });
        toast.success("Bid placed successfully");
      },
      onError: (error) => {
        toast.error(`Failed to place bid: ${error.message}`);
      },
    });
  };

  // Get bids for a specific product
  const fetchProductBids = async (productId: string) => {
    const { data, error } = await supabase
      .from("product_bids")
      .select(`
        *,
        bidder:users!bidder_id(name, image)
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error fetching bids for product ${productId}:`, error);
      throw new Error(error.message);
    }

    return data as ProductBid[];
  };

  // Use the fetchProductBids function with react-query
  const useProductBidsQuery = (productId: string) => {
    return useQuery({
      queryKey: ["products", productId, "bids"],
      queryFn: () => fetchProductBids(productId),
      enabled: !!productId,
    });
  };

  return {
    useProductsQuery,
    useProductQuery,
    useCreateProductMutation,
    useCreateBidMutation,
    useProductBidsQuery,
  };
}
