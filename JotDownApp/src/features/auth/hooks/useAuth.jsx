/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getRoleHomePath,
  loginWithCredentials,
  logoutUser,
  registerWithCredentials,
} from '../services/authService'

const AuthContext = createContext(null)
const FONT_SIZE_MAP = { small: '14px', medium: '16px', large: '18px' }

function isJwtTokenUsable(token) {
  if (!token) return false

  const [, payload] = token.split('.')
  if (!payload) return true

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(atob(normalizedPayload))
    return !decoded.exp || decoded.exp * 1000 > Date.now()
  } catch {
    return true
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('jotdown_token')
    } catch {
      return null
    }
  })
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jotdown_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [authError, setAuthError] = useState('')
  const isAuthenticated = useMemo(() => !!user && isJwtTokenUsable(token), [user, token])

  useEffect(() => {
    const theme = user?.theme || 'light'
    const fontSize = user?.font_size || 'medium'
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches

    document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && prefersDark))
    document.documentElement.style.fontSize = FONT_SIZE_MAP[fontSize] || FONT_SIZE_MAP.medium
    document.documentElement.style.setProperty('--jotdown-default-note-color', user?.default_note_color || '#ffffff')
  }, [user?.theme, user?.font_size, user?.default_note_color])

  const saveSession = useCallback(({ user: nextUser, token: nextToken }) => {
    setUser(nextUser)
    localStorage.setItem('jotdown_user', JSON.stringify(nextUser))

    if (nextToken) {
      setToken(nextToken)
      localStorage.setItem('jotdown_token', nextToken)
    }
  }, [])

  const login = useCallback(async (payload) => {
    try {
      const result = await loginWithCredentials(payload)
      saveSession(result)
      setAuthError('')
      return result
    } catch (error) {
      setAuthError(error.message)
      throw error
    }
  }, [saveSession])

  const register = useCallback(async (payload) => {
    try {
      const result = await registerWithCredentials(payload)

      if (result.user && result.token) {
        saveSession(result)
        setAuthError('')
        return result
      }

      return login({ email: payload.email, password: payload.password })
    } catch (error) {
      setAuthError(error.message)
      throw error
    }
  }, [login, saveSession])

  const logout = useCallback(async () => {
    await logoutUser()
    setUser(null)
    setToken(null)
    localStorage.removeItem('jotdown_user')
    localStorage.removeItem('jotdown_token')
    setAuthError('')
  }, [])

  useEffect(() => {
    const handleInvalidAuth = () => {
      logout()
    }

    window.addEventListener('jotdown:auth-invalid', handleInvalidAuth)
    return () => window.removeEventListener('jotdown:auth-invalid', handleInvalidAuth)
  }, [logout])

  const updateUser = useCallback((data) => {
    setUser((current) => {
      if (!current) return null
      const updated = { ...current, ...data }
      localStorage.setItem('jotdown_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout, authError, updateUser, getRoleHomePath }}>
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
