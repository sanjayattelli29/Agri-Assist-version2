
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const translations = {
  en: {
    title: "Soil Requirements Guide",
    selectCrop: "Select Crop",
    requirements: "Soil Requirements",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    temperature: "Temperature (°C)",
    humidity: "Humidity (%)",
    ph: "pH Level",
    rainfall: "Rainfall (mm)",
    loading: "Loading crop data...",
    error: "Error loading crop data",
    range: "Recommended Range",
  },
  hi: {
    title: "मिट्टी की आवश्यकताएं मार्गदर्शिका",
    selectCrop: "फसल चुनें",
    requirements: "मिट्टी की आवश्यकताएं",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फास्फोरस (P)",
    potassium: "पोटैशियम (K)",
    temperature: "तापमान (°C)",
    humidity: "आर्द्रता (%)",
    ph: "पीएच स्तर",
    rainfall: "वर्षा (मिमी)",
    loading: "फसल डेटा लोड हो रहा है...",
    error: "फसल डेटा लोड करने में त्रुटि",
    range: "अनुशंसित सीमा",
  },
  te: {
    title: "నేల అవసరాల మార్గదర్శి",
    selectCrop: "పంటను ఎంచుకోండి",
    requirements: "నేల అవసరాలు",
    nitrogen: "నైట్రోజన్ (N)",
    phosphorus: "ఫాస్పరస్ (P)",
    potassium: "పొటాషియం (K)",
    temperature: "ఉష్ణోగ్రత (°C)",
    humidity: "తేమ (%)",
    ph: "పిహెచ్ స్థాయి",
    rainfall: "వర్షపాతం (మిమీ)",
    loading: "పంట డేటా లోడ్ అవుతోంది...",
    error: "పంట డేటా లోడ్ చేయడంలో లోపం",
    range: "సిఫార్సు చేసిన పరిధి",
  },
};

const SoilRequirements = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];
  const [selectedCrop, setSelectedCrop] = useState<string>("");

  const { data: crops } = useQuery({
    queryKey: ["unique-crops"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_unique_crop_labels");
      if (error) throw error;
      return data;
    },
  });

  const { data: soilRequirements, isLoading } = useQuery({
    queryKey: ["soil-requirements", selectedCrop],
    enabled: !!selectedCrop,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("soil_requirements")
        .select("*")
        .eq("crop_name", selectedCrop)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const RequirementCard = ({ title, min, max, unit = "" }) => (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t.range}: {min}{unit} - {max}{unit}
          </p>
          <Progress value={50} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">{t.title}</h1>
        
        <div className="w-full max-w-md mx-auto mb-8">
          <Select onValueChange={setSelectedCrop} value={selectedCrop}>
            <SelectTrigger>
              <SelectValue placeholder={t.selectCrop} />
            </SelectTrigger>
            <SelectContent>
              {crops?.map((crop) => (
                <SelectItem key={crop.label} value={crop.label}>
                  {crop.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="text-center">{t.loading}</p>
        ) : soilRequirements ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RequirementCard 
              title={t.nitrogen}
              min={soilRequirements.nitrogen_min}
              max={soilRequirements.nitrogen_max}
            />
            <RequirementCard 
              title={t.phosphorus}
              min={soilRequirements.phosphorus_min}
              max={soilRequirements.phosphorus_max}
            />
            <RequirementCard 
              title={t.potassium}
              min={soilRequirements.potassium_min}
              max={soilRequirements.potassium_max}
            />
            <RequirementCard 
              title={t.temperature}
              min={soilRequirements.temperature_min}
              max={soilRequirements.temperature_max}
              unit="°C"
            />
            <RequirementCard 
              title={t.humidity}
              min={soilRequirements.humidity_min}
              max={soilRequirements.humidity_max}
              unit="%"
            />
            <RequirementCard 
              title={t.ph}
              min={soilRequirements.ph_min}
              max={soilRequirements.ph_max}
            />
            <RequirementCard 
              title={t.rainfall}
              min={soilRequirements.rainfall_min}
              max={soilRequirements.rainfall_max}
              unit="mm"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SoilRequirements;
