import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userAge, context } = await req.json()

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'))
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create a child-friendly prompt
    const prompt = `You are WonderWhiz, a friendly and educational AI assistant for children. 
    The user is ${userAge} years old. Keep responses age-appropriate, engaging, and educational.
    Previous context: ${context || 'None'}
    
    User message: ${message}
    
    Respond in a friendly, encouraging way that sparks curiosity and learning.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    return new Response(
      JSON.stringify({ 
        response: text,
        suggestions: generateSuggestions(text)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function generateSuggestions(response: string): string[] {
  // Extract key topics from the response and generate follow-up questions
  const topics = response.split('.').filter(s => s.length > 20).slice(0, 3)
  return topics.map(topic => `Tell me more about ${topic.trim().toLowerCase()}`)
}