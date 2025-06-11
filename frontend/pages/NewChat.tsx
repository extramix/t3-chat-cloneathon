import { ChatInterface } from "@/components/chat-interface";

export default function NewChat() {
    return <ChatInterface
        chat={{
            id: "new",
            title: "New Chat",
            messages: [],
            model: "gemini-flash",
            createdAt: new Date(),
        }}
        onUpdateChat={() => { }}
    />
}