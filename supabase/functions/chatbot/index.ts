
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_API_KEY = "AIzaSyCHMW2v3BcNExYjDt94ifqyt0b42uRBAY4";
const SEARCH_ENGINE_ID = "2067264e4b2334f7f";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Processing chatbot request in language: ${language}`);
    
    // Fetch agricultural knowledge from the database
    const { data: knowledgeData, error: knowledgeError } = await supabase
      .from('agricultural_knowledge')
      .select('*');
      
    if (knowledgeError) {
      console.error('Error fetching knowledge data:', knowledgeError);
      throw new Error('Failed to fetch knowledge base');
    }
    
    // Enhanced keyword matching algorithm
    let response = "";
    const messageLC = message.toLowerCase();
    const messageParts = messageLC.split(/\s+/); // Split by whitespace to get individual words
    
    // Store all matches with their scores
    const matchedItems = [];
    
    for (const item of knowledgeData) {
      const keywordsLC = item.keywords?.toLowerCase() || '';
      const keywordParts = keywordsLC.split(/\s*,\s*/); // Split by comma and trim spaces
      let score = 0;
      let matchedKeywords = [];
      
      // Check for exact phrase match first (highest priority)
      if (keywordsLC.includes(messageLC)) {
        score += 10;
        matchedKeywords.push(messageLC);
      }
      
      // Check for individual keyword matches
      for (const keyword of keywordParts) {
        const keywordTrimmed = keyword.trim();
        if (keywordTrimmed.length > 2) { // Only consider keywords with more than 2 characters
          // Check for full keyword match
          if (messageLC.includes(keywordTrimmed)) {
            score += 3;
            matchedKeywords.push(keywordTrimmed);
          } else {
            // Check for partial matches in individual words of the message
            for (const messagePart of messageParts) {
              if (messagePart.length > 3 && keywordTrimmed.includes(messagePart)) {
                score += 1; // Lower score for partial match
                matchedKeywords.push(messagePart);
              }
            }
          }
        }
      }
      
      // Add to matched items if any matches found
      if (score > 0) {
        matchedItems.push({
          item,
          score,
          matchedKeywords: [...new Set(matchedKeywords)] // Remove duplicates
        });
      }
    }
    
    // Sort by score (descending)
    matchedItems.sort((a, b) => b.score - a.score);
    
    console.log(`Found ${matchedItems.length} matches, best score: ${matchedItems[0]?.score || 0}`);
    
    let source = null;
    let matchedKeywords = [];
    let shouldStoreResponse = false;
    let summary = "";
    
    // If we found matches in our database
    if (matchedItems.length > 0 && matchedItems[0].score >= 3) {
      // Get the best match (highest score)
      const bestMatch = matchedItems[0].item;
      source = bestMatch.source;
      matchedKeywords = matchedItems[0].matchedKeywords;
      
      // Choose response based on language
      if (language === 'en') {
        response = bestMatch.response_en;
      } else if (language === 'hi') {
        response = bestMatch.response_hi || bestMatch.response_en;
      } else if (language === 'te') {
        response = bestMatch.response_te || bestMatch.response_en;
      } else if (language === 'kn') {
        response = bestMatch.response_kn || bestMatch.response_en;
      } else if (language === 'ml') {
        response = bestMatch.response_ml || bestMatch.response_en;
      } else {
        response = bestMatch.response_en;
      }
      
      // Generate a summary (first 2-3 sentences or ~100 characters)
      summary = response.split(/[.!?]+/g).slice(0, 2).join('. ') + '.';
      if (summary.length > 150) {
        summary = summary.substring(0, 147) + '...';
      }
      
      // If there are multiple good matches with similar scores, append related information
      if (matchedItems.length > 1 && matchedItems[1].score > Math.max(3, matchedItems[0].score * 0.7)) {
        const secondMatch = matchedItems[1].item;
        let additionalInfo;
        
        if (language === 'en') {
          additionalInfo = secondMatch.response_en;
        } else if (language === 'hi') {
          additionalInfo = secondMatch.response_hi || secondMatch.response_en;
        } else if (language === 'te') {
          additionalInfo = secondMatch.response_te || secondMatch.response_en;
        } else if (language === 'kn') {
          additionalInfo = secondMatch.response_kn || secondMatch.response_en;
        } else if (language === 'ml') {
          additionalInfo = secondMatch.response_ml || secondMatch.response_en;
        } else {
          additionalInfo = secondMatch.response_en;
        }
        
        // Add a separator and the related information
        const relatedInfoPrefix = {
          'en': "\n\nAdditionally, you might find this relevant: ",
          'hi': "\n\nइसके अलावा, यह भी प्रासंगिक हो सकता है: ",
          'te': "\n\nఅదనంగా, మీరు దీన్ని సంబంధితంగా కనుగొనవచ్చు: ",
          'kn': "\n\nಇದಲ್ಲದೆ, ಇದು ನಿಮಗೆ ಸಂಬಂಧಿಸಿದ್ದಾಗಿರಬಹುದು: ",
          'ml': "\n\nകൂടാതെ, ഇതും പ്രസക്തമായി കണ്ടേക്കാം: "
        };
        
        response += relatedInfoPrefix[language as keyof typeof relatedInfoPrefix] || relatedInfoPrefix.en;
        response += additionalInfo;
      }
    } else {
      // No good match found in database, use Google Search API
      console.log("No good match found in database, querying Google Search API");
      
      try {
        // Prepare search query - add "agriculture" keyword if not present to keep results relevant
        let searchQuery = message;
        if (!searchQuery.toLowerCase().includes("agriculture") && 
            !searchQuery.toLowerCase().includes("farming") && 
            !searchQuery.toLowerCase().includes("crop")) {
          searchQuery += " agriculture farming";
        }
        
        const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}`;
        
        const googleResponse = await fetch(googleSearchUrl);
        const searchData = await googleResponse.json();
        
        if (searchData.items && searchData.items.length > 0) {
          // Extract and combine information from top 2 search results
          const topResults = searchData.items.slice(0, 2);
          source = topResults[0].link;
          
          // Format the initial summary response
          let summaryText = topResults[0].snippet;
          summary = summaryText.length > 150 ? summaryText.substring(0, 147) + '...' : summaryText;
          
          // Format the full response based on search results
          response = `${topResults[0].snippet}\n\n`;
          
          if (topResults.length > 1) {
            response += `Additionally:\n${topResults[1].snippet}\n\n`;
          }
          
          // Add sources
          topResults.forEach((item, index) => {
            response += `Source ${index + 1}: ${item.link}\n`;
          });
          
          shouldStoreResponse = true; // Flag to store this response in our database
          
          // Extract potential keywords from the query
          matchedKeywords = message.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 5); // Take up to 5 significant words as keywords
          
          // If the language is not English, translate the response
          if (language !== 'en') {
            try {
              // Use Google Translate API to translate the response
              const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;
              const translateResponse = await fetch(translateUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  q: [summary, response],
                  target: language,
                  format: 'text'
                })
              });
              
              const translateData = await translateResponse.json();
              
              if (translateData.data && translateData.data.translations) {
                summary = translateData.data.translations[0].translatedText;
                response = translateData.data.translations[1].translatedText;
              }
            } catch (translateError) {
              console.error("Error translating:", translateError);
              // Continue with the untranslated response if translation fails
            }
          }
        } else {
          // Default responses in different languages if even Google doesn't have results
          if (language === 'en') {
            summary = response = "I couldn't find specific information about that topic. Could you please rephrase your question about agriculture or farming?";
          } else if (language === 'hi') {
            summary = response = "मुझे इस विषय के बारे में विशिष्ट जानकारी नहीं मिली। क्या आप कृपया कृषि के बारे में अपना प्रश्न दोबारा पूछ सकते हैं?";
          } else if (language === 'te') {
            summary = response = "నాకు ఆ విషయం గురించి నిర్దిష్ట సమాచారం దొరకలేదు. దయచేసి వ్యవసాయం గురించి మీ ప్రశ్నను మళ్ళీ అడగగలరా?";
          } else if (language === 'kn') {
            summary = response = "ನನಗೆ ಆ ವಿಷಯದ ಬಗ್ಗೆ ನಿರ್ದಿಷ್ಟ ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೃಷಿಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೊಮ್ಮೆ ಕೇಳಬಹುದೇ?";
          } else if (language === 'ml') {
            summary = response = "എനിക്ക് ആ വിഷയത്തെക്കുറിച്ച് പ്രത്യേക വിവരങ്ങൾ കണ്ടെത്താൻ കഴിഞ്ഞില്ല. കൃഷിയെക്കുറിച്ചുള്ള നിങ്ങളുടെ ചോദ്യം വീണ്ടും ചോദിക്കാമോ?";
          } else {
            summary = response = "I couldn't find specific information about that topic. Could you please rephrase your question about agriculture or farming?";
          }
        }
      } catch (searchError) {
        console.error("Error with Google Search:", searchError);
        
        // Default responses in different languages if search fails
        if (language === 'en') {
          summary = response = "I'm having trouble searching for information right now. Please try again later or ask a different question about farming.";
        } else if (language === 'hi') {
          summary = response = "मुझे अभी जानकारी खोजने में परेशानी हो रही है। कृपया बाद में पुनः प्रयास करें या कृषि के बारे में कोई अलग प्रश्न पूछें।";
        } else if (language === 'te') {
          summary = response = "నేను ప్రస్తుతం సమాచారాన్ని శోధించడంలో ఇబ్బంది పడుతున్నాను. దయచేసి తర్వాత మళ్ళీ ప్రయత్నించండి లేదా వ్యవసాయం గురించి వేరే ప్రశ్న అడగండి.";
        } else if (language === 'kn') {
          summary = response = "ನಾನು ಈಗ ಮಾಹಿತಿಯನ್ನು ಹುಡುಕುವಲ್ಲಿ ತೊಂದರೆ ಅನುಭವಿಸುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಕೃಷಿಯ ಬಗ್ಗೆ ಬೇರೆ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.";
        } else if (language === 'ml') {
          summary = response = "എനിക്ക് ഇപ്പോൾ വിവരങ്ങൾ തിരയുന്നതിൽ ബുദ്ധിമുട്ടുണ്ട്. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ കൃഷിയെക്കുറിച്ച് മറ്റൊരു ചോദ്യം ചോദിക്കുക.";
        } else {
          summary = response = "I'm having trouble searching for information right now. Please try again later or ask a different question about farming.";
        }
      }
    }
    
    console.log(`Responding with: ${response.substring(0, 50)}...`);
    
    // If this is a new response from Google that we should store in our database
    if (shouldStoreResponse) {
      try {
        const keywords = matchedKeywords.join(", ");
        
        // Store the new knowledge in our database for future use
        const { error: insertError } = await supabase
          .from('agricultural_knowledge')
          .insert({
            keywords: keywords,
            response_en: response,
            source: source,
            content: message // Store the original query
          });
          
        if (insertError) {
          console.error("Error storing new knowledge:", insertError);
        } else {
          console.log("Successfully stored new knowledge from Google Search");
        }
      } catch (storeError) {
        console.error("Error in storing process:", storeError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        summary: summary,
        response: response,
        source: source,
        matchedKeywords: matchedKeywords
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in chatbot function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
