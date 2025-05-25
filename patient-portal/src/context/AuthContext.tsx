import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin' | 'patient';
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
  updateUser: (userData: User) => void;
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
  updateUser: () => {},
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
  
  // Login user with role-based navigation
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
      
      // Role-based navigation
      if (user.role === 'admin' || user.role === 'superadmin') {
        // Redirect to admin portal
        window.location.href = 'http://localhost:5174/dashboard'; // Admin portal URL
      } else {
        // Regular user, navigate to patient portal home
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login error details:', err);
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
      console.error('Registration error details:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.response?.status === 500) {
        setError('Server error. The system might be experiencing database connectivity issues.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
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

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
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
        updateUser,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
