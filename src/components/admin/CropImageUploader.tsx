
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { uploadImage } from "@/utils/imageUtils";
import { useCropNames } from "@/utils/cropUtils";
import AddCropDialog from "./AddCropDialog";
import { RefreshCw, Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CropImage {
  cropName: string;
  imageUrl: string;
  lastModified?: string;
}

const CropImageUploader = () => {
  const [cropName, setCropName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cropImages, setCropImages] = useState<CropImage[]>([]);
  const [showAddCropDialog, setShowAddCropDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const { data: crops = [], refetch: refetchCrops } = useCropNames();
  
  useEffect(() => {
    checkAndCreateBucket();
  }, []);
  
  // Function to check if the bucket exists and create it if it doesn't
  const checkAndCreateBucket = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Checking for crop_images bucket...");
      
      // First check if the bucket exists
      const { data: buckets, error: listError } = await supabase
        .storage
        .listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        setError("Failed to check storage buckets. Please try again.");
        setIsLoading(false);
        return;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'crop_images');
      console.log("Bucket exists?", bucketExists);
      
      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        console.log("Creating crop_images bucket...");
        const { error: createError } = await supabase
          .storage
          .createBucket('crop_images', { 
            public: true,
            fileSizeLimit: 5242880 // 5MB
          });
          
        if (createError) {
          console.error("Error creating bucket:", createError);
          setError("Could not create storage bucket. Please check console for details.");
          setIsLoading(false);
          return;
        } else {
          console.log("Created crop_images bucket successfully");
          toast({
            title: "Storage bucket created",
            description: "Crop images storage has been set up successfully."
          });
        }
      }
      
      // Once we're sure the bucket exists, fetch existing images
      await fetchExistingImages();
      
    } catch (err) {
      console.error("Error checking/creating bucket:", err);
      setError("Error setting up storage. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchExistingImages = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching existing crop images...");
      
      // First check if the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'crop_images');
      
      if (!bucketExists) {
        console.log("Bucket doesn't exist, trying to create it...");
        await checkAndCreateBucket();
        return;
      }
      
      // Get all files from the crop_images bucket
      const { data, error } = await supabase.storage
        .from("crop_images")
        .list('', {
          sortBy: { column: 'name', order: 'asc' }
        });
        
      if (error) {
        console.error("Error listing files:", error);
        throw error;
      }
      
      console.log("Files found:", data?.length || 0);
      
      if (!data || data.length === 0) {
        setIsLoading(false);
        setCropImages([]);
        return;
      }
      
      // Extract crop names from file names and get public URLs
      const images: CropImage[] = [];
      
      for (const file of data) {
        if (file.name.includes('.')) {
          // Extract crop name from filename (remove extension)
          const cropName = file.name.split('.')[0];
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("crop_images")
            .getPublicUrl(file.name);
            
          images.push({
            cropName,
            imageUrl: publicUrl,
            // Use created_at instead of last_modified which doesn't exist on FileObject
            lastModified: file.created_at || undefined
          });
        }
      }
      
      setCropImages(images);
      console.log("Loaded", images.length, "crop images");
      
    } catch (error: any) {
      console.error("Error fetching crop images:", error);
      setError("Could not load existing crop images. " + error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load existing crop images."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !cropName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a crop and an image file",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // First ensure the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'crop_images');
      
      if (!bucketExists) {
        const { error: createError } = await supabase
          .storage
          .createBucket('crop_images', { 
            public: true,
            fileSizeLimit: 5242880 // 5MB
          });
          
        if (createError) {
          throw new Error("Could not create storage bucket: " + createError.message);
        }
        
        console.log("Created crop_images bucket for upload");
      }
      
      // Rename the file to match the crop name so we can easily find it later
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${cropName.toLowerCase()}.${fileExt}`;
      
      // Create a new File object with the renamed filename
      const renamedFile = new File([selectedFile], fileName, { type: selectedFile.type });
      
      // Upload the image
      console.log("Uploading image:", fileName);
      const publicUrl = await uploadImage(renamedFile, "crop_images", toast);
      
      if (publicUrl) {
        toast({
          title: "Upload successful",
          description: `Image for ${cropName} has been uploaded`,
        });
        
        // Refresh the list of crop images
        fetchExistingImages();
        
        // Reset form
        setCropName("");
        setSelectedFile(null);
        // Clear the file input
        const fileInput = document.getElementById('crop-image-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error: any) {
      console.error("Error uploading crop image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Could not upload the crop image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCropAdded = (newCropName: string) => {
    refetchCrops();
    setCropName(newCropName);
    toast({
      title: "Success",
      description: `New crop "${newCropName}" added`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upload Crop Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <FormItem className="w-full">
                  <FormLabel>Select Crop</FormLabel>
                  <Select value={cropName} onValueChange={setCropName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddCropDialog(true)}
                >
                  Add New Crop
                </Button>
              </div>
            </div>
            
            <FormItem>
              <FormLabel>Crop Image</FormLabel>
              <Input
                id="crop-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </FormItem>
            
            {selectedFile && (
              <div className="mt-2 p-2 border rounded">
                <p className="text-sm">Selected file: {selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !selectedFile || !cropName}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Upload Crop Image"}
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Existing Crop Images</CardTitle>
          <Button variant="outline" onClick={fetchExistingImages} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="text-center py-8">
              Loading crop images...
            </div>
          ) : cropImages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop Name</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cropImages.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.cropName}</TableCell>
                    <TableCell>
                      <div className="h-16 w-16 relative">
                        <img 
                          src={item.imageUrl} 
                          alt={item.cropName}
                          className="h-full w-full object-cover rounded-md"
                          onError={(e) => {
                            console.log(`Error loading image for ${item.cropName}`);
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              No crop images found. Upload your first image.
            </div>
          )}
        </CardContent>
      </Card>
      
      <AddCropDialog
        open={showAddCropDialog}
        onOpenChange={setShowAddCropDialog}
        cropNames={crops}
        onCropAdded={handleCropAdded}
      />
    </div>
  );
};

export default CropImageUploader;
