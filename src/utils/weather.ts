
import { supabase } from "@/integrations/supabase/client";

export async function fetchWeatherData(lat: number, lng: number) {
  const { data: settings, error: settingsError } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'weather_api_key')
    .single();

  if (settingsError) throw settingsError;

  // First fetch current weather data
  const weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${settings.value}`
  );
  
  if (!weatherResponse.ok) {
    throw new Error('Weather data fetch failed');
  }

  // Then fetch forecast data for the next 7 days
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${settings.value}`
  );

  if (!forecastResponse.ok) {
    throw new Error('Forecast data fetch failed');
  }

  // Then fetch location name using reverse geocoding
  const geoResponse = await fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${settings.value}`
  );

  if (!geoResponse.ok) {
    throw new Error('Geocoding fetch failed');
  }

  const weatherData = await weatherResponse.json();
  const forecastData = await forecastResponse.json();
  const geoData = await geoResponse.json();
  
  // Process the forecast data to get daily forecasts
  const dailyForecasts = processForecastData(forecastData);
  
  return {
    ...weatherData,
    dailyForecasts,
    locationName: geoData[0]?.name || 'Unknown Location',
    district: geoData[0]?.state || ''
  };
}

// Helper function to process forecast data into daily forecasts
function processForecastData(forecastData: any) {
  const dailyForecasts: any[] = [];
  const forecastMap = new Map();
  
  // OpenWeather forecast API returns data in 3-hour intervals
  // We need to group them by day and extract relevant information
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0];
    
    if (!forecastMap.has(dayKey) && dailyForecasts.length < 7) {
      forecastMap.set(dayKey, true);
      dailyForecasts.push({
        date: date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(item.main.temp),
        weather: item.weather[0].main,
        icon: item.weather[0].icon,
        description: item.weather[0].description
      });
    }
  });
  
  return dailyForecasts;
}
