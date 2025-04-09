
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFertilizerCropNames } from "@/utils/cropUtils";
import AddCropDialog from "@/components/admin/AddCropDialog";
import ProductOptionForm from "@/components/admin/ProductOptionForm";

const formSchema = z.object({
  crop_name: z.string().min(1, "Crop name is required"),
  low_cost_fertilizer: z.string().min(1, "Low cost fertilizer name is required"),
  low_cost_buy_link: z.string().url("Please enter a valid URL"),
  low_cost_image: z.string().optional(),
  low_cost_rating: z.number().min(0).max(5),
  medium_cost_fertilizer: z.string().min(1, "Medium cost fertilizer name is required"),
  medium_cost_buy_link: z.string().url("Please enter a valid URL"),
  medium_cost_image: z.string().optional(),
  medium_cost_rating: z.number().min(0).max(5),
  high_cost_fertilizer: z.string().min(1, "High cost fertilizer name is required"),
  high_cost_buy_link: z.string().url("Please enter a valid URL"),
  high_cost_image: z.string().optional(),
  high_cost_rating: z.number().min(0).max(5),
});

interface FertilizerFormProps {
  onSuccess: () => void;
}

const FertilizerForm = ({ onSuccess }: FertilizerFormProps) => {
  const [loading, setLoading] = useState(false);
  const [newCropDialogOpen, setNewCropDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch fertilizer-specific crop names
  const { data: cropNames = [], refetch: refetchCropNames, isLoading: isLoadingCrops } = useFertilizerCropNames();

  console.log("Current fertilizer crop names in form:", cropNames);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop_name: "",
      low_cost_fertilizer: "",
      low_cost_buy_link: "https://",
      low_cost_image: "",
      low_cost_rating: 3,
      medium_cost_fertilizer: "",
      medium_cost_buy_link: "https://",
      medium_cost_image: "",
      medium_cost_rating: 4,
      high_cost_fertilizer: "",
      high_cost_buy_link: "https://",
      high_cost_image: "",
      high_cost_rating: 5,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      console.log("Submitting form with values:", values);
      
      const dataToInsert = {
        crop_name: values.crop_name,
        low_cost_fertilizer: values.low_cost_fertilizer,
        low_cost_buy_link: values.low_cost_buy_link,
        low_cost_image: values.low_cost_image || null,
        low_cost_rating: values.low_cost_rating,
        medium_cost_fertilizer: values.medium_cost_fertilizer,
        medium_cost_buy_link: values.medium_cost_buy_link,
        medium_cost_image: values.medium_cost_image || null,
        medium_cost_rating: values.medium_cost_rating,
        high_cost_fertilizer: values.high_cost_fertilizer,
        high_cost_buy_link: values.high_cost_buy_link,
        high_cost_image: values.high_cost_image || null,
        high_cost_rating: values.high_cost_rating,
      };
      
      // Check if the crop already exists
      const { data: existingCrop, error: checkError } = await supabase
        .from("fertilizer_products")
        .select("id")
        .eq("crop_name", values.crop_name)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let result;
      
      if (existingCrop) {
        // Update existing crop
        console.log("Updating existing fertilizer crop:", existingCrop.id);
        result = await supabase
          .from("fertilizer_products")
          .update(dataToInsert)
          .eq("id", existingCrop.id);
      } else {
        // Insert new crop
        console.log("Inserting new fertilizer crop");
        result = await supabase
          .from("fertilizer_products")
          .insert(dataToInsert);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: existingCrop 
          ? `Fertilizer products for ${values.crop_name} updated successfully`
          : `Fertilizer products for ${values.crop_name} added successfully`,
      });
      
      form.reset({
        crop_name: "",
        low_cost_fertilizer: "",
        low_cost_buy_link: "https://",
        low_cost_image: "",
        low_cost_rating: 3,
        medium_cost_fertilizer: "",
        medium_cost_buy_link: "https://",
        medium_cost_image: "",
        medium_cost_rating: 4,
        high_cost_fertilizer: "",
        high_cost_buy_link: "https://",
        high_cost_image: "",
        high_cost_rating: 5,
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Error adding fertilizer products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not add fertilizer products",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCropAdded = (newCropName: string) => {
    // Refetch crop names to update the dropdown
    console.log("New crop added, refetching crop names");
    refetchCropNames();
    
    // Set the form crop_name
    form.setValue("crop_name", newCropName);
  };

  // When a crop is selected, load its existing data if available
  const handleCropChange = async (cropName: string) => {
    console.log("Crop selected:", cropName);
    form.setValue("crop_name", cropName);
    
    try {
      const { data, error } = await supabase
        .from("fertilizer_products")
        .select("*")
        .eq("crop_name", cropName)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        console.log("Found existing data for crop:", data);
        
        // Update form with existing data
        form.setValue("low_cost_fertilizer", data.low_cost_fertilizer);
        form.setValue("low_cost_buy_link", data.low_cost_buy_link);
        form.setValue("low_cost_image", data.low_cost_image || "");
        form.setValue("low_cost_rating", data.low_cost_rating);
        
        form.setValue("medium_cost_fertilizer", data.medium_cost_fertilizer);
        form.setValue("medium_cost_buy_link", data.medium_cost_buy_link);
        form.setValue("medium_cost_image", data.medium_cost_image || "");
        form.setValue("medium_cost_rating", data.medium_cost_rating);
        
        form.setValue("high_cost_fertilizer", data.high_cost_fertilizer);
        form.setValue("high_cost_buy_link", data.high_cost_buy_link);
        form.setValue("high_cost_image", data.high_cost_image || "");
        form.setValue("high_cost_rating", data.high_cost_rating);
      }
    } catch (error) {
      console.error("Error loading crop data:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="crop_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Name</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => handleCropChange(value)}
                      value={field.value}
                      disabled={isLoadingCrops}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={isLoadingCrops ? "Loading crops..." : "Select a crop"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cropNames.map((crop) => (
                          <SelectItem key={crop} value={crop}>
                            {crop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setNewCropDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Crop
          </Button>
        </div>

        <ProductOptionForm
          title="Low Cost Option"
          form={form}
          nameField="low_cost_fertilizer"
          ratingField="low_cost_rating"
          buyLinkField="low_cost_buy_link"
          imageField="low_cost_image"
          bucketName="fertilizer_images"
        />

        <ProductOptionForm
          title="Medium Cost Option"
          form={form}
          nameField="medium_cost_fertilizer"
          ratingField="medium_cost_rating"
          buyLinkField="medium_cost_buy_link"
          imageField="medium_cost_image"
          bucketName="fertilizer_images"
        />

        <ProductOptionForm
          title="High Cost Option"
          form={form}
          nameField="high_cost_fertilizer"
          ratingField="high_cost_rating"
          buyLinkField="high_cost_buy_link"
          imageField="high_cost_image"
          bucketName="fertilizer_images"
        />

        <Button type="submit" disabled={loading} className="w-full">
          <Save className="mr-2 h-4 w-4" /> Save Fertilizer Products
        </Button>
      </form>

      <AddCropDialog 
        open={newCropDialogOpen}
        onOpenChange={setNewCropDialogOpen}
        cropNames={cropNames}
        onCropAdded={handleCropAdded}
        type="fertilizer"
      />
    </Form>
  );
};

export default FertilizerForm;
