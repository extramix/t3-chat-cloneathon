"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Sparkles, Search, Code, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModelSelector } from "@/components/model-selector"
import { MessageBubble } from "@/components/message-bubble"
import { useChat } from "@ai-sdk/react"
import type { Chat } from "@/app/page"
import { toast } from "sonner"

interface ChatInterfaceProps {
  chat: Chat
  onUpdateChat: (chatId: string, updates: Partial<Chat>) => void
}

export function ChatInterface({ chat, onUpdateChat }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages.length]) // Only depend on message count, not the entire messages array

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
  }, [messages.length, isLoading]) // Simplified dependencies

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      const userMessage = input.trim()
      setInput("")

      try {
        await append({
          role: "user",
          content: userMessage,
        })
      } catch (error) {
        toast.error("Failed to send message. Please try again.")
        setInput(userMessage) // Restore the input on error
      }
    },
    [input, isLoading, append],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    },
    [handleSubmit],
  )

  const handleModelChange = useCallback(
    (model: string) => {
      onUpdateChat(chat.id, { model })
    },
    [chat.id, onUpdateChat],
  )

  const handleExampleClick = useCallback((question: string) => {
    setInput(question)
  }, [])

  const exampleQuestions = [
    "How does AI work?",
    "Are black holes real?",
    'How many Rs are in the word "strawberry"?',
    "What is the meaning of life?",
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <ModelSelector value={chat.model} onChange={handleModelChange} />
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-semibold mb-8">How can I help you?</h1>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button variant="outline" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Create</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Explore</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Code</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span>Learn</span>
              </Button>
            </div>

            <div className="space-y-3 w-full max-w-md">
              {exampleQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full text-left justify-start h-auto p-3 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => handleExampleClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={isLoading && message === messages[messages.length - 1]}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="min-h-[60px] max-h-[200px] pr-12 resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute bottom-2 right-2 h-8 w-8 p-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
