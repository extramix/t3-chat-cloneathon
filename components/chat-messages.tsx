"use client"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBubble } from "@/components/message-bubble"
import { ChatEmptyState } from "@/components/chat-empty-state"
import type { Message } from "ai"

interface ChatMessagesProps {
    messages: Message[]
    isLoading: boolean
    onExampleClick: (question: string) => void
}

export function ChatMessages({ messages, isLoading, onExampleClick }: ChatMessagesProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }, [messages.length])

    return (
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            {messages.length === 0 ? (
                <ChatEmptyState onExampleClick={onExampleClick} />
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
    )
} 