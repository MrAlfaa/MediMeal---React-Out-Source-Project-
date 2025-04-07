import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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

function App() {
  return (
    <Router>
      <AuthProvider>
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
      </AuthProvider>
    </Router>
  )
}

export default App



