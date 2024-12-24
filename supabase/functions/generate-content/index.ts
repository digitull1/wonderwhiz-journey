import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgeGroup {
  range: string;
  tone: string;
  complexity: string;
  visuals: string[];
}

const ageGroups: Record<string, AgeGroup> = {
  '5-7': {
    range: '5-7',
    tone: 'playful and encouraging',
    complexity: 'simple sentences with easy words',
    visuals: ['🌈', '🦄', '🌟']
  },
  '8-10': {
    range: '8-10',
    tone: 'curious and adventurous',
    complexity: 'basic scientific terms with explanations',
    visuals: ['🪐', '🧬', '🔭']
  },
  '11-13': {
    range: '11-13',
    tone: 'exploratory with critical thinking',
    complexity: 'detailed explanations with cause-effect',
    visuals: ['🚀', '🌋', '🧪']
  },
  '14-16': {
    range: '14-16',
    tone: 'inquisitive and thought-provoking',
    complexity: 'technical terms with definitions',
    visuals: ['🌌', '🔬', '🪐']
  }
};

function getAgeGroup(age: number): AgeGroup {
  if (age <= 7) return ageGroups['5-7'];
  if (age <= 10) return ageGroups['8-10'];
  if (age <= 13) return ageGroups['11-13'];
  return ageGroups['14-16'];
}

function cleanJsonResponse(text: string): string {
  // Remove markdown code block syntax if present
  return text.replace(/```json\n|\n```|```\n/g, '').trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type, userAge = 8 } = await req.json();
    console.log(`Generating content for type: ${type}, prompt: ${prompt}, age: ${userAge}`);

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const ageGroup = getAgeGroup(userAge);
    let systemPrompt = "";

    switch (type) {
      case "topics":
        systemPrompt = `Generate 3 educational topics for children aged ${ageGroup.range} years. Use a ${ageGroup.tone} tone with ${ageGroup.complexity}. Return ONLY a JSON array with objects containing these exact keys:
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
        systemPrompt = `Generate educational content about "${prompt}" for children aged ${ageGroup.range} years. Use a ${ageGroup.tone} tone with ${ageGroup.complexity}. Return ONLY a JSON object with these exact keys:
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
    if (!result || !result.response) {
      throw new Error('No response received from Gemini');
    }
    
    const response = result.response;
    let text = response.text();
    console.log('Received raw response from Gemini:', text);
    
    // Clean up the response by removing markdown code block syntax
    text = cleanJsonResponse(text);
    console.log('Cleaned response:', text);
    
    // Parse the response to ensure it's valid JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(text);
      console.log('Successfully parsed JSON:', parsedContent);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw text that failed to parse:', text);
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