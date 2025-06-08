export const SUPPORTED_MODELS = {
    GEMINI_FLASH: 'gemini-2.5-flash-preview-05-20',
} as const

export type SupportedModel = typeof SUPPORTED_MODELS[keyof typeof SUPPORTED_MODELS]