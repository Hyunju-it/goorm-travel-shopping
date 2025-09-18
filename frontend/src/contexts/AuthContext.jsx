import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/authService'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    async function init() {
      try {
        const response = await fetchCurrentUser()
        if (response.success && response.user) {
          setState({ user: response.user, isAuthenticated: true, isLoading: false, error: null })
        } else {
          setState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    init()
  }, [])

  const login = useCallback(async (credentials) => {
    setState((prev) => ({ ...prev, error: null }))
    try {
      const response = await loginRequest(credentials)
      if (response.success && response.user) {
        setState({ user: response.user, isAuthenticated: true, isLoading: false, error: null })
        return { success: true }
      }
      const message = response.message || '로그인에 실패했습니다.'
      setState((prev) => ({ ...prev, error: message, isAuthenticated: false }))
      return { success: false, error: message }
    } catch (error) {
      const message = error.message || '로그인 중 오류가 발생했습니다.'
      setState((prev) => ({ ...prev, error: message, isAuthenticated: false }))
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      setState({ ...initialState, isLoading: false })
    }
  }, [])

  const register = useCallback(async (userData) => {
    try {
      const response = await registerRequest(userData)
      if (response.success) {
        return { success: true }
      }
      return { success: false, error: response.message || '회원가입에 실패했습니다.' }
    } catch (error) {
      return { success: false, error: error.message || '회원가입 중 오류가 발생했습니다.' }
    }
  }, [])

  const setError = useCallback((error) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  const value = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      login,
      logout,
      register,
      setError,
    }),
    [state, login, logout, register, setError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
