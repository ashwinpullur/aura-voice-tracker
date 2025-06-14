
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: null;
  session: null;
  loading: boolean;
  signUp: () => Promise<{ error: any }>;
  signIn: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const signUp = async () => {
    return { error: null };
  };

  const signIn = async () => {
    return { error: null };
  };

  const signOut = async () => {
    // No-op
  };

  const value = {
    user: null,
    session: null,
    loading: false,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
