import { SUPPORTED_MODELS } from './models-constants'

export interface ModelInfo {
  name: string
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'OpenRouter'
  description: string
  contextWindow: number
  pricing: 'free' | 'paid' | 'freemium'
  strengths: string[]
}

export const MODEL_INFO: Record<string, ModelInfo> = {
  [SUPPORTED_MODELS.GEMINI_FLASH]: {
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    description: 'Fast, lightweight model optimized for speed',
    contextWindow: 1000000,
    pricing: 'paid',
    strengths: ['Speed', 'Efficiency', 'Large context']
  },
  [SUPPORTED_MODELS.GEMINI_PRO]: {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description: 'Advanced reasoning and complex tasks',
    contextWindow: 2000000,
    pricing: 'paid',
    strengths: ['Advanced reasoning', 'Complex tasks', 'Very large context']
  },
  [SUPPORTED_MODELS.GEMINI_15_FLASH]: {
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    description: 'Fast model with good performance',
    contextWindow: 1000000,
    pricing: 'paid',
    strengths: ['Speed', 'Good performance', 'Large context']
  },
  [SUPPORTED_MODELS.GEMINI_15_PRO]: {
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'High-performance model for complex tasks',
    contextWindow: 2000000,
    pricing: 'paid',
    strengths: ['High performance', 'Complex reasoning', 'Very large context']
  },
  [SUPPORTED_MODELS.GPT_4O]: {
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Latest GPT-4 model with improved capabilities',
    contextWindow: 128000,
    pricing: 'paid',
    strengths: ['Latest features', 'High quality', 'Multimodal']
  },
  [SUPPORTED_MODELS.GPT_4O_MINI]: {
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Smaller, faster version of GPT-4o',
    contextWindow: 128000,
    pricing: 'paid',
    strengths: ['Speed', 'Cost effective', 'Good performance']
  },
  [SUPPORTED_MODELS.GPT_4_TURBO]: {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Fast version of GPT-4',
    contextWindow: 128000,
    pricing: 'paid',
    strengths: ['Speed', 'Large context', 'Reliable']
  },
  [SUPPORTED_MODELS.GPT_35_TURBO]: {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and cost-effective model',
    contextWindow: 16385,
    pricing: 'paid',
    strengths: ['Speed', 'Cost effective', 'Reliable']
  },
  [SUPPORTED_MODELS.CLAUDE_35_SONNET]: {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Excellent for analysis and creative tasks',
    contextWindow: 200000,
    pricing: 'paid',
    strengths: ['Analysis', 'Creative writing', 'Code generation']
  },
  [SUPPORTED_MODELS.CLAUDE_35_HAIKU]: {
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    description: 'Fast and efficient model',
    contextWindow: 200000,
    pricing: 'paid',
    strengths: ['Speed', 'Efficiency', 'Quick responses']
  },
  [SUPPORTED_MODELS.CLAUDE_3_OPUS]: {
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most capable Claude model for complex tasks',
    contextWindow: 200000,
    pricing: 'paid',
    strengths: ['Complex reasoning', 'Deep analysis', 'High quality']
  },
  [SUPPORTED_MODELS.QWEN3_FREE]: {
    name: 'Qwen 3 30B (Free)',
    provider: 'OpenRouter',
    description: 'Large multilingual model with strong capabilities - Free tier',
    contextWindow: 40960,
    pricing: 'free',
    strengths: ['Free', 'Multilingual', 'Large size', 'Advanced reasoning']
  },
  [SUPPORTED_MODELS.QWEN3_PAID]: {
    name: 'Qwen 3 30B (Paid)',
    provider: 'OpenRouter',
    description: 'Large multilingual model with strong capabilities - Paid tier',
    contextWindow: 40960,
    pricing: 'paid',
    strengths: ['Multilingual', 'Large size', 'Advanced reasoning', 'Higher limits']
  },
  [SUPPORTED_MODELS.LLAMA_32_3B_FREE]: {
    name: 'Llama 3.2 3B (Free)',
    provider: 'OpenRouter',
    description: 'Small, efficient open-source model',
    contextWindow: 131072,
    pricing: 'free',
    strengths: ['Free', 'Open source', 'Efficient', 'Good performance']
  },
  [SUPPORTED_MODELS.LLAMA_32_1B_FREE]: {
    name: 'Llama 3.2 1B (Free)',
    provider: 'OpenRouter',
    description: 'Very small, very efficient open-source model',
    contextWindow: 131072,
    pricing: 'free',
    strengths: ['Free', 'Open source', 'Very efficient', 'Fast responses']
  },
  [SUPPORTED_MODELS.LLAMA_33_70B]: {
    name: 'Llama 3.3 70B',
    provider: 'OpenRouter',
    description: 'Latest large Llama model with improved capabilities',
    contextWindow: 131072,
    pricing: 'paid',
    strengths: ['Latest version', 'Large size', 'High performance', 'Open source']
  },
  [SUPPORTED_MODELS.MIXTRAL_8X7B_FREE]: {
    name: 'Mixtral 8x7B (Free)',
    provider: 'OpenRouter',
    description: 'Mixture of experts model',
    contextWindow: 32768,
    pricing: 'free',
    strengths: ['Free', 'Mixture of experts', 'Good performance', 'Efficient']
  },
  [SUPPORTED_MODELS.GEMMA_2_9B_FREE]: {
    name: 'Gemma 2 9B (Free)',
    provider: 'OpenRouter',
    description: 'Google\'s open-source model',
    contextWindow: 8192,
    pricing: 'free',
    strengths: ['Free', 'Open source', 'Google developed', 'Reliable']
  }
}

export function getModelsByProvider(provider: ModelInfo['provider']) {
  return Object.entries(MODEL_INFO)
    .filter(([_, info]) => info.provider === provider)
    .map(([modelId, info]) => ({ modelId, ...info }))
}

export function getFreeModels() {
  return Object.entries(MODEL_INFO)
    .filter(([_, info]) => info.pricing === 'free')
    .map(([modelId, info]) => ({ modelId, ...info }))
} 