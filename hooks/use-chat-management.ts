import { useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { toast } from "sonner"
import type { Chat } from "@/app/pagey"
import { handleChatError, validateMessageContent } from "@/lib/chat-utils"

interface UseChatManagementProps {
  chat: Chat
  onUpdateChat: (chatId: string, updates: Partial<Chat>) => void
}

export function useChatManagement({ chat, onUpdateChat }: UseChatManagementProps) {
  const { messages, append, isLoading, setMessages } = useChat({
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
    onError: handleChatError,
  })

  // Handle chat switching
  useEffect(() => {
    setMessages(chat.messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    })))
  }, [chat.id, setMessages])

  const sendMessage = useCallback(async (content: string) => {
    const validation = validateMessageContent(content)
    if (!validation.isValid) {
      toast.error(validation.error!)
      return
    }

    try {
      await append({
        role: "user",
        content: content.trim(),
      })
    } catch (error) {
      throw error
    }
  }, [append])

  return {
    messages,
    isLoading,
    sendMessage,
  }
} 
