"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ReactNode } from 'react'

interface CodeBlockProps {
  children?: ReactNode
  className?: string
  inline?: boolean
}

export function CodeBlock({ children, className, inline, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  // Debug: Let's see what we're getting
  console.log('CodeBlock props:', { children, className, inline })

  // Extract language from className with improved detection
  let language = 'text'

  if (className) {
    // Try different formats: "language-javascript", "lang-javascript", or just "javascript"
    const languageMatch = className.match(/(?:language-|lang-)?(\w+)/)
    if (languageMatch) {
      language = languageMatch[1]
    }
  }

  console.log('Detected language:', language, 'from className:', className)

  const code = String(children).replace(/\n$/, '')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Code copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy code")
    }
  }

  // Return inline code without syntax highlighting
  if (inline) {
    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    )
  }

  // Return code block with syntax highlighting
  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border-b">
        <span className="text-sm font-medium text-muted-foreground capitalize">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="!mt-0 !rounded-t-none"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
