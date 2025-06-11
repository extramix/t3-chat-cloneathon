"use client"

import type React from "react"
import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
    onSubmit: (message: string) => Promise<void>
    isLoading: boolean
}

export interface ChatInputRef {
    setInput: (value: string) => void
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
    ({ onSubmit, isLoading }, ref) => {
        const [input, setInput] = useState("")
        const textareaRef = useRef<HTMLTextAreaElement>(null)

        useImperativeHandle(ref, () => ({
            setInput,
        }))

        const handleSubmit = useCallback(
            async (e: React.FormEvent) => {
                e.preventDefault()
                if (!input.trim() || isLoading) return

                const userMessage = input.trim()
                setInput("")

                try {
                    await onSubmit(userMessage)
                } catch (error) {
                    // Restore the input on error
                    setInput(userMessage)
                    throw error
                }
            },
            [input, isLoading, onSubmit],
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

        return (
            <div className="pb-2 sticky bottom-0">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="relative bg-accent rounded-2xl opacity-95">
                        <Textarea
                            autoFocus
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                            className="min-h-[80px] max-h-[200px] pl-5 pt-5 resize-none rounded-2xl"
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
        )
    }
) 