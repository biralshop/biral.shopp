import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  _id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  deliveryNote?: string;
  notifications?: { sms: boolean; email: boolean; campaigns: boolean; oneClick: boolean };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; username?: string; phone?: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Record<string, unknown>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('biralstore_token');
    if (token) {
      authAPI.getMe()
        .then(({ user }) => setUser(user))
        .catch(() => {
          localStorage.removeItem('biralstore_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await authAPI.login({ email, password });
    localStorage.setItem('biralstore_token', token);
    setUser(user);
  };

  const register = async (data: { firstName: string; lastName: string; email: string; username?: string; phone?: string; password: string }) => {
    const { user, token } = await authAPI.register(data);
    localStorage.setItem('biralstore_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('biralstore_token');
    setUser(null);
  };

  const updateProfile = async (data: Record<string, unknown>) => {
    const { user: updatedUser } = await authAPI.updateProfile(data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
