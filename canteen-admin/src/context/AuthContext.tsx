import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'superadmin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
  error: null
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // Set up axios defaults
  axios.defaults.baseURL = 'http://localhost:5000/api';
  
  // Set token in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Check if user is logged in
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
          // Verify the user has admin role
          if (userData.role === 'admin' || userData.role === 'superadmin') {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Not an admin, clear storage
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, [token]);
  
  // Login user
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const res = await axios.post('/auth/login', { email, password });
      
      const { token, user } = res.data;
      
      // Check if user has admin role
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error details:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
      throw err;
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;