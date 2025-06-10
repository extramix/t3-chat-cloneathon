export const SUPPORTED_MODELS = {
    // Google Models
    GEMINI_FLASH: 'gemini-2.5-flash-preview-05-20',
    GEMINI_PRO: 'gemini-2.5-pro-preview-05-20',
    GEMINI_15_FLASH: 'gemini-1.5-flash',
    GEMINI_15_PRO: 'gemini-1.5-pro',
    
    // OpenAI Models
    GPT_4O: 'gpt-4o',
    GPT_4O_MINI: 'gpt-4o-mini',
    GPT_4_TURBO: 'gpt-4-turbo',
    GPT_35_TURBO: 'gpt-3.5-turbo',
    
    // Anthropic Models
    CLAUDE_35_SONNET: 'claude-3-5-sonnet-20241022',
    CLAUDE_35_HAIKU: 'claude-3-5-haiku-20241022',
    CLAUDE_3_OPUS: 'claude-3-opus-20240229',
    
    // OpenRouter Models (correct names from OpenRouter API)
    QWEN3_FREE: 'qwen/qwen3-30b-a3b:free',
    LLAMA_32_3B_FREE: 'meta-llama/llama-3.2-3b-instruct:free',
    LLAMA_32_1B_FREE: 'meta-llama/llama-3.2-1b-instruct:free',
    MIXTRAL_8X7B_FREE: 'mistralai/mixtral-8x7b-instruct:free',
    GEMMA_2_9B_FREE: 'google/gemma-2-9b-it:free',
    LLAMA_33_70B: 'meta-llama/llama-3.3-70b-instruct',
    QWEN3_PAID: 'qwen/qwen3-30b-a3b',
    
} as const

export type SupportedModel = typeof SUPPORTED_MODELS[keyof typeof SUPPORTED_MODELS]