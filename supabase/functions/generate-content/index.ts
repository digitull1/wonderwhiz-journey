import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

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
    const { prompt, type } = await req.json();
    console.log(`Generating content for type: ${type}, prompt: ${prompt}`);

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let systemPrompt = "";
    switch (type) {
      case "topics":
        systemPrompt = `Generate 3 educational topics for children. Return ONLY a JSON array with objects containing these exact keys:
          - title: string (engaging and child-friendly)
          - description: string (brief, fun explanation)
          - points: number (between 5-20)
          - difficulty: string (must be exactly "Easy", "Medium", or "Hard")
          - icon: string (an emoji that represents the topic)
          
          Example format:
          [
            {
              "title": "Space Adventures",
              "description": "Blast off into the cosmos!",
              "points": 15,
              "difficulty": "Medium",
              "icon": "🚀"
            }
          ]`;
        break;
      case "content":
        systemPrompt = `Generate educational content about "${prompt}" for children. Return ONLY a JSON object with these exact keys:
          - explanation: string (a fun, detailed explanation)
          - facts: string[] (array of 3 interesting facts)
          - followUpQuestions: string[] (array of 3 questions to spark curiosity)
          
          Example format:
          {
            "explanation": "The solar system is like a big family...",
            "facts": [
              "The Sun is so big that...",
              "Mars is called the red planet because...",
              "Jupiter has a giant storm that..."
            ],
            "followUpQuestions": [
              "What would it be like to live on Mars?",
              "Why do planets orbit around the Sun?",
              "How many moons does Jupiter have?"
            ]
          }`;
        break;
      default:
        throw new Error("Invalid content type requested");
    }

    console.log('Sending prompt to Gemini:', systemPrompt);
    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    let text = response.text();
    console.log('Received raw response from Gemini:', text);
    
    // Clean up the response if it contains markdown code block
    if (text.includes('```json')) {
      text = text.replace(/```json\n|\n```/g, '');
    }
    
    // Parse the response to ensure it's valid JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      throw new Error('Invalid JSON response from Gemini. Raw response: ' + text);
    }

    // Validate the structure based on type
    if (type === "topics") {
      if (!Array.isArray(parsedContent)) {
        throw new Error('Topics response must be an array');
      }
      parsedContent.forEach((topic, index) => {
        if (!topic.title || !topic.description || !topic.points || !topic.difficulty || !topic.icon) {
          throw new Error(`Topic at index ${index} is missing required fields`);
        }
      });
    } else if (type === "content") {
      if (!parsedContent.explanation || !Array.isArray(parsedContent.facts) || !Array.isArray(parsedContent.followUpQuestions)) {
        throw new Error('Content response is missing required fields');
      }
    }

    return new Response(
      JSON.stringify({ content: parsedContent }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate content',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});