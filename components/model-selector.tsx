"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getModelsByProvider } from "@/app/models-info"

interface ModelSelectorProps {
  value: string
  onChange: (model: string) => void
}

const googleModels = getModelsByProvider("Google")
const openaiModels = getModelsByProvider("OpenAI")
const anthropicModels = getModelsByProvider("Anthropic")
const openrouterModels = getModelsByProvider("OpenRouter")

const allModels = [...googleModels, ...openaiModels, ...anthropicModels, ...openrouterModels]

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const selectedModel = allModels.find((model) => model.modelId === value) || googleModels[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-fit">
          <span className="font-medium">{selectedModel.name}</span>
          <span className="text-muted-foreground ml-2 text-sm">({selectedModel.provider})</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {googleModels.map((model) => (
          <DropdownMenuItem
            key={model.modelId}
            onClick={() => onChange(model.modelId)}
            className="flex flex-col items-start space-y-1 p-3"
          >
            <div className="font-medium">{model.name}</div>
          </DropdownMenuItem>
        ))}
        {openrouterModels.map((model) => (
          <DropdownMenuItem
            key={model.modelId}
            onClick={() => onChange(model.modelId)}
            className="flex flex-col items-start space-y-1 p-3"
          >
            <div className="font-medium">{model.name}</div>
          </DropdownMenuItem>
        ))}
        {openaiModels.map((model) => (
          <DropdownMenuItem
            key={model.modelId}
            onClick={() => onChange(model.modelId)}
            className="flex flex-col items-start space-y-1 p-3"
          >
            <div className="font-medium">{model.name}</div>
          </DropdownMenuItem>
        ))}
        {anthropicModels.map((model) => (
          <DropdownMenuItem
            key={model.modelId}
            onClick={() => onChange(model.modelId)}
            className="flex flex-col items-start space-y-1 p-3"
          >
            <div className="font-medium">{model.name}</div>
          </DropdownMenuItem>
        ))}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
