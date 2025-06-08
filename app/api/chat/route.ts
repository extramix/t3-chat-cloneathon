import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'
import { SUPPORTED_MODELS, type SupportedModel } from '@/app/models-constants'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  model?: string
}


function createErrorResponse(message: string, status: number) {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status, 
      headers: { 'Content-Type': 'application/json' } 
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json()
    
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return createErrorResponse('Messages array is required and cannot be empty', 400)
    }

    for (const message of body.messages) {
      if (!message.role || !message.content) {
        return createErrorResponse('Each message must have role and content', 400)
      }
      if (!['user', 'assistant', 'system'].includes(message.role)) {
        return createErrorResponse('Invalid message role', 400)
      }
    }

    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!googleApiKey) {
      return createErrorResponse(
        'Google API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.',
        500
      )
    }

    const modelName = (body.model as SupportedModel) || SUPPORTED_MODELS.GEMINI_FLASH
    
    if (modelName !== SUPPORTED_MODELS.GEMINI_FLASH) {
      return createErrorResponse(`Unsupported model: ${modelName}`, 400)
    }

    const selectedModel = google(modelName)

    const result = await streamText({
      model: selectedModel,
      messages: body.messages,
      temperature: 0.7,
    })

    return result.toDataStreamResponse()
    
  } catch (error) {
    console.error('Chat API error:', error)
    
    if (error instanceof SyntaxError) {
      return createErrorResponse('Invalid JSON in request body', 400)
    }
    
    if (error instanceof Error && error.message.toLowerCase().includes('api key')) {
      return createErrorResponse('Invalid API key. Please check your API key configuration.', 401)
    }
    
    return createErrorResponse('Internal server error. Please try again later.', 500)
  }
}

export const runtime = 'edge'