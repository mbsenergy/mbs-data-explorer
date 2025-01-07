import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MISTRAL_API_KEY = Deno.env.get('MISTRAL_API_KEY');
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, mode, includeDocuments } = await req.json();

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let context = '';

    if (mode === 'data') {
      // Get available tables for data mode
      const { data: tables, error: tablesError } = await supabaseAdmin
        .rpc('get_available_tables');

      if (tablesError) throw tablesError;

      context = `Available tables in the database: ${tables
        .map((t: { tablename: string }) => t.tablename)
        .join(', ')}`;
    } else if (mode === 'energy' && includeDocuments) {
      // Search through relevant storage buckets for documents
      const buckets = ['reports', 'osservatorio-energia', 'report-scenario', 'newsletter', 'publications', 'developer'];
      const documents = [];

      for (const bucket of buckets) {
        const { data, error } = await supabaseAdmin.storage
          .from(bucket)
          .list();

        if (!error && data) {
          documents.push(...data.map(file => ({
            ...file,
            bucket
          })));
        }
      }

      context = `Available documents: ${documents.map(doc => 
        `${doc.name} (in ${doc.bucket})`).join(', ')}`;
    }

    const systemPrompt = mode === 'data' ? `You are a helpful database assistant for the Flux Data Platform. You help users understand and query the available datasets.

${context}

Your capabilities include:
1. Explaining what data is available in specific tables
2. Helping users write READ-ONLY SQL queries (SELECT statements only)
3. Providing guidance on which tables to use for specific analyses
4. Explaining the meaning of columns and data fields
5. Suggesting relevant tables based on user questions

IMPORTANT SECURITY RULES:
- You must ONLY provide SELECT queries
- NEVER suggest or provide queries with INSERT, UPDATE, DELETE, DROP, ALTER, or any other data-modifying statements
- Always include a LIMIT clause in your queries to prevent performance issues
- Warn users if they request any data-modifying operations

Table naming convention:
- EC01_* tables contain Eurostat economic data
- ME01_* tables contain market and energy data
- MS01_* tables contain miscellaneous data
- TS01_* tables contain time series data` 
    : 
    `You are an AI agent with advanced expertise in economics, finance, and the energy sector, with access to various documents and reports.

${context}

Context and Expertise:
You have comprehensive knowledge of macroeconomics, microeconomics, fiscal and monetary policies, global financial markets, investment strategies, and the renewable energy transition. You stay up-to-date on energy policies, oil and gas trends, and carbon trading mechanisms.

Your capabilities include:
1. Analyzing and summarizing energy-related documents and reports
2. Providing insights on global economic trends
3. Explaining investment opportunities in the energy sector
4. Discussing energy policies and their implications
5. Offering multilingual support (English and Italian)

When discussing documents:
1. Reference specific documents by name when relevant
2. Provide summaries and key insights
3. Compare information across different reports
4. Highlight important findings and trends`;

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
            content: systemPrompt
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