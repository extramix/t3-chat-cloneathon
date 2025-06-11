import { SUPPORTED_MODELS } from '@/app/models-constants';
import { Chat } from '@/app/pagey';
import { useState, useEffect, useCallback } from 'react';

interface UseChatState {
  chats: Chat[];
  activeChat: string | null;
  createNewChat: () => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  deleteChat: (chatId: string) => void;
  handleChatSelect: (chatId: string) => void;
}

export const useChatState = (): UseChatState => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('t3-chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          // Migrate any unsupported models to Gemini
          model:
            chat.model === SUPPORTED_MODELS.GEMINI_FLASH
              ? chat.model
              : SUPPORTED_MODELS.GEMINI_FLASH,
          createdAt: new Date(chat.createdAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        })) as Chat[]; // Assert parsedChats as Chat[]
        setChats(parsedChats);
        if (parsedChats.length > 0 && !activeChat) {
          setActiveChat(parsedChats[0].id);
        }
      } catch (error) {
        console.error('Failed to parse saved chats:', error);
        localStorage.removeItem('t3-chats');
      }
    }
  }, []);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('t3-chats', JSON.stringify(chats));
    } else {
      // If chats array becomes empty, clear from localStorage
      localStorage.removeItem('t3-chats');
    }
  }, [chats]);

  const createNewChat = useCallback(() => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
      model: SUPPORTED_MODELS.GEMINI_FLASH,
      createdAt: new Date(),
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChatId);
  }, []);

  const updateChat = useCallback((chatId: string, updates: Partial<Chat>) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat))
    );
  }, []);

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => {
        const filteredChats = prev.filter((chat) => chat.id !== chatId);
        if (activeChat === chatId) {
          setActiveChat(filteredChats.length > 0 ? filteredChats[0].id : null);
        }
        return filteredChats;
      });
    },
    [activeChat] // Include activeChat in dependency array for correct logic
  );

  const handleChatSelect = useCallback((chatId: string) => {
    setActiveChat(chatId);
  }, []);

  return {
    chats,
    activeChat,
    createNewChat,
    updateChat,
    deleteChat,
    handleChatSelect,
  };
};