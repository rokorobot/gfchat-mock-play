import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSettings } from '@/hooks/useSettings';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import gfAvatar from '@/assets/gf-avatar.png';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAiMessageId, setLastAiMessageId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { speak, isLoading: isSpeaking } = useTextToSpeech();
  const { settings, getCurrentPersonalityText } = useSettings();

  // Add safety check for settings
  if (!settings) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-chat">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-speak new AI responses
  useEffect(() => {
    if (isLoading || !settings?.voiceMode) return; // Don't speak during initial load or if voice mode is off
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser && lastMessage.id !== lastAiMessageId) {
      setLastAiMessageId(lastMessage.id);
      speak(lastMessage.content, settings.voiceType || 'alloy');
    }
  }, [messages, isLoading, lastAiMessageId, speak, settings?.voiceMode, settings?.voiceType]);

  // Load existing messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;

      try {
        const { data: existingMessages, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading messages:', error);
          return;
        }

        if (existingMessages && existingMessages.length > 0) {
          const formattedMessages: Message[] = existingMessages.map(msg => ({
            id: msg.id,
            content: msg.content,
            isUser: msg.is_user,
            timestamp: new Date(msg.created_at),
          }));
          setMessages(formattedMessages);
        } else {
          // Send initial welcome message if no messages exist
          setTimeout(async () => {
            const welcomeMessage = "Hi! I'm your AI girlfriend and I'm so excited to chat with you! 💕 How are you doing today?";
            
            const { error: insertError } = await supabase
              .from('messages')
              .insert({
                user_id: user.id,
                content: welcomeMessage,
                is_user: false,
              });

            if (!insertError) {
              const message: Message = {
                id: 'welcome',
                content: welcomeMessage,
                isUser: false,
                timestamp: new Date(),
              };
              setMessages([message]);
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [user]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Save user message to database
      const { error: userMsgError } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          content: content,
          is_user: true,
        });

      if (userMsgError) {
        console.error('Error saving user message:', userMsgError);
      }

      // Get conversation history for AI context
      const { data: conversationHistory } = await supabase
        .from('messages')
        .select('content, is_user, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(20); // Get last 20 messages for context

      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { 
          message: content,
          conversationHistory: conversationHistory || [],
          personalityPrompt: getCurrentPersonalityText(),
          user_id: user.id
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || "I'm having trouble responding right now. Please try again! 💕",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);

      // Save AI response to database
      const { error: aiMsgError } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          content: aiResponse.content,
          is_user: false,
        });

      if (aiMsgError) {
        console.error('Error saving AI message:', aiMsgError);
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Connection Error",
        description: "I'm having trouble connecting right now. Please try again!",
        variant: "destructive",
      });
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 💕",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-chat">
      {/* Header with large GF Avatar */}
      <div className="flex flex-col items-center p-6 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg mb-4 bg-gradient-to-br from-primary to-accent p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img 
              src={gfAvatar} 
              alt="Your AI Girlfriend" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-card-foreground mb-1">Your AI Girlfriend</h2>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
            Online and ready to chat
            <Heart className="w-4 h-4 text-primary fill-primary/20" />
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading your conversation...</div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
                avatar={message.isUser ? "👤" : undefined}
              />
            ))}
            <TypingIndicator isVisible={isTyping} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        placeholder="Share your thoughts..."
        disabled={isTyping || isLoading}
      />
    </div>
  );
};