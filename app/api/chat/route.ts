import { google } from '@ai-sdk/google'
import { openrouter, openai, anthropic } from '@/lib/providers'
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

    const modelName = (body.model as SupportedModel) || SUPPORTED_MODELS.GEMINI_FLASH
    
    // Validate that the model is supported
    if (!Object.values(SUPPORTED_MODELS).includes(modelName as any)) {
      return createErrorResponse(`Unsupported model: ${modelName}`, 400)
    }

    let selectedModel: any
    let requiresApiKey = ''

    // Select the appropriate provider based on the model
    switch (modelName) {
      // Google Models
      case SUPPORTED_MODELS.GEMINI_FLASH:
      case SUPPORTED_MODELS.GEMINI_PRO:
      case SUPPORTED_MODELS.GEMINI_15_FLASH:
      case SUPPORTED_MODELS.GEMINI_15_PRO:
        requiresApiKey = 'GOOGLE_GENERATIVE_AI_API_KEY'
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
          return createErrorResponse(
            'Google API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.',
            500
          )
        }
        selectedModel = google(modelName)
        break

      // OpenAI Models
      case SUPPORTED_MODELS.GPT_4O:
      case SUPPORTED_MODELS.GPT_4O_MINI:
      case SUPPORTED_MODELS.GPT_4_TURBO:
      case SUPPORTED_MODELS.GPT_35_TURBO:
        requiresApiKey = 'OPENAI_API_KEY'
        if (!process.env.OPENAI_API_KEY) {
          return createErrorResponse(
            'OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.',
            500
          )
        }
        selectedModel = openai(modelName)
        break

      // Anthropic Models
      case SUPPORTED_MODELS.CLAUDE_35_SONNET:
      case SUPPORTED_MODELS.CLAUDE_35_HAIKU:
      case SUPPORTED_MODELS.CLAUDE_3_OPUS:
        requiresApiKey = 'ANTHROPIC_API_KEY'
        if (!process.env.ANTHROPIC_API_KEY) {
          return createErrorResponse(
            'Anthropic API key not configured. Please set ANTHROPIC_API_KEY in your environment variables.',
            500
          )
        }
        selectedModel = anthropic(modelName)
        break

      // OpenRouter Models
      case SUPPORTED_MODELS.QWEN3_FREE:
      case SUPPORTED_MODELS.QWEN3_PAID:
      case SUPPORTED_MODELS.LLAMA_32_3B_FREE:
      case SUPPORTED_MODELS.LLAMA_32_1B_FREE:
      case SUPPORTED_MODELS.LLAMA_33_70B:
      case SUPPORTED_MODELS.MIXTRAL_8X7B_FREE:
      case SUPPORTED_MODELS.GEMMA_2_9B_FREE:
        requiresApiKey = 'OPENROUTER_API_KEY'
        if (!process.env.OPENROUTER_API_KEY) {
          return createErrorResponse(
            'OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your environment variables.',
            500
          )
        }
        selectedModel = openrouter(modelName)
        break

      default:
        return createErrorResponse(`Unsupported model: ${modelName}`, 400)
    }

    const result = await streamText({
      system: 'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
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