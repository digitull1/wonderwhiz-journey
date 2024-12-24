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
    const { type, topic, userAge } = await req.json()
    console.log('Request received:', { type, topic, userAge })

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'))
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    if (type === 'topics') {
      const prompt = `Generate 6 educational topics for a ${userAge} year old child. Return ONLY a valid JSON array with objects containing these exact fields (no markdown, no backticks):
      [
        {
          "title": "engaging question or topic title",
          "description": "brief, exciting description",
          "icon": "relevant emoji",
          "difficulty": "Easy|Medium|Hard based on age",
          "category": "space|nature|history|art|science"
        }
      ]`

      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()
      
      // Clean up the response to ensure valid JSON
      const cleanText = text.replace(/```json\n|\n```|```/g, '').trim()
      console.log('Cleaned text before parsing:', cleanText)
      
      try {
        const topics = JSON.parse(cleanText)
        console.log('Successfully parsed topics:', topics)
        return new Response(
          JSON.stringify({ topics }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        throw new Error('Failed to parse topics response')
      }
    } else {
      const prompt = `Generate educational content for a ${userAge} year old child about "${topic}". Return ONLY a valid JSON object with these exact fields (no markdown, no backticks):
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
      const text = response.text()
      
      // Clean up the response to ensure valid JSON
      const cleanText = text.replace(/```json\n|\n```|```/g, '').trim()
      console.log('Cleaned text before parsing:', cleanText)
      
      try {
        const content = JSON.parse(cleanText)
        console.log('Successfully parsed content:', content)
        return new Response(
          JSON.stringify(content),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        throw new Error('Failed to parse content response')
      }
    }
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