
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * Validates file size and type for image uploads
 */
export const validateImageFile = (
  file: File,
  toast: ReturnType<typeof useToast>["toast"]
): boolean => {
  if (file.size > MAX_FILE_SIZE) {
    toast({
      variant: "destructive",
      title: "File too large",
      description: "Image size should be less than 5MB",
    });
    return false;
  }
  
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    toast({
      variant: "destructive",
      title: "Invalid file type",
      description: "Please upload a valid image file (JPEG, PNG, WebP)",
    });
    return false;
  }
  
  return true;
};

/**
 * Uploads image to Supabase storage and returns public URL
 */
export const uploadImage = async (
  file: File,
  bucketName: "pesticide_images" | "fertilizer_images" | "crop_images",
  toast: ReturnType<typeof useToast>["toast"]
): Promise<string | null> => {
  if (!file) return null;
  
  if (!validateImageFile(file, toast)) {
    return null;
  }
  
  try {
    // Check if the bucket exists and create it if it doesn't
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      throw new Error(`Could not check if bucket exists: ${listError.message}`);
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Bucket ${bucketName} does not exist, creating it...`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE
      });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        throw new Error(`Could not create storage bucket: ${createError.message}`);
      }
      
      console.log(`Successfully created bucket ${bucketName}`);
      
      // Create public access policy for the bucket
      const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl('dummy.txt', 1);
      
      if (policyError && !policyError.message.includes('not found')) {
        console.error(`Error checking bucket policy:`, policyError);
      }
    }
    
    // Create a unique file name to avoid conflicts
    const fileExt = file.name.split('.').pop();
    const fileName = `${file.name}`;
    const filePath = `${fileName}`;
    
    console.log(`Attempting to upload ${fileName} to ${bucketName} bucket...`);
    
    // Upload the file to the specified bucket with public access
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
      
    if (uploadError) {
      console.error("Upload error:", uploadError);
      
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: uploadError.message || "Could not upload image",
      });
      
      return null;
    }
    
    console.log(`Successfully uploaded file to ${bucketName}:`, data);
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
    
    return publicUrl;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: error.message || "Could not upload image",
    });
    
    return null;
  }
};
