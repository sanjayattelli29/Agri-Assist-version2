
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface WeatherSectionProps {
  t: Record<string, string>;
  weatherData: any;
  location: { lat: number; lng: number } | null;
  formData: {
    temperature: string;
    humidity: string;
  };
  onGetLocation: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WeatherSection = ({
  t,
  weatherData,
  location,
  formData,
  onGetLocation,
  onChange,
}: WeatherSectionProps) => {
  return (
    <Card className="dark:bg-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{t.weatherHeading}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="temperature" className="text-sm font-medium block">
              {t.temperatureLabel}
            </Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              placeholder={t.temperaturePlaceholder}
              value={formData.temperature}
              onChange={onChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity" className="text-sm font-medium block">
              {t.humidityLabel}
            </Label>
            <Input
              id="humidity"
              name="humidity"
              type="number"
              placeholder={t.humidityPlaceholder}
              value={formData.humidity}
              onChange={onChange}
              required
              className="w-full"
            />
          </div>

          <div className="mt-6">
            <Label className="text-sm font-medium mb-3 block">
              {t.locationHeading}
            </Label>
            <Button
              type="button"
              onClick={onGetLocation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-5"
            >
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{t.currentLocationButton}</span>
            </Button>
            
            {weatherData && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium">{weatherData.locationName}</p>
                <p className="text-muted-foreground">{weatherData.district}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
