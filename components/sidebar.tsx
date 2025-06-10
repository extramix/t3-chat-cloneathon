"use client"

import { useState, useTransition, useOptimistic } from "react"
import { Search, Plus, Menu, Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Chat } from "@/app/pagey"
import { toast } from "sonner"

interface SidebarProps {
  chats: Chat[]
  activeChat: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [optimisticActiveChat, setOptimisticActiveChat] = useOptimistic(activeChat)

  const filteredChats = chats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const groupChatsByDate = (chats: Chat[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const groups = {
      today: [] as Chat[],
      yesterday: [] as Chat[],
      lastWeek: [] as Chat[],
      lastMonth: [] as Chat[],
      older: [] as Chat[],
    }

    chats.forEach((chat) => {
      const chatDate = new Date(chat.createdAt.getFullYear(), chat.createdAt.getMonth(), chat.createdAt.getDate())

      if (chatDate.getTime() === today.getTime()) {
        groups.today.push(chat)
      } else if (chatDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(chat)
      } else if (chatDate >= lastWeek) {
        groups.lastWeek.push(chat)
      } else if (chatDate >= lastMonth) {
        groups.lastMonth.push(chat)
      } else {
        groups.older.push(chat)
      }
    })

    return groups
  }

  const chatGroups = groupChatsByDate(filteredChats)

  const handleChatSelect = (chatId: string) => {
    // Immediately update the UI optimistically
    startTransition(() => {
      setOptimisticActiveChat(chatId)
    })

    // Defer the actual chat loading to avoid blocking the UI
    startTransition(() => {
      onChatSelect(chatId)
    })
  }

  const ChatItem = ({ chat }: { chat: Chat }) => (
    <div
      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors duration-150 ${optimisticActiveChat === chat.id ? "bg-accent" : ""
        }`}
      onClick={() => handleChatSelect(chat.id)}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm truncate">{chat.title}</span>
        {chat.isStreaming && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />}
        {/* {isPending && optimisticActiveChat === chat.id && (
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
        )} */}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
        onClick={(e) => {
          e.stopPropagation()
          onDeleteChat(chat.id)
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )

  if (collapsed) {
    return (
      <div className="fixed left-0 top-0 h-full w-16 bg-background border-r border-border flex flex-col items-center py-4 space-y-4 z-50">
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onNewChat} className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <ThemeToggle />
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0">
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">M2.Chat</h1>
          </div>
          <ThemeToggle />
        </div>

        <Button onClick={onNewChat} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          {chatGroups.today.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Today</h3>
              <div className="py-2">
                {chatGroups.today.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}

          {chatGroups.yesterday.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Yesterday</h3>
              <div className="space-y-1">
                {chatGroups.yesterday.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}

          {chatGroups.lastWeek.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Last 7 Days</h3>
              <div className="space-y-1">
                {chatGroups.lastWeek.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}

          {chatGroups.lastMonth.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Last 30 Days</h3>
              <div className="space-y-1">
                {chatGroups.lastMonth.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}

          {chatGroups.older.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Older</h3>
              <div className="space-y-1">
                {chatGroups.older.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
