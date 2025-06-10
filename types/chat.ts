export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
  model: string
  createdAt: Date
  isStreaming?: boolean
}

export interface UpdateState {
  messagesLength: number
  isLoading: boolean
  lastMessageContent: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface ChatUpdateData extends Partial<Chat> {
  messages?: ChatMessage[]
  isStreaming?: boolean
  title?: string
} 