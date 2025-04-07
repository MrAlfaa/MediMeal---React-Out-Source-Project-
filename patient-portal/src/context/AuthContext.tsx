import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  fullName: string;
  email: string;
  wardNumber: string;
  bedNumber: string;
  patientId: string;
  contactNumber?: string;
  dietaryRestrictions?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
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
          // For simplicity, we're using the token data directly
          // In a real app, you might want to validate the token with the server
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError('Authentication failed. Please login again.');
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
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    }
  };
  
  // Register user
  const register = async (userData: any) => {
    try {
      setError(null);
      const res = await axios.post('/auth/register', userData);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
