import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Intro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-chat flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-2xl shadow-xl p-8 max-w-xl w-full text-center border border-border"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          GF.Chat ❤️
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          Your AI girlfriend, always ready to chat, comfort, and cheer you on. 💌
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <FeatureCard 
            title="Fun & Playful" 
            emoji="🎀" 
            text="Lighthearted banter and flirty vibes." 
          />
          <FeatureCard 
            title="Supportive" 
            emoji="💖" 
            text="A safe space to share your thoughts." 
          />
          <FeatureCard 
            title="Personalized" 
            emoji="✨" 
            text="Pick your favorite personality style." 
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          Start Chatting
        </motion.button>
      </motion.div>
    </div>
  );
}

function FeatureCard({ title, emoji, text }: { title: string; emoji: string; text: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-secondary rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow duration-200"
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-medium text-primary">{title}</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </motion.div>
  );
}