/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { loginWithCredentials, logoutUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jotdown_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [authError, setAuthError] = useState('')

  const login = async (payload) => {
    try {
      const result = await loginWithCredentials(payload)
      setUser(result)
      localStorage.setItem('jotdown_user', JSON.stringify(result))
      setAuthError('')
    } catch (error) {
      setAuthError(error.message)
    }
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
    localStorage.removeItem('jotdown_user')
    setAuthError('')
  }

  const updateUser = (data) => {
    setUser((current) => {
      if (!current) return null
      const updated = { ...current, ...data }
      localStorage.setItem('jotdown_user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, authError, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
