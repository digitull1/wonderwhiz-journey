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
    const { topic, userAge } = await req.json()

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'))
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create age-appropriate prompt
    const prompt = `You are WonderWhiz, an educational AI assistant for children aged ${userAge}. 
    Create engaging, age-appropriate content about "${topic}". Include:
    1. A brief, engaging explanation (2-3 paragraphs for ages 5-8, 3-4 for ages 9-12, 4-5 for ages 13+)
    2. 3 fun, memorable facts
    3. 3 follow-up questions to spark curiosity
    4. 3 related topics for further exploration
    
    Format the response as a JSON object with these keys:
    {
      "explanation": "main content here",
      "facts": ["fact1", "fact2", "fact3"],
      "followUpQuestions": ["question1", "question2", "question3"],
      "relatedTopics": [
        {"title": "topic1", "description": "brief description", "difficulty": "Easy|Medium|Hard"},
        {"title": "topic2", "description": "brief description", "difficulty": "Easy|Medium|Hard"},
        {"title": "topic3", "description": "brief description", "difficulty": "Easy|Medium|Hard"}
      ]
    }`

    const result = await model.generateContent(prompt)
    const response = result.response
    const content = JSON.parse(response.text())

    // Log the generated content for debugging
    console.log('Generated content:', content)

    return new Response(
      JSON.stringify(content),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-content function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})