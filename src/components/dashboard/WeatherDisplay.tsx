import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchWeatherData } from "@/utils/weather";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Thermometer, 
  Loader2, 
  Droplets, 
  Wind, 
  Sun, 
  CloudFog,
  CloudSnow
} from "lucide-react";
import { motion } from "framer-motion";

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface MainWeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
}

interface WeatherLocation {
  locationName: string;
  district: string;
}

interface DailyForecast {
  day: string;
  temp: number;
  description: string;
  icon: string;
}

interface WeatherData {
  weather: WeatherCondition[];
  main: MainWeatherData;
  locationName: string;
  district: string;
  dailyForecasts: DailyForecast[];
}

const weatherTranslations = {
  weatherTitle: {
    en: "Current Weather",
    hi: "मौसम की जानकारी",
    te: "ప్రస్తుత వాతావరణం",
    kn: "ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
    ml: "നിലവിലെ കാലാവസ്ഥ"
  },
  forecast: {
    en: "7-Day Forecast",
    hi: "7 दिन का पूर्वानुमान",
    te: "7-రోజుల ముందస్తు సూచన",
    kn: "7-ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
    ml: "7 ദിവസത്തെ പ്രവചനം"
  },
  loading: {
    en: "Loading weather...",
    hi: "मौसम लोड हो रहा है...",
    te: "వాతావరణం లోడ్ అవుతోంది...",
    kn: "ಹವಾಮಾನ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    ml: "കാലാവസ്ഥ ലോഡുചെയ്യുന്നു..."
  },
  fetchError: {
    en: "Could not fetch weather",
    hi: "मौसम की जानकारी प्राप्त नहीं हो सकी",
    te: "వాతావరణాన్ని పొందలేకపోయింది",
    kn: "ಹವಾಮಾನವನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",
    ml: "കാലാവസ്ഥ ലഭ്യമാക്കാൻ കഴിഞ്ഞില്ല"
  },
  humidity: {
    en: "Humidity",
    hi: "आर्द्रता",
    te: "తేమ",
    kn: "ತೇವಾಂಶ",
    ml: "ആർദ്രത"
  },
  feelsLike: {
    en: "Feels like",
    hi: "महसूस होता है",
    te: "అనిపిస్తుంది",
    kn: "ಹೀಗೆ ಭಾಸವಾಗುತ್ತದೆ",
    ml: "തോന്നുന്നു"
  }
};

export const WeatherDisplay = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const getTranslation = (key: keyof typeof weatherTranslations) => {
    return weatherTranslations[key][language as keyof typeof weatherTranslations[typeof key]] || weatherTranslations[key].en;
  };

  useEffect(() => {
    const getCurrentWeather = async () => {
      if (navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const weatherData = await fetchWeatherData(
                  position.coords.latitude,
                  position.coords.longitude
                );
                setWeather(weatherData);
                setLoading(false);
              } catch (err) {
                console.error("Failed to fetch weather:", err);
                setError(getTranslation("fetchError"));
                setLoading(false);
                toast({
                  title: getTranslation("fetchError"),
                  variant: "destructive",
                });
              }
            },
            (geoError) => {
              console.error("Geolocation error:", geoError);
              setError(getTranslation("fetchError"));
              setLoading(false);
              toast({
                title: getTranslation("fetchError"),
                description: "Please allow location access to see weather.",
                variant: "destructive",
              });
            }
          );
        } catch (err) {
          console.error("Geolocation error:", err);
          setError(getTranslation("fetchError"));
          setLoading(false);
        }
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    getCurrentWeather();
  }, [language, toast]);

  const getWeatherIcon = (weatherId?: number, iconCode?: string) => {
    if (!weatherId) return <CloudSun className="h-10 w-10 text-yellow-500" />;
    
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning className="h-10 w-10 text-yellow-500" />;
    } else if (weatherId >= 300 && weatherId < 400) {
      return <CloudRain className="h-10 w-10 text-blue-300" />; 
    } else if (weatherId >= 500 && weatherId < 600) {
      return <CloudRain className="h-10 w-10 text-blue-500" />;
    } else if (weatherId >= 600 && weatherId < 700) {
      return <CloudSnow className="h-10 w-10 text-blue-200" />;
    } else if (weatherId >= 700 && weatherId < 800) {
      return <CloudFog className="h-10 w-10 text-gray-400" />;
    } else if (weatherId === 800) {
      return <Sun className="h-10 w-10 text-yellow-500" />;
    } else {
      return <CloudSun className="h-10 w-10 text-yellow-500" />;
    }
  };

  const getForecastIcon = (iconCode: string) => {
    const iconSize = "h-6 w-6";
    
    if (iconCode.includes('11')) {
      return <CloudLightning className={`${iconSize} text-yellow-500`} />;
    } else if (iconCode.includes('09') || iconCode.includes('10')) {
      return <CloudRain className={`${iconSize} text-blue-500`} />;
    } else if (iconCode.includes('13')) {
      return <CloudSnow className={`${iconSize} text-blue-300`} />;
    } else if (iconCode.includes('50')) {
      return <CloudFog className={`${iconSize} text-gray-400`} />;
    } else if (iconCode.includes('01')) {
      return <Sun className={`${iconSize} text-yellow-500`} />;
    } else if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
      return <CloudSun className={`${iconSize} text-yellow-500`} />;
    } else {
      return <CloudSun className={`${iconSize} text-yellow-500`} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-green-500 mr-2" />
        <p>{getTranslation("loading")}</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="text-center py-4 text-red-500">
        {error || getTranslation("fetchError")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current Weather Card */}
        <Card className="lg:col-span-1 overflow-hidden bg-gradient-to-br from-green-900 to-green-950 text-white shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div>
              <h3 className="font-semibold text-lg text-green-100">{getTranslation("weatherTitle")}</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">{weather.locationName}</p>
              <p className="text-green-200">{weather.district}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-center">
                {getWeatherIcon(weather.weather[0]?.id, weather.weather[0]?.icon)}
              </div>
              <div className="text-right">
                <p className="font-bold text-2xl sm:text-3xl">{Math.round(weather.main.temp)}°C</p>
                <p className="text-green-100">{weather.weather[0]?.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6">
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-orange-300" />
                <span className="text-sm sm:text-base">{getTranslation("feelsLike")}: {Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="flex items-center">
                <Droplets className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-blue-300" />
                <span className="text-sm sm:text-base">{getTranslation("humidity")}: {weather.main.humidity}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        {weather.dailyForecasts && weather.dailyForecasts.length > 0 && (
          <Card className="lg:col-span-2 overflow-hidden bg-gradient-to-br from-green-900/90 to-green-950/90 text-white shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-lg text-green-100 mb-2 sm:mb-4">{getTranslation("forecast")}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3 overflow-x-auto">
                {weather.dailyForecasts.map((forecast: DailyForecast, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-green-800/50 rounded-lg p-2 sm:p-3 text-center min-w-[70px]"
                  >
                    <p className="font-medium text-xs sm:text-sm text-green-200 truncate">{forecast.day}</p>
                    <div className="py-1 sm:py-2 flex justify-center">
                      {getForecastIcon(forecast.icon)}
                    </div>
                    <p className="text-base sm:text-lg font-bold">{forecast.temp}°C</p>
                    <p className="text-xs text-green-200 truncate">{forecast.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
