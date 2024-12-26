import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const MISTRAL_API_KEY = Deno.env.get('MISTRAL_API_KEY');
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

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
    const { message } = await req.json();

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          {
            role: "system",
            content: "You are a helpful PostgreSQL expert with knowledge of R and Python. Your primary focus is helping users write and translate between PostgreSQL, R, and Python code. Your capabilities include:\n\n1. Writing PostgreSQL queries\n2. Translating PostgreSQL queries to equivalent R code using libraries like DBI and RPostgres\n3. Translating PostgreSQL queries to equivalent Python code using libraries like pandas and SQLAlchemy\n4. Converting R and Python data manipulation code to PostgreSQL queries\n\nKeep your responses focused on query writing and translations. Provide concise, English-only responses. If asked about other topics, politely redirect the conversation to database-related matters. Format all code examples in code blocks and include brief explanations of the translations. Keep explanations brief and to the point."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('Mistral API response:', data);

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-with-mistral function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});