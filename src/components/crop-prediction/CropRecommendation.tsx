
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CropRecommendationProps {
  recommendation: {
    crop: string;
    efficiency: number;
  };
  t: Record<string, string>;
  isMain?: boolean;
}

export const CropRecommendation = ({
  recommendation,
  t,
  isMain = false,
}: CropRecommendationProps) => {
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.svg');
  const { getCropNameTranslation } = useLanguage();
  
  // Translate the crop name
  const translatedCropName = getCropNameTranslation(recommendation.crop);
  
  useEffect(() => {
    // Try to get image for the crop
    const fetchCropImage = async () => {
      try {
        // Check for jpg, png, and jpeg formats
        const formats = ['jpg', 'png', 'jpeg', 'webp'];
        let foundImage = false;
        
        // First check if the crop_images bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(bucket => bucket.name === 'crop_images');
        
        if (!bucketExists) {
          try {
            // Create the bucket if it doesn't exist
            await supabase.storage.createBucket('crop_images', {
              public: true,
              fileSizeLimit: 10485760, // 10MB
            });
            console.log("Created crop_images bucket");
          } catch (error) {
            console.error("Failed to create crop_images bucket:", error);
            setImageUrl('/placeholder.svg');
            return;
          }
        }
        
        for (const format of formats) {
          const fileName = `${recommendation.crop.toLowerCase()}.${format}`;
          
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('crop_images')
            .getPublicUrl(fileName);
          
          // Try to load the image to verify it exists
          try {
            const response = await fetch(publicUrl, { method: 'HEAD' });
            if (response.ok) {
              setImageUrl(publicUrl);
              foundImage = true;
              break;
            }
          } catch (error) {
            // Continue to the next format
          }
        }
        
        if (!foundImage) {
          // If no image found, set to placeholder
          setImageUrl('/placeholder.svg');
        }
      } catch (error) {
        console.error("Error fetching crop image:", error);
        setImageUrl('/placeholder.svg');
      }
    };
    
    fetchCropImage();
  }, [recommendation.crop]);

  if (isMain) {
    return (
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">{t.recommendedCrop}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                {translatedCropName}
              </span>
              <span>{recommendation.efficiency}% {t.suitabilityScore}</span>
            </div>
            <Progress 
              value={recommendation.efficiency} 
              className="h-2 bg-green-100 dark:bg-green-900"
            />
            <div className="aspect-video relative rounded-lg overflow-hidden mt-4">
              <img
                src={imageUrl}
                alt={translatedCropName}
                className="object-cover w-full h-full"
                onError={() => setImageUrl('/placeholder.svg')}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>{t.mlPrediction}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{translatedCropName}</span>
            <span>{recommendation.efficiency}% {t.suitabilityScore}</span>
          </div>
          <Progress 
            value={recommendation.efficiency} 
            className="h-2"
          />
          <div className="aspect-video relative rounded-lg overflow-hidden mt-4">
            <img
              src={imageUrl}
              alt={translatedCropName}
              className="object-cover w-full h-full"
              onError={() => setImageUrl('/placeholder.svg')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
