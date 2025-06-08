import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    // Check for required API keys
    // const openaiApiKey = process.env.OPENAI_API_KEY
    // const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    let selectedModel
    
    switch (model) {
            case 'gemini-2.5-flash-preview-05-20':
        if (!googleApiKey) {
          return new Response(
            JSON.stringify({ error: 'Google API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
        selectedModel = google('gemini-2.5-flash-preview-05-20')
        break
      default:
        if (!googleApiKey) {
            return new Response(
              JSON.stringify({ error: 'Google API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }
        selectedModel = google('gemini-2.5-flash-preview-05-20')
        break
    }

    const result = await streamText({
      model: selectedModel,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Check if it's an API key related error
    if (error instanceof Error && error.message.includes('api key')) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key. Please check your API key configuration.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 