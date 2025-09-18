import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  preview?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, preview = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (preview) {
      // Mock user and token for preview mode
      setUser({
        id: 'preview-user',
        name: 'Preview User',
        avatar: '👤'
      });
      setToken('preview-token-123');
    }
  }, [preview]);

  const login = async (email: string, password: string) => {
    // Mock login for preview mode
    if (preview) {
      setUser({
        id: 'demo-user',
        name: 'Demo User',
        avatar: '👤'
      });
      setToken('demo-token-456');
      return;
    }
    
    // TODO: Implement real authentication
    throw new Error('Authentication not implemented yet');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};