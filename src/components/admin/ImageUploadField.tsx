
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { uploadImage } from "@/utils/imageUtils";
import { UseFormReturn } from "react-hook-form";

interface ImageUploadFieldProps {
  label: string;
  fieldName: string;
  bucketName: "pesticide_images" | "fertilizer_images" | "crop_images";
  form: UseFormReturn<any>;
  placeholder?: string;
}

const ImageUploadField = ({
  label,
  fieldName,
  bucketName,
  form,
  placeholder = "Or enter image URL",
}: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      console.log(`Uploading image to ${bucketName}...`);
      const publicUrl = await uploadImage(file, bucketName, toast);
      
      if (publicUrl) {
        console.log("Upload successful, setting URL:", publicUrl);
        form.setValue(fieldName, publicUrl);
        form.trigger(fieldName); // Validate after setting value
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Could not upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleImageUpload(e.target.files[0]);
            }
          }}
        />
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="whitespace-nowrap"
          >
            {isUploading ? "Uploading..." : "Upload Image"}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
          <FormControl>
            <Input 
              placeholder={placeholder} 
              {...form.register(fieldName)} 
              className="flex-1" 
            />
          </FormControl>
        </div>
        {form.watch(fieldName) && (
          <div className="mt-2 relative w-24 h-24 border rounded-md overflow-hidden">
            <img 
              src={form.watch(fieldName)} 
              alt="Preview" 
              className="w-full h-full object-contain bg-gray-50" 
              onError={(e) => {
                console.log("Image load error, using placeholder");
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <Button
              type="button" 
              variant="destructive" 
              className="absolute top-0 right-0 p-1 h-6 w-6"
              onClick={() => form.setValue(fieldName, '')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default ImageUploadField;
