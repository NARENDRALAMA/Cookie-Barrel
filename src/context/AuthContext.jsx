import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('cookieBarrelToken')
    if (token) {
      // Verify token with backend
      api.getCurrentUser()
        .then(response => {
          setUser(response.user)
        })
        .catch(error => {
          console.error('Token verification failed:', error)
          localStorage.removeItem('cookieBarrelToken')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials)
      const { token, user } = response
      
      localStorage.setItem('cookieBarrelToken', token)
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.register(userData)
      const { token, user } = response
      
      localStorage.setItem('cookieBarrelToken', token)
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cookieBarrelToken')
  }

  const value = {
    user,
    login,
    logout,
    register,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
