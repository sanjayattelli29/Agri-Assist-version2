
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook to fetch pesticide-specific crop names 
 */
export const usePesticideCropNames = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['pesticide-crop-names'],
    queryFn: async () => {
      try {
        // Fetch crop names from pesticide products
        const { data: pesticideData, error: pesticideError } = await supabase
          .from("pesticide_products")
          .select("crop_name")
          .order("crop_name");

        if (pesticideError) throw pesticideError;
        
        // Extract unique crop names
        const cropNames = pesticideData.map(item => item.crop_name);
        const uniqueCropNames = [...new Set(cropNames)];
        return uniqueCropNames;
      } catch (error) {
        console.error("Error fetching pesticide crop names:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load pesticide crop names",
        });
        return [];
      }
    },
  });
};

/**
 * Custom hook to fetch fertilizer-specific crop names
 */
export const useFertilizerCropNames = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['fertilizer-crop-names'],
    queryFn: async () => {
      try {
        // Fetch crop names from fertilizer products
        const { data: fertilizerData, error: fertilizerError } = await supabase
          .from("fertilizer_products")
          .select("crop_name")
          .order("crop_name");

        if (fertilizerError) throw fertilizerError;
        
        console.log("Fertilizer crop data from database:", fertilizerData);
        
        // Extract unique crop names
        const cropNames = fertilizerData.map(item => item.crop_name);
        const uniqueCropNames = [...new Set(cropNames)];
        console.log("Unique fertilizer crop names:", uniqueCropNames);
        return uniqueCropNames;
      } catch (error) {
        console.error("Error fetching fertilizer crop names:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load fertilizer crop names",
        });
        return [];
      }
    },
  });
};

/**
 * Custom hook to fetch unique crop names from multiple tables
 */
export const useCropNames = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['unique-crop-names'],
    queryFn: async () => {
      try {
        // First fetch existing crop names from fertilizer_products
        const { data: fertilizerData, error: fertilizerError } = await supabase
          .from("fertilizer_products")
          .select("crop_name")
          .order("crop_name");

        if (fertilizerError) throw fertilizerError;

        // Fetch crop names from pesticide products
        const { data: pesticideData, error: pesticideError } = await supabase
          .from("pesticide_products")
          .select("crop_name")
          .order("crop_name");

        if (pesticideError) throw pesticideError;

        // Fetch soil requirements crop names
        const { data: soilData, error: soilError } = await supabase
          .from("soil_requirements")
          .select("crop_name")
          .order("crop_name");

        if (soilError) throw soilError;

        // Fetch crop rotation crop names
        const { data: rotationData, error: rotationError } = await supabase
          .from("crop_rotation_rules")
          .select("current_crop")
          .order("current_crop");

        if (rotationError) throw rotationError;

        // Combine and deduplicate crop names
        const allCropNames = [
          ...fertilizerData.map(item => item.crop_name),
          ...pesticideData.map(item => item.crop_name),
          ...(soilData ? soilData.map(item => item.crop_name) : []),
          ...(rotationData ? rotationData.map(item => item.current_crop) : [])
        ];
        
        const uniqueCropNames = [...new Set(allCropNames)];
        return uniqueCropNames;
      } catch (error) {
        console.error("Error fetching crop names:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load crop names",
        });
        return [];
      }
    },
  });
};

/**
 * Creates a new crop name in the fertilizer products table
 */
export const createNewFertilizerCrop = async (
  newCropName: string, 
  cropNames: string[],
  toast: ReturnType<typeof useToast>["toast"]
): Promise<boolean> => {
  if (!newCropName.trim()) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Crop name cannot be empty",
    });
    return false;
  }
  
  try {
    // Check if crop name already exists
    if (cropNames.includes(newCropName.trim())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "This crop name already exists",
      });
      return false;
    }
    
    console.log("Creating new fertilizer crop:", newCropName);
    
    // Insert new crop with placeholder data into fertilizer_products table
    const { error, data } = await supabase
      .from("fertilizer_products")
      .insert({
        crop_name: newCropName.trim(),
        low_cost_fertilizer: "To be updated",
        low_cost_buy_link: "https://example.com",
        low_cost_rating: 3,
        medium_cost_fertilizer: "To be updated",
        medium_cost_buy_link: "https://example.com",
        medium_cost_rating: 4,
        high_cost_fertilizer: "To be updated",
        high_cost_buy_link: "https://example.com",
        high_cost_rating: 5
      })
      .select();
    
    if (error) {
      console.error("Error creating new fertilizer crop:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create new crop: ${error.message}`,
      });
      return false;
    }
    
    console.log("Successfully created fertilizer crop, response:", data);
    
    toast({
      title: "Success",
      description: `New crop "${newCropName}" added to fertilizer crops`,
    });
    
    return true;
  } catch (error) {
    console.error("Error creating new fertilizer crop:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to create new crop",
    });
    return false;
  }
};

/**
 * Creates a new crop name and adds it to the database
 */
export const createNewCrop = async (
  newCropName: string, 
  cropNames: string[],
  toast: ReturnType<typeof useToast>["toast"]
): Promise<boolean> => {
  if (!newCropName.trim()) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Crop name cannot be empty",
    });
    return false;
  }
  
  try {
    // Check if crop name already exists
    if (cropNames.includes(newCropName.trim())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "This crop name already exists",
      });
      return false;
    }
    
    // Insert new crop with placeholder data into pesticide_products table
    const { error } = await supabase
      .from("pesticide_products")
      .insert({
        crop_name: newCropName.trim(),
        low_cost_pesticide: "To be updated",
        low_cost_buy_link: "https://example.com",
        low_cost_rating: 3,
        medium_cost_pesticide: "To be updated",
        medium_cost_buy_link: "https://example.com",
        medium_cost_rating: 4,
        high_cost_pesticide: "To be updated",
        high_cost_buy_link: "https://example.com",
        high_cost_rating: 5
      });
    
    if (error) {
      console.error("Error creating new crop:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create new crop: ${error.message}`,
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: `New crop "${newCropName}" added to selection`,
    });
    
    return true;
  } catch (error) {
    console.error("Error creating new crop:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to create new crop",
    });
    return false;
  }
};
