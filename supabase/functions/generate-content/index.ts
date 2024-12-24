import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type } = await req.json();
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let systemPrompt = "";
    switch (type) {
      case "topics":
        systemPrompt = `Generate 3 educational topics for children. For each topic provide:
          - title: engaging and child-friendly
          - description: brief, fun explanation
          - points: number between 5-20
          - difficulty: "Easy", "Medium", or "Hard"
          - icon: an emoji that represents the topic
          Format as JSON array.`;
        break;
      case "content":
        systemPrompt = `Generate educational content about "${prompt}" for children. Include:
          - A fun, detailed explanation
          - 3 interesting facts
          - 3 follow-up questions to spark curiosity
          Format as JSON object.`;
        break;
      default:
        throw new Error("Invalid content type requested");
    }

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the response to ensure it's valid JSON
    const parsedContent = JSON.parse(text);

    return new Response(
      JSON.stringify({ content: parsedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate content' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});