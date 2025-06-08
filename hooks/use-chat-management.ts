import { useEffect, useCallback, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { toast } from "sonner"
import type { Chat } from "@/app/page"

interface UseChatManagementProps {
  chat: Chat
  onUpdateChat: (chatId: string, updates: Partial<Chat>) => void
}

export function useChatManagement({ chat, onUpdateChat }: UseChatManagementProps) {
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastUpdateRef = useRef<{ messagesLength: number; isLoading: boolean; lastMessageContent: string }>({
    messagesLength: 0,
    isLoading: false,
    lastMessageContent: '',
  })

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

  // Debounced update function for smoother streaming
  const debouncedUpdate = useCallback((updates: Partial<Chat>, immediate = false) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    const performUpdate = () => {
      onUpdateChat(chat.id, updates)
    }

    if (immediate) {
      performUpdate()
    } else {
      // Debounce streaming updates slightly for better performance
      updateTimeoutRef.current = setTimeout(performUpdate, 50)
    }
  }, [chat.id, onUpdateChat])

  // Update chat when messages or loading state changes
  useEffect(() => {
    const currentMessagesLength = messages.length
    const currentIsLoading = isLoading
    const currentLastMessageContent = messages[messages.length - 1]?.content || ''
    
    const lastUpdate = lastUpdateRef.current
    
    // Only update if something meaningful has changed
    const shouldUpdate = (
      currentMessagesLength !== lastUpdate.messagesLength ||
      currentIsLoading !== lastUpdate.isLoading ||
      (currentLastMessageContent !== lastUpdate.lastMessageContent && currentLastMessageContent.length > lastUpdate.lastMessageContent.length)
    )

    if (shouldUpdate && messages.length > 0) {
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

      // Use immediate update for new messages, debounced for streaming updates
      const immediate = currentMessagesLength !== lastUpdate.messagesLength || currentIsLoading !== lastUpdate.isLoading
      debouncedUpdate(updates, immediate)

      // Update our tracking reference
      lastUpdateRef.current = {
        messagesLength: currentMessagesLength,
        isLoading: currentIsLoading,
        lastMessageContent: currentLastMessageContent,
      }
    } else if (chat.isStreaming !== isLoading && messages.length === 0) {
      // Only update streaming status if it changed and we have no messages yet
      debouncedUpdate({ isStreaming: isLoading }, true)
      lastUpdateRef.current.isLoading = isLoading
    }
  }, [messages, isLoading, chat.id, chat.title, chat.isStreaming, debouncedUpdate])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

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
