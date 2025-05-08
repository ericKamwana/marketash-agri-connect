
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./supabase-provider";
import { toast } from "sonner";

export interface CropDiagnosis {
  id: string;
  user_id: string;
  image_url: string;
  crop_type: string;
  diagnosis: string;
  confidence_score: number;
  recommendation: string;
  created_at: string;
}

export function useCropDiagnosis() {
  const { supabase, user } = useSupabase();
  const queryClient = useQueryClient();

  // Upload image and diagnose crop issue
  const diagnoseCrop = async ({ 
    image, 
    cropType 
  }: { 
    image: File; 
    cropType: string;
  }) => {
    if (!user) {
      throw new Error("You must be logged in to use the Crop Doctor");
    }

    // Upload image to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${image.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("crop_images")
      .upload(fileName, image);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw new Error(uploadError.message);
    }

    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("crop_images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // Call the AI diagnosis edge function (mock result for now)
    // In a real implementation, this would call a Supabase Edge Function
    const mockDiagnosis = {
      diagnosis: "Leaf Rust",
      confidence_score: 0.92,
      recommendation: "Apply copper-based fungicide and ensure proper spacing between plants to improve air circulation."
    };

    // Save diagnosis to database using the correct table name
    const { data: diagnosisData, error: diagnosisError } = await supabase
      .from("crop_diagnosis")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        crop_type: cropType,
        diagnosis: mockDiagnosis.diagnosis,
        confidence_score: mockDiagnosis.confidence_score,
        recommendation: mockDiagnosis.recommendation
      })
      .select()
      .single();

    if (diagnosisError) {
      console.error("Error saving diagnosis:", diagnosisError);
      throw new Error(diagnosisError.message);
    }

    return diagnosisData as CropDiagnosis;
  };

  // Use the diagnoseCrop function with react-query
  const useDiagnoseCropMutation = () => {
    return useMutation({
      mutationFn: diagnoseCrop,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["crop-diagnoses"],
        });
        toast.success("Crop diagnosis complete!");
      },
      onError: (error) => {
        toast.error(`Diagnosis failed: ${error.message}`);
      },
    });
  };

  // Fetch user's diagnosis history
  const fetchDiagnosisHistory = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("crop_diagnosis")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching diagnosis history:", error);
      throw new Error(error.message);
    }

    return data as CropDiagnosis[];
  };

  // Use the fetchDiagnosisHistory function with react-query
  const useDiagnosisHistoryQuery = () => {
    return useQuery({
      queryKey: ["crop-diagnoses"],
      queryFn: fetchDiagnosisHistory,
      enabled: !!user,
    });
  };

  // Fetch a single diagnosis by ID
  const fetchDiagnosisById = async (id: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("crop_diagnosis")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error(`Error fetching diagnosis with ID ${id}:`, error);
      throw new Error(error.message);
    }

    return data as CropDiagnosis;
  };

  // Use the fetchDiagnosisById function with react-query
  const useDiagnosisQuery = (id: string) => {
    return useQuery({
      queryKey: ["crop-diagnoses", id],
      queryFn: () => fetchDiagnosisById(id),
      enabled: !!id && !!user,
    });
  };

  return {
    useDiagnoseCropMutation,
    useDiagnosisHistoryQuery,
    useDiagnosisQuery,
  };
}
