
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "./supabase-provider";
import { toast } from "sonner";

export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image: string;
  base_price: number;
  unit: string;
  quantity: number;
  location: string;
  harvest_date: string;
  category: string;
  status: 'available' | 'sold' | 'withdrawn';
  created_at: string;
  updated_at: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
    rating: number | null;
  };
}

export interface ProductFormData {
  title: string;
  description: string;
  image: File | null;
  base_price: number;
  unit: string;
  quantity: number;
  location: string;
  category: string;
}

export const useProducts = () => {
  const { user } = useSupabase();
  const queryClient = useQueryClient();
  
  // Fetch all available products
  const fetchProducts = async ({ 
    category = '',
    location = '',
    search = '',
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = {}) => {
    let query = supabase
      .from('products')
      .select(`
        *,
        profiles (
          display_name,
          avatar_url,
          rating
        )
      `)
      .eq('status', 'available');
      
    // Apply filters if provided
    if (category) query = query.eq('category', category);
    if (location) query = query.eq('location', location);
    if (search) query = query.ilike('title', `%${search}%`);
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    return data as Product[];
  };
  
  // Use the fetchProducts function with react-query
  const useProductsQuery = (filters = {}) => {
    return useQuery({
      queryKey: ['products', filters],
      queryFn: () => fetchProducts(filters),
    });
  };
  
  // Fetch a single product by ID
  const fetchProductById = async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles (
          display_name,
          avatar_url,
          rating
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
    
    return data as Product;
  };
  
  // Use the fetchProductById function with react-query
  const useProductQuery = (id: string) => {
    return useQuery({
      queryKey: ['products', id],
      queryFn: () => fetchProductById(id),
      enabled: !!id,
    });
  };
  
  // Create a new product
  const createProduct = async (productData: ProductFormData) => {
    if (!user) throw new Error("You must be logged in to create a product");
    
    let imageUrl = '';
    
    // Upload image if provided
    if (productData.image) {
      const fileExt = productData.image.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('product_images')
        .upload(filePath, productData.image);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);
        
      imageUrl = publicUrl;
    }
    
    // Insert product into database
    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        title: productData.title,
        description: productData.description,
        image: imageUrl,
        base_price: productData.base_price,
        unit: productData.unit,
        quantity: productData.quantity,
        location: productData.location,
        category: productData.category,
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Product;
  };
  
  // Use the createProduct function with react-query
  const useCreateProductMutation = () => {
    return useMutation({
      mutationFn: createProduct,
      onSuccess: () => {
        // Invalidate products cache to refetch the list
        queryClient.invalidateQueries({
          queryKey: ['products'],
        });
        
        toast.success("Product created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create product: ${error.message}`);
      },
    });
  };
  
  // Fetch products for a specific user (e.g. for dashboard)
  const fetchUserProducts = async (userId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching user products:", error);
      throw error;
    }
    
    return data as Product[];
  };
  
  // Use the fetchUserProducts function with react-query
  const useUserProductsQuery = () => {
    return useQuery({
      queryKey: ['products', 'user', user?.id],
      queryFn: () => fetchUserProducts(user!.id),
      enabled: !!user,
    });
  };
  
  // Update product status (e.g. mark as sold or withdrawn)
  const updateProductStatus = async ({ productId, status }: { productId: string, status: 'available' | 'sold' | 'withdrawn' }) => {
    if (!user) throw new Error("You must be logged in to update a product");
    
    const { data, error } = await supabase
      .from('products')
      .update({ status })
      .eq('id', productId)
      .eq('user_id', user.id) // Make sure user owns the product
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Product;
  };
  
  // Use the updateProductStatus function with react-query
  const useUpdateProductStatusMutation = () => {
    return useMutation({
      mutationFn: updateProductStatus,
      onSuccess: (data) => {
        // Invalidate queries for this specific product and all products
        queryClient.invalidateQueries({
          queryKey: ['products', data.id],
        });
        queryClient.invalidateQueries({
          queryKey: ['products'],
        });
        
        toast.success(`Product marked as ${data.status}`);
      },
      onError: (error) => {
        toast.error(`Failed to update product: ${error.message}`);
      },
    });
  };
  
  return {
    useProductsQuery,
    useProductQuery,
    useCreateProductMutation,
    useUserProductsQuery,
    useUpdateProductStatusMutation,
  };
};
