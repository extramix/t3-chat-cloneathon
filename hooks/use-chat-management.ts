import { useEffect, useCallback, useRef, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { toast } from "sonner"
import type { Chat } from "@/app/pagey"
import { handleChatError, generateChatTitle, validateMessageContent } from "@/lib/chat-utils"

interface UseChatManagementProps {
  chat: Chat
  onUpdateChat: (chatId: string, updates: Partial<Chat>) => void
}

interface UpdateState {
  messagesLength: number
  isLoading: boolean
  lastMessageContent: string
}



// Configuration constants
const DEFAULT_UPDATE_STATE: UpdateState = {
  messagesLength: 0,
  isLoading: false,
  lastMessageContent: '',
}

export function useChatManagement({ chat, onUpdateChat }: UseChatManagementProps) {
  const lastUpdateRef = useRef<UpdateState>(DEFAULT_UPDATE_STATE)
  const currentChatIdRef = useRef<string>(chat.id)

  // Memoize initial messages to prevent unnecessary re-renders
  const initialMessages = useMemo(() => 
    chat.messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    })), 
    [chat.id] // Only re-compute when chat ID changes
  )

  const { messages, append, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: {
      model: chat.model,
    },
    id: chat.id,
    initialMessages,
    onError: handleChatError,
  })

  // Direct update function for real-time streaming
  const updateChat = useCallback((updates: Partial<Chat>) => {
    onUpdateChat(chat.id, updates)
  }, [chat.id, onUpdateChat])

  // Handle chat switching with proper cleanup
  useEffect(() => {
    const chatChanged = currentChatIdRef.current !== chat.id
    
    if (chatChanged) {
      // Reset state tracking
      lastUpdateRef.current = { ...DEFAULT_UPDATE_STATE }
      currentChatIdRef.current = chat.id
      
      // Sync messages for the new chat
      if (setMessages) {
        setMessages(chat.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        })))
      }
    }
  }, [chat.id, chat.messages, setMessages])

  // Real-time update logic for streaming
  useEffect(() => {
    const currentState: UpdateState = {
      messagesLength: messages.length,
      isLoading,
      lastMessageContent: messages[messages.length - 1]?.content || '',
    }
    
    const lastState = lastUpdateRef.current
    
    // More precise change detection
    const hasNewMessages = currentState.messagesLength !== lastState.messagesLength
    const loadingStateChanged = currentState.isLoading !== lastState.isLoading
    const contentGrew = currentState.lastMessageContent.length > lastState.lastMessageContent.length
    
    const shouldUpdate = hasNewMessages || loadingStateChanged || 
      (contentGrew && currentState.lastMessageContent !== lastState.lastMessageContent)

    if (shouldUpdate && messages.length > 0) {
      const updatedMessages = messages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant", // Safe assertion since we control the input
        content: msg.content,
        timestamp: new Date(),
      }))

      const updates: Partial<Chat> = {
        messages: updatedMessages,
        isStreaming: isLoading,
      }

      // Auto-generate title for new chats
      if (chat.title === "New Chat" && hasNewMessages) {
        updates.title = generateChatTitle(updatedMessages)
      }

      // Direct update for real-time streaming
      updateChat(updates)

      // Update tracking state
      lastUpdateRef.current = currentState
    } 
    // Handle edge case: streaming status change with no messages
    else if (chat.isStreaming !== isLoading && messages.length === 0) {
      updateChat({ isStreaming: isLoading })
      lastUpdateRef.current = { ...lastUpdateRef.current, isLoading }
    }
  }, [messages, isLoading, chat.title, chat.isStreaming, updateChat])

  // Improved sendMessage with better error handling
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
      // Error is already handled by the onError callback
      // Re-throw to allow caller to handle if needed
      throw error
    }
  }, [append])

  return {
    messages,
    isLoading,
    sendMessage,
  }
} 
