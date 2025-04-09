
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const translations = {
  en: {
    title: "Crop Rotation Guide",
    selectCrop: "Select Current Crop",
    nextCrop: "Recommended Next Crop",
    rotationPeriod: "Rotation Period",
    benefits: "Benefits",
    notes: "Notes",
    months: "months",
    loading: "Loading recommendations...",
    noCropSelected: "Please select a crop to see rotation recommendations",
    noRotationFound: "No rotation recommendations found for this crop",
  },
  hi: {
    title: "फसल चक्र मार्गदर्शिका",
    selectCrop: "वर्तमान फसल चुनें",
    nextCrop: "अनुशंसित अगली फसल",
    rotationPeriod: "चक्र अवधि",
    benefits: "लाभ",
    notes: "नोट्स",
    months: "महीने",
    loading: "सिफारिशें लोड हो रही हैं...",
    noCropSelected: "फसल चक्र की सिफारिशें देखने के लिए कृपया एक फसल चुनें",
    noRotationFound: "इस फसल के लिए कोई चक्र सिफारिश नहीं मिली",
  },
  te: {
    title: "పంట మార్పిడి మార్గదర్శి",
    selectCrop: "ప్రస్తుత పంటను ఎంచుకోండి",
    nextCrop: "సిఫార్సు చేయబడిన తదుపరి పంట",
    rotationPeriod: "మార్పిడి కాలం",
    benefits: "ప్రయోజనాలు",
    notes: "గమనికలు",
    months: "నెలలు",
    loading: "సిఫార్సులు లోడ్ అవుతున్నాయి...",
    noCropSelected: "రొటేషన్ సిఫార్సులను చూడటానికి దయచేసి ఒక పంటను ఎంచుకోండి",
    noRotationFound: "ఈ పంట కోసం రొటేషన్ సిఫార్సులు కనుగొనబడలేదు",
  },
};

const CropRotation = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const { toast } = useToast();

  // Fetch current crop names directly from crop_rotation_rules
  const { data: crops, isLoading: isLoadingCrops } = useQuery({
    queryKey: ["crop-rotation-current-crops"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("crop_rotation_rules")
          .select("current_crop")
          .order("current_crop");
          
        if (error) {
          console.error("Error fetching crops:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch crop options",
          });
          throw error;
        }
        
        // Get unique crop names
        const uniqueCrops = Array.from(new Set(data.map(item => item.current_crop)))
          .map(crop => ({ current_crop: crop }));
        
        return uniqueCrops;
      } catch (error) {
        console.error("Error in crop fetch query:", error);
        return [];
      }
    },
  });

  const { data: rotationRules, isLoading: isLoadingRules } = useQuery({
    queryKey: ["rotation-rules", selectedCrop],
    enabled: !!selectedCrop,
    queryFn: async () => {
      try {
        console.log("Fetching rotation rules for crop:", selectedCrop);
        const { data, error } = await supabase
          .from("crop_rotation_rules")
          .select("*")
          .eq("current_crop", selectedCrop)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching rotation rules:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch rotation rules",
          });
          throw error;
        }
        
        console.log("Rotation rules data:", data);
        return data;
      } catch (error) {
        console.error("Error fetching rotation rules:", error);
        return null;
      }
    },
  });

  // Log selected crop for debugging
  useEffect(() => {
    if (selectedCrop) {
      console.log("Selected crop:", selectedCrop);
    }
  }, [selectedCrop]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">{t.title}</h1>
        
        <div className="w-full max-w-md mx-auto mb-8">
          <Select onValueChange={setSelectedCrop} value={selectedCrop}>
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <SelectValue placeholder={t.selectCrop} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCrops ? (
                <SelectItem value="loading" disabled>Loading crops...</SelectItem>
              ) : crops && crops.length > 0 ? (
                crops.map((crop) => (
                  <SelectItem key={crop.current_crop} value={crop.current_crop}>
                    {crop.current_crop}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-crops" disabled>No crops found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {!selectedCrop ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">{t.noCropSelected}</p>
            </CardContent>
          </Card>
        ) : isLoadingRules ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-center">{t.loading}</p>
            </CardContent>
          </Card>
        ) : rotationRules ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-center gap-4">
                <span className="text-xl font-semibold">{selectedCrop}</span>
                <ArrowRight className="w-6 h-6" />
                <span className="text-xl font-semibold">{rotationRules.next_crop}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">{t.rotationPeriod}</h3>
                <p>{rotationRules.rotation_months} {t.months}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t.benefits}</h3>
                <p>{rotationRules.benefits || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t.notes}</h3>
                <p>{rotationRules.notes || "-"}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">{t.noRotationFound}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CropRotation;
