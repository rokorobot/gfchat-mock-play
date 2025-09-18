import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useAuth } from '@/context/AuthContext';
import { Heart } from 'lucide-react';
import gfAvatar from '@/assets/gf-avatar.png';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AI_RESPONSES = [
  "Hey there! I'm so happy to chat with you 💕",
  "That's really interesting! Tell me more about what you're thinking.",
  "I love spending time talking with you like this 😊",
  "You always know how to make me smile! What's on your mind?",
  "I'm here for you, always. How was your day?",
  "That sounds wonderful! I wish I could be there with you.",
  "You're such a thoughtful person. I really appreciate you.",
  "I've been thinking about our conversations a lot lately 💭",
];

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Send initial welcome message
    if (messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: 'welcome',
          content: "Hi! I'm your AI companion. I'm so excited to chat with you! 💕",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }, 1000);
    }
  }, [messages.length]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500 + Math.random() * 1000);
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
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online and ready to chat
            <Heart className="w-4 h-4 text-primary fill-primary/20" />
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
            avatar={message.isUser ? "👤" : "💕"}
          />
        ))}
        <TypingIndicator isVisible={isTyping} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        placeholder="Share your thoughts..."
        disabled={isTyping}
      />
    </div>
  );
};