
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/components/crop-prediction/translations";
import { SoilInputForm } from "@/components/crop-prediction/SoilInputForm";
import { WeatherSection } from "@/components/crop-prediction/WeatherSection";
import { CropRecommendation } from "@/components/crop-prediction/CropRecommendation";
import { AlgorithmRecommendations } from "@/components/crop-prediction/AlgorithmRecommendations";
import { useCropPrediction } from "@/hooks/useCropPrediction";

const CropPrediction = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const {
    formData,
    location,
    isSubmitting,
    weatherData,
    recommendations,
    algorithmRecommendations,
    handleInputChange,
    getCurrentLocation,
    handleSubmit
  } = useCropPrediction(language);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{t.cropPrediction}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.soilParametersHeading}</h2>
            <SoilInputForm
              formData={formData}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
              isSubmitting={isSubmitting}
              t={t}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">{t.weatherHeading}</h2>
            <WeatherSection
              t={t}
              weatherData={weatherData}
              location={location}
              formData={formData}
              onGetLocation={getCurrentLocation}
              onChange={handleInputChange}
            />

            {recommendations[0] && (
              <CropRecommendation
                recommendation={recommendations[0]}
                t={t}
                isMain={true}
              />
            )}
          </div>
        </div>

        {algorithmRecommendations && algorithmRecommendations.length > 0 && (
          <AlgorithmRecommendations 
            algorithmRecommendations={algorithmRecommendations} 
            t={t} 
          />
        )}
      </div>
    </div>
  );
};

export default CropPrediction;
