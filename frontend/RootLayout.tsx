import { ThemeProvider } from "@/components/theme-provider";
import { SignInButton, SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { ModelSelector } from "@/components/model-selector";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Outlet } from "react-router";
import { Sidebar } from "@/components/sidebar";
import { useCallback, useState } from "react";
import { useChatState } from "@/hooks/use-chat-state";

export default function Layout() {

    const {
        chats,
        activeChat,
        createNewChat,
        updateChat,
        deleteChat,
        handleChatSelect,
    } = useChatState();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleToggleCollapse = useCallback(() => {
        setSidebarCollapsed((prev) => !prev);
    }, []);

    // Get the currently active chat
    const currentChat = chats.find(chat => chat.id === activeChat);

    const handleModelChange = useCallback((model: string) => {
        if (activeChat) {
            updateChat(activeChat, { model });
        }
    }, [activeChat, updateChat]);

    return (
        <ClerkProvider>
            <header className="flex justify-between items-center p-4 gap-4 h-16">
                <div className="flex-1" />
                <div className="flex items-center gap-4">
                    {currentChat && (
                        <ModelSelector
                            value={currentChat.model}
                            onChange={handleModelChange}
                        />
                    )}
                    <SignedOut>
                        <SignInButton />
                        <SignUpButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
                    <Sidebar
                        chats={chats}
                        activeChat={activeChat}
                        onChatSelect={handleChatSelect}
                        onNewChat={createNewChat}
                        onDeleteChat={deleteChat}
                        collapsed={sidebarCollapsed}
                        onToggleCollapse={handleToggleCollapse}
                    />
                    <main
                        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'
                            }`}
                    >
                        <Outlet />
                    </main>
                    <Toaster />
                </div>
            </ThemeProvider>
        </ClerkProvider>
    )
}