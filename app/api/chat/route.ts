import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(req: Request) {
  const { messages, model } = await req.json()

  // Select the appropriate model provider
  let selectedModel
  if (model.startsWith("gpt-")) {
    selectedModel = openai(model)
  } else if (model.startsWith("claude-")) {
    selectedModel = anthropic(model)
  } else {
    selectedModel = openai("gpt-4o") // fallback
  }

  const result = await streamText({
    model: selectedModel,
    messages,
    system:
      "You are a helpful AI assistant. When providing code examples, always specify the programming language for proper syntax highlighting.",
  })

  return result.toDataStreamResponse()
}
