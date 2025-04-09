
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const body = await req.json();
    const { action } = body;
    
    if (action === 'create_bucket') {
      console.log("Creating chatbot_data bucket...");
      
      // First check if the bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        throw new Error(`Could not check if bucket exists: ${listError.message}`);
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'chatbot_data');
      
      if (!bucketExists) {
        const { data, error } = await supabase.storage.createBucket('chatbot_data', {
          public: true
        });
        
        if (error) {
          console.error("Error creating bucket:", error);
          throw error;
        }
        
        return new Response(
          JSON.stringify({ message: 'Bucket created successfully', data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ message: 'Bucket already exists' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (action === 'list_files') {
      const { data, error } = await supabase.storage
        .from('chatbot_data')
        .list();
        
      if (error) {
        console.error("Error listing files:", error);
        throw error;
      }
      
      return new Response(
        JSON.stringify({ files: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'add_knowledge') {
      const { content, keywords, response_en, response_hi, response_te, response_kn, response_ml, source } = body;
      
      // Add to agricultural_knowledge table
      const { data, error } = await supabase
        .from('agricultural_knowledge')
        .insert([
          { 
            keywords,
            response_en,
            response_hi,
            response_te,
            response_kn,
            response_ml,
            source,
            content
          }
        ])
        .select();
      
      if (error) {
        console.error("Error adding knowledge:", error);
        throw error;
      }
      
      return new Response(
        JSON.stringify({ message: 'Knowledge added successfully', data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in chatbot-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
