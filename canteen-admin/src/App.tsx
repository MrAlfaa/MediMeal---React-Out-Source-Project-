import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import SuperadminSetup from './components/SuperadminSetup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

// Set axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api'

function App() {
  const [superadminExists, setSuperadminExists] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSuperadmin = async () => {
      try {
        console.log('Checking superadmin...')
        const response = await axios.get('/auth/check-superadmin')
        console.log('Superadmin check response:', response.data)
        setSuperadminExists(response.data.exists)
        setError(null)
      } catch (error: any) {
        console.error('Error checking superadmin:', error)
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        })
        
        // If server is not running or API is not available
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          setError('Cannot connect to server. Please make sure the server is running on http://localhost:5000')
        } else if (error.response?.status === 404) {
          setError('API endpoint not found. Please check server routes.')
        } else {
          setError(error.response?.data?.message || 'Failed to check superadmin status')
        }
        setSuperadminExists(false)
      } finally {
        setLoading(false)
      }
    }

    checkSuperadmin()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="mt-4 text-indigo-600 font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Connection Error</h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {!superadminExists ? (
              // If no superadmin exists, show setup
              <>
                <Route path="/setup" element={<SuperadminSetup />} />
                <Route path="*" element={<Navigate to="/setup" />} />
              </>
            ) : (
              // If superadmin exists, show normal routes
              <>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
