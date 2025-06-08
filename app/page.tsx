"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export interface Chat {
  id: string
  title: string
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }>
  model: string
  createdAt: Date
  isStreaming?: boolean
}

export const dynamic = "force-dynamic"

export default function HomePage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("t3-chats")
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
        setChats(parsedChats)
        if (parsedChats.length > 0 && !activeChat) {
          setActiveChat(parsedChats[0].id)
        }
      } catch (error) {
        console.error("Failed to parse saved chats:", error)
        localStorage.removeItem("t3-chats")
      }
    }
  }, []) // Remove activeChat dependency

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("t3-chats", JSON.stringify(chats))
    }
  }, [chats])

  const createNewChat = useCallback(() => {
    const newChatId = Date.now().toString()
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      model: "gpt-4o",
      createdAt: new Date(),
    }

    setChats((prev) => [newChat, ...prev])
    setActiveChat(newChatId)
    toast.success("New chat created")
  }, [])

  const updateChat = useCallback((chatId: string, updates: Partial<Chat>) => {
    setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat)))
  }, [])

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((chat) => chat.id !== chatId))
      setActiveChat((current) => {
        if (current === chatId) {
          const remainingChats = chats.filter((chat) => chat.id !== chatId)
          return remainingChats.length > 0 ? remainingChats[0].id : null
        }
        return current
      })
    },
    [chats],
  )

  const handleChatSelect = useCallback((chatId: string) => {
    setActiveChat(chatId)
  }, [])

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const currentChat = chats.find((chat) => chat.id === activeChat)

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex h-screen bg-background">
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-80"}`}>
          {currentChat ? (
            <ChatInterface key={currentChat.id} chat={currentChat} onUpdateChat={updateChat} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Welcome to T3.Chat</h1>
                <p className="text-muted-foreground mb-6">Start a new conversation to begin</p>
                <button
                  onClick={createNewChat}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  New Chat
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
