"use client"

import { useRef, useCallback } from "react"
import { ModelSelector } from "@/components/model-selector"
import { ChatMessages } from "@/components/chat-messages"
import { ChatInput, type ChatInputRef } from "@/components/chat-input"
import { useChatManagement } from "@/hooks/use-chat-management"
import type { Chat } from "@/app/pagey"

interface ChatInterfaceProps {
  chat: Chat
  onUpdateChat: (chatId: string, updates: Partial<Chat>) => void
}

export function ChatInterface({ chat, onUpdateChat }: ChatInterfaceProps) {
  const chatInputRef = useRef<ChatInputRef>(null)

  const { messages, isLoading, sendMessage } = useChatManagement({
    chat,
    onUpdateChat,
  })

  const handleModelChange = useCallback(
    (model: string) => {
      onUpdateChat(chat.id, { model })
    },
    [chat.id, onUpdateChat],
  )

  const handleExampleClick = useCallback((question: string) => {
    chatInputRef.current?.setInput(question)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <ModelSelector value={chat.model} onChange={handleModelChange} />
      </div>

      {/* Messages */}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        onExampleClick={handleExampleClick}
      />

      {/* Input */}
      <ChatInput
        ref={chatInputRef}
        onSubmit={sendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}
