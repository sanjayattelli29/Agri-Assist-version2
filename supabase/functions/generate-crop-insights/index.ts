
import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SoilRequirements {
  crop_name: string;
  nitrogen_min: number;
  nitrogen_max: number;
  phosphorus_min: number;
  phosphorus_max: number;
  potassium_min: number;
  potassium_max: number;
  temperature_min: number;
  temperature_max: number;
  humidity_min: number;
  humidity_max: number;
  ph_min: number;
  ph_max: number;
  rainfall_min: number;
  rainfall_max: number;
}

interface CropInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

function calculateCropSuitability(requirements: SoilRequirements, input: CropInput): number {
  const factors = [
    {
      value: input.nitrogen,
      min: requirements.nitrogen_min,
      max: requirements.nitrogen_max,
      weight: 0.15
    },
    {
      value: input.phosphorus,
      min: requirements.phosphorus_min,
      max: requirements.phosphorus_max,
      weight: 0.15
    },
    {
      value: input.potassium,
      min: requirements.potassium_min,
      max: requirements.potassium_max,
      weight: 0.15
    },
    {
      value: input.temperature,
      min: requirements.temperature_min,
      max: requirements.temperature_max,
      weight: 0.15
    },
    {
      value: input.humidity,
      min: requirements.humidity_min,
      max: requirements.humidity_max,
      weight: 0.15
    },
    {
      value: input.ph,
      min: requirements.ph_min,
      max: requirements.ph_max,
      weight: 0.1
    },
    {
      value: input.rainfall,
      min: requirements.rainfall_min,
      max: requirements.rainfall_max,
      weight: 0.15
    }
  ];

  let totalScore = 0;
  
  for (const factor of factors) {
    let score = 0;
    if (factor.value >= factor.min && factor.value <= factor.max) {
      score = 1;
    } else {
      const midpoint = (factor.max + factor.min) / 2;
      const range = factor.max - factor.min;
      const distance = Math.abs(factor.value - midpoint);
      score = Math.max(0, 1 - (distance / range));
    }
    totalScore += score * factor.weight;
  }

  return Math.round(totalScore * 100);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { predictedCrop, soilData } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get soil requirements for all crops
    const { data: soilRequirements, error: requirementsError } = await supabase
      .from('soil_requirements')
      .select('*');

    if (requirementsError) throw requirementsError;

    // Calculate suitability scores for all crops
    const recommendations = soilRequirements.map((requirements: SoilRequirements) => ({
      crop: requirements.crop_name,
      efficiency: calculateCropSuitability(requirements, soilData)
    }));

    // Sort by efficiency and get top 4
    recommendations.sort((a, b) => b.efficiency - a.efficiency);
    const topRecommendations = recommendations.slice(0, 4);

    console.log('Generated recommendations:', topRecommendations);

    return new Response(
      JSON.stringify({ recommendations: topRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-crop-insights:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
