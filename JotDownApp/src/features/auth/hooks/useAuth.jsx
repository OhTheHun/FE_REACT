/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { loginWithCredentials, logoutUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')

  const login = async (payload) => {
    try {
      const result = await loginWithCredentials(payload)
      setUser(result)
      setAuthError('')
    } catch (error) {
      setAuthError(error.message)
    }
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
    setAuthError('')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, authError }}>
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
