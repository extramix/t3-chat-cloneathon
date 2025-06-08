import { useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { toast } from "sonner"
import type { Chat } from "@/app/page"

interface UseChatManagementProps {
  chat: Chat
  onUpdateChat: (chatId: string, updates: Partial<Chat>) => void
}

export function useChatManagement({ chat, onUpdateChat }: UseChatManagementProps) {
  const { messages, append, isLoading } = useChat({
    api: "/api/chat",
    body: {
      model: chat.model,
    },
    id: chat.id,
    initialMessages: chat.messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    })),
    onError: (error) => {
      console.error('Chat error:', error)
      // Try to parse the error message
      try {
        const errorData = JSON.parse(error.message)
        toast.error(errorData.error || 'Failed to send message. Please try again.')
      } catch {
        // If it's not JSON, show the raw error or a generic message
        if (error.message.includes('API key')) {
          toast.error('API key not configured. Please check your environment variables.')
        } else {
          toast.error('Failed to send message. Please try again.')
        }
      }
    },
  })

  // Update chat when messages or loading state changes
  useEffect(() => {
    if (messages.length > 0) {
      const updatedMessages = messages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date(),
      }))

      const updates: Partial<Chat> = {
        messages: updatedMessages,
        isStreaming: isLoading,
      }

      // Update title if it's still "New Chat" and we have a user message
      if (chat.title === "New Chat" && messages.length >= 1 && messages[0].role === "user") {
        const title = messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? "..." : "")
        updates.title = title
      }

      onUpdateChat(chat.id, updates)
    } else if (chat.isStreaming !== isLoading) {
      // Only update streaming status if it changed
      onUpdateChat(chat.id, { isStreaming: isLoading })
    }
  }, [messages.length, isLoading, chat.id, chat.title, chat.isStreaming, onUpdateChat])

  const sendMessage = async (content: string) => {
    try {
      await append({
        role: "user",
        content,
      })
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
      throw error
    }
  }

  return {
    messages,
    isLoading,
    sendMessage,
  }
} 
