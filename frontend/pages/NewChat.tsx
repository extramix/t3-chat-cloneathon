import { SUPPORTED_MODELS } from "@/app/models-constants";
import { ChatInterface } from "@/components/chat-interface";

export default function NewChat() {
    return <ChatInterface
        chat={{
            id: "new",
            title: "New Chat",
            messages: [],
            model: SUPPORTED_MODELS.GEMINI_FLASH,
            createdAt: new Date(),
        }}
        onUpdateChat={() => { }}
    />
}