import { toast } from "sonner"

/**
 * Handles chat-related errors with centralized error message parsing
 */
export function handleChatError(error: Error): void {
  console.error('Chat error:', error)
  
  const getErrorMessage = (error: Error): string => {
    try {
      const errorData = JSON.parse(error.message)
      return errorData.error || 'Failed to send message. Please try again.'
    } catch {
      if (error.message.toLowerCase().includes('api key')) {
        return 'API key not configured. Please check your environment variables.'
      }
      return 'Failed to send message. Please try again.'
    }
  }
  
  toast.error(getErrorMessage(error))
}

/**
 * Generates a chat title from the first user message
 */
export function generateChatTitle(messages: Array<{ role: string; content: string }>): string {
  const firstUserMessage = messages.find(msg => msg.role === "user")
  if (!firstUserMessage) return "New Chat"
  
  const content = firstUserMessage.content.trim()
  return content.length > 50 ? `${content.slice(0, 50)}...` : content
}

/**
 * Validates message content before sending
 */
export function validateMessageContent(content: string): { isValid: boolean; error?: string } {
  const trimmed = content.trim()
  
  if (!trimmed) {
    return { isValid: false, error: "Message cannot be empty" }
  }
  
  if (trimmed.length > 10000) { // Reasonable limit
    return { isValid: false, error: "Message is too long. Please shorten your message." }
  }
  
  return { isValid: true }
} 