
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface AlgorithmRecommendationProps {
  algorithmRecommendations: Array<{
    algorithmName: string;
    crop: string;
    accuracy: number;
  }>;
  t: Record<string, string>;
}

export const AlgorithmRecommendations = ({ 
  algorithmRecommendations,
  t 
}: AlgorithmRecommendationProps) => {
  const { getCropNameTranslation } = useLanguage();
  const [cropImages, setCropImages] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Fetch images for each crop
    const fetchCropImages = async () => {
      const cropNames = algorithmRecommendations.map(rec => rec.crop);
      const uniqueCrops = [...new Set(cropNames)];
      
      const imageMap: Record<string, string> = {};
      
      for (const crop of uniqueCrops) {
        try {
          // Check for jpg, png, and jpeg formats
          const formats = ['jpg', 'png', 'jpeg', 'webp'];
          let foundImage = false;
          
          for (const format of formats) {
            const fileName = `${crop.toLowerCase()}.${format}`;
            
            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('crop_images')
              .getPublicUrl(fileName);
            
            // Try to load the image to verify it exists
            try {
              const response = await fetch(publicUrl, { method: 'HEAD' });
              if (response.ok) {
                imageMap[crop] = publicUrl;
                foundImage = true;
                break;
              }
            } catch (error) {
              // Continue to the next format
            }
          }
          
          if (!foundImage) {
            // If no image found, set to placeholder
            imageMap[crop] = '/placeholder.svg';
          }
        } catch (error) {
          console.error("Error fetching crop image:", error);
          imageMap[crop] = '/placeholder.svg';
        }
      }
      
      setCropImages(imageMap);
    };
    
    if (algorithmRecommendations.length > 0) {
      fetchCropImages();
    }
  }, [algorithmRecommendations]);

  if (!algorithmRecommendations || algorithmRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">{t.algorithmResults}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {algorithmRecommendations.map((rec, index) => (
          <Card key={index} className="overflow-hidden dark:bg-gray-800">
            <div className="aspect-video w-full relative">
              <img
                src={cropImages[rec.crop] || '/placeholder.svg'}
                alt={getCropNameTranslation(rec.crop)}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-green-600 dark:text-green-400">
                    {getCropNameTranslation(rec.crop)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {rec.algorithmName}
                  </p>
                </div>
                <span className="font-semibold">
                  {rec.accuracy}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
