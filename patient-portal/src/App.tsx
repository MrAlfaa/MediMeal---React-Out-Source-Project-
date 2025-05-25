import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Menu from './components/Menu'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import OrderHistory from './components/OrderHistory'
import Orders from './components/Orders'
import Profile from './components/Profile'
import DietaryInfo from './components/DietaryInfo'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

// Add Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <svg className="mx-auto h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Something went wrong</h2>
            <p className="mt-2 text-gray-600">An error occurred while loading this page.</p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ErrorBoundary>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/order-history" element={<OrderHistory />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dietary" element={<DietaryInfo />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
