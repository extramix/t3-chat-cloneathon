"use client"

import { User, Bot } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import type { Message } from "ai"

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user"

  // Parse message content to handle code blocks
  const parseContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index).trim()
        if (textContent) {
          parts.push({ type: "text", content: textContent })
        }
      }

      // Add code block
      const language = match[1] || "text"
      const code = match[2].trim()
      parts.push({ type: "code", language, content: code })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const textContent = content.slice(lastIndex).trim()
      if (textContent) {
        parts.push({ type: "text", content: textContent })
      }
    }

    return parts.length > 0 ? parts : [{ type: "text", content }]
  }

  const contentParts = parseContent(message.content)

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className={`flex-1 max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <div className={`rounded-lg p-4 ${isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"}`}>
          <div className="space-y-3">
            {contentParts.map((part, index) => (
              <div key={index}>
                {part.type === "text" ? (
                  <div className="whitespace-pre-wrap">{part.content}</div>
                ) : (
                  <CodeBlock language={part.language} code={part.content} />
                )}
              </div>
            ))}
            {isStreaming && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}
