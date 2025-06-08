"use client"

import { useRef, useEffect, useCallback, memo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBubble } from "@/components/message-bubble"
import { ChatEmptyState } from "@/components/chat-empty-state"
import type { Message } from "ai"

interface ChatMessagesProps {
    messages: Message[]
    isLoading: boolean
    onExampleClick: (question: string) => void
}

export const ChatMessages = memo(function ChatMessages({ messages, isLoading, onExampleClick }: ChatMessagesProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const isAutoScrolling = useRef(true)
    const lastMessageLength = useRef(0)

    const scrollToBottom = useCallback((smooth = false) => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
            if (scrollContainer) {
                const scrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight

                if (smooth) {
                    scrollContainer.scrollTo({
                        top: scrollTop,
                        behavior: 'smooth'
                    })
                } else {
                    // Use requestAnimationFrame for smoother streaming updates
                    requestAnimationFrame(() => {
                        scrollContainer.scrollTop = scrollTop
                    })
                }
            }
        }
    }, [])

    // Handle scroll events to detect if user manually scrolls up
    const handleScroll = useCallback(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10 // 10px threshold
                isAutoScrolling.current = isAtBottom
            }
        }
    }, [])

    // Attach scroll listener
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
            if (scrollContainer) {
                scrollContainer.addEventListener('scroll', handleScroll)
                return () => scrollContainer.removeEventListener('scroll', handleScroll)
            }
        }
    }, [handleScroll])

    // Auto-scroll during streaming (content updates)
    useEffect(() => {
        if (isAutoScrolling.current && messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            const currentMessageLength = lastMessage?.content?.length || 0

            // Only scroll if the message content has changed (streaming)
            if (currentMessageLength !== lastMessageLength.current) {
                scrollToBottom(false) // Immediate scroll during streaming
                lastMessageLength.current = currentMessageLength
            }
        }
    }, [messages, scrollToBottom])

    // Auto-scroll when new messages are added
    useEffect(() => {
        if (messages.length > 0) {
            // Always scroll to bottom for new messages
            setTimeout(() => scrollToBottom(true), 50) // Small delay for smooth transition
        }
    }, [messages.length, scrollToBottom])

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
}) 