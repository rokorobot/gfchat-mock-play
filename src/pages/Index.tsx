import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-chat flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome to GF.Chat
          </h1>
          <p className="text-muted-foreground">Please sign in to continue</p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/settings')}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      <ChatInterface />
    </div>
  );
};

export default Index;
