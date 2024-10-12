import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '../services/storageService';

interface AuthContextProps {
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children } : { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storageService.getToken());
  const [username, setUsername] = useState<string | null>(null);

  const login = (token: string, username: string) => {
    storageService.setToken(token);
    storageService.setUserName(username);
    setUsername(username);
    setIsAuthenticated(true);
  };

  const logout = () => {
    storageService.removeToken();
    storageService.removeUserName();
    storageService.removeSelectedSchool();
    storageService.removeSelectedClass();
    setUsername(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Update authentication status when the token changes
    const token = storageService.getToken();
    if (token) {
      // Assuming the token service or another service provides the username,
      // you would fetch and set the username here if available.
      const storedUsername = storageService.getUserName(); // This is just an example; adjust to your needs
      setUsername(storedUsername);
    }

    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
