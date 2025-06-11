import { ThemeProvider } from "@/components/theme-provider";
import { SignInButton, SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";

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

    return (
        <ClerkProvider>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
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