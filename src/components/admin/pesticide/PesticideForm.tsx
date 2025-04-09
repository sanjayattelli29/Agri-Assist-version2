
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
import { usePesticideCropNames, createNewCrop } from "@/utils/cropUtils";
import AddCropDialog from "@/components/admin/AddCropDialog";
import ProductOptionForm from "@/components/admin/ProductOptionForm";

const formSchema = z.object({
  crop_name: z.string().min(1, "Crop name is required"),
  low_cost_pesticide: z.string().min(1, "Low cost pesticide name is required"),
  low_cost_buy_link: z.string().url("Please enter a valid URL"),
  low_cost_image: z.string().optional(),
  low_cost_rating: z.number().min(0).max(5),
  medium_cost_pesticide: z.string().min(1, "Medium cost pesticide name is required"),
  medium_cost_buy_link: z.string().url("Please enter a valid URL"),
  medium_cost_image: z.string().optional(),
  medium_cost_rating: z.number().min(0).max(5),
  high_cost_pesticide: z.string().min(1, "High cost pesticide name is required"),
  high_cost_buy_link: z.string().url("Please enter a valid URL"),
  high_cost_image: z.string().optional(),
  high_cost_rating: z.number().min(0).max(5),
});

interface PesticideFormProps {
  onSuccess: () => void;
  editData?: any; // Optional data for editing
}

const PesticideForm = ({ onSuccess, editData }: PesticideFormProps) => {
  const [loading, setLoading] = useState(false);
  const [newCropDialogOpen, setNewCropDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  // Fetch pesticide-specific crop names
  const { data: pesticideCropNames = [], refetch: refetchPesticideCropNames } = usePesticideCropNames();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop_name: "",
      low_cost_pesticide: "",
      low_cost_buy_link: "https://",
      low_cost_image: "",
      low_cost_rating: 3,
      medium_cost_pesticide: "",
      medium_cost_buy_link: "https://",
      medium_cost_image: "",
      medium_cost_rating: 4,
      high_cost_pesticide: "",
      high_cost_buy_link: "https://",
      high_cost_image: "",
      high_cost_rating: 5,
    },
  });

  // Load data for editing if provided
  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      form.reset({
        crop_name: editData.crop_name || "",
        low_cost_pesticide: editData.low_cost_pesticide || "",
        low_cost_buy_link: editData.low_cost_buy_link || "https://",
        low_cost_image: editData.low_cost_image || "",
        low_cost_rating: editData.low_cost_rating || 3,
        medium_cost_pesticide: editData.medium_cost_pesticide || "",
        medium_cost_buy_link: editData.medium_cost_buy_link || "https://",
        medium_cost_image: editData.medium_cost_image || "",
        medium_cost_rating: editData.medium_cost_rating || 4,
        high_cost_pesticide: editData.high_cost_pesticide || "",
        high_cost_buy_link: editData.high_cost_buy_link || "https://",
        high_cost_image: editData.high_cost_image || "",
        high_cost_rating: editData.high_cost_rating || 5,
      });
    }
  }, [editData, form]);

  // Load existing data for a selected crop
  const loadCropData = async (cropName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pesticide_products")
        .select("*")
        .eq("crop_name", cropName)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setIsEditing(true);
        form.reset({
          crop_name: data.crop_name,
          low_cost_pesticide: data.low_cost_pesticide,
          low_cost_buy_link: data.low_cost_buy_link,
          low_cost_image: data.low_cost_image || "",
          low_cost_rating: data.low_cost_rating,
          medium_cost_pesticide: data.medium_cost_pesticide,
          medium_cost_buy_link: data.medium_cost_buy_link,
          medium_cost_image: data.medium_cost_image || "",
          medium_cost_rating: data.medium_cost_rating,
          high_cost_pesticide: data.high_cost_pesticide,
          high_cost_buy_link: data.high_cost_buy_link,
          high_cost_image: data.high_cost_image || "",
          high_cost_rating: data.high_cost_rating,
        });
      }
    } catch (error: any) {
      console.error("Error loading crop data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not load crop data",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const dataToInsert = {
        crop_name: values.crop_name,
        low_cost_pesticide: values.low_cost_pesticide,
        low_cost_buy_link: values.low_cost_buy_link,
        low_cost_image: values.low_cost_image || null,
        low_cost_rating: values.low_cost_rating,
        medium_cost_pesticide: values.medium_cost_pesticide,
        medium_cost_buy_link: values.medium_cost_buy_link,
        medium_cost_image: values.medium_cost_image || null,
        medium_cost_rating: values.medium_cost_rating,
        high_cost_pesticide: values.high_cost_pesticide,
        high_cost_buy_link: values.high_cost_buy_link,
        high_cost_image: values.high_cost_image || null,
        high_cost_rating: values.high_cost_rating,
      };
      
      let error;

      if (isEditing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("pesticide_products")
          .update(dataToInsert)
          .eq("crop_name", values.crop_name);
        
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("pesticide_products")
          .insert(dataToInsert);
        
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: isEditing 
          ? `Pesticide products for ${values.crop_name} updated successfully`
          : `Pesticide products for ${values.crop_name} added successfully`,
      });
      
      form.reset({
        crop_name: "",
        low_cost_pesticide: "",
        low_cost_buy_link: "https://",
        low_cost_image: "",
        low_cost_rating: 3,
        medium_cost_pesticide: "",
        medium_cost_buy_link: "https://",
        medium_cost_image: "",
        medium_cost_rating: 4,
        high_cost_pesticide: "",
        high_cost_buy_link: "https://",
        high_cost_image: "",
        high_cost_rating: 5,
      });
      
      setIsEditing(false);
      refetchPesticideCropNames();
      onSuccess();
    } catch (error: any) {
      console.error("Error saving pesticide products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not save pesticide products",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCropAdded = (newCropName: string) => {
    refetchPesticideCropNames();
    form.setValue("crop_name", newCropName);
  };

  const handleCropChange = (cropName: string) => {
    form.setValue("crop_name", cropName);
    
    // If selecting an existing pesticide crop, load its data for editing
    if (pesticideCropNames.includes(cropName)) {
      loadCropData(cropName);
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
                  <FormLabel>Crop Name {isEditing && <span className="text-blue-500">(Editing)</span>}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={handleCropChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {pesticideCropNames.map((crop) => (
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
          nameField="low_cost_pesticide"
          ratingField="low_cost_rating"
          buyLinkField="low_cost_buy_link"
          imageField="low_cost_image"
          bucketName="pesticide_images"
        />

        <ProductOptionForm
          title="Medium Cost Option"
          form={form}
          nameField="medium_cost_pesticide"
          ratingField="medium_cost_rating"
          buyLinkField="medium_cost_buy_link"
          imageField="medium_cost_image"
          bucketName="pesticide_images"
        />

        <ProductOptionForm
          title="High Cost Option"
          form={form}
          nameField="high_cost_pesticide"
          ratingField="high_cost_rating"
          buyLinkField="high_cost_buy_link"
          imageField="high_cost_image"
          bucketName="pesticide_images"
        />

        <Button type="submit" disabled={loading} className="w-full">
          <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Update' : 'Save'} Pesticide Products
        </Button>
      </form>

      <AddCropDialog 
        open={newCropDialogOpen}
        onOpenChange={setNewCropDialogOpen}
        cropNames={pesticideCropNames}
        onCropAdded={handleCropAdded}
      />
    </Form>
  );
};

export default PesticideForm;
