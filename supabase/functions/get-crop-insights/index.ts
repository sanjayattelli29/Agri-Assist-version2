
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }
  
  try {
    const { category } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
    
    const validCategories = [
      'crop_productivity', 'sustainable_farming', 'organic_farming', 
      'crop_diseases', 'water_management', 'soil_health', 
      'climate_adaptations', 'modern_techniques', 'market_trends',
      'government_policies', 'farm_equipment', 'crop_rotation',
      'pest_management', 'fertilizer_optimization', 'crop_varieties'
    ]
    
    const selectedCategory = category && validCategories.includes(category) 
      ? category 
      : validCategories[Math.floor(Math.random() * validCategories.length)]
    
    const prompt = `
      Generate 15 key insights about ${selectedCategory.replace('_', ' ')} in Indian agriculture.
      Focus specifically on India's agricultural context.
      Format the response as a JSON array with objects having these fields:
      - title: A short, catchy title for the insight
      - description: A brief 1-2 sentence explanation
      - impact: Either "High", "Medium", or "Low" indicating the impact level
      - source: A fictional but plausible source name (like "Indian Agricultural Research Institute" or "National Crop Foundation")
      
      The insights should be diverse, covering different regions of India when appropriate.
    `

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 2048,
        }
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Gemini API error:', data)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch insights from Gemini API' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
    
    // Extract and parse the JSON content from Gemini's response
    try {
      const textContent = data.candidates[0].content.parts[0].text
      // Extract the JSON part from the text (in case Gemini adds explanatory text)
      const jsonMatch = textContent.match(/\[[\s\S]*\]/)
      const jsonString = jsonMatch ? jsonMatch[0] : textContent
      const insights = JSON.parse(jsonString)
      
      return new Response(
        JSON.stringify({ 
          insights,
          category: selectedCategory,
          generatedAt: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (error) {
      console.error('Error parsing Gemini response:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse insights from Gemini API',
          rawResponse: data.candidates[0].content.parts[0].text
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
