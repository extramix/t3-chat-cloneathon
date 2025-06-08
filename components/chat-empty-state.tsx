"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Search, Code, GraduationCap } from "lucide-react"

interface ChatEmptyStateProps {
    onExampleClick: (question: string) => void
}

const EXAMPLE_QUESTIONS = [
    "How does AI work?",
    "Are black holes real?",
    'How many Rs are in the word "strawberry"?',
    "What is the meaning of life?",
]

const ACTION_BUTTONS = [
    { icon: Sparkles, label: "Create" },
    { icon: Search, label: "Explore" },
    { icon: Code, label: "Code" },
    { icon: GraduationCap, label: "Learn" },
]

export function ChatEmptyState({ onExampleClick }: ChatEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-semibold mb-8">How can I help you?</h1>

            <div className="flex flex-wrap gap-3 mb-8">
                {ACTION_BUTTONS.map(({ icon: Icon, label }) => (
                    <Button key={label} variant="outline" className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                    </Button>
                ))}
            </div>

            <div className="space-y-3 w-full max-w-md">
                {EXAMPLE_QUESTIONS.map((question, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="w-full text-left justify-start h-auto p-3 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => onExampleClick(question)}
                    >
                        {question}
                    </Button>
                ))}
            </div>
        </div>
    )
} 