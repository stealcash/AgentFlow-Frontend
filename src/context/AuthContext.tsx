'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, updateAuthToken, clearAuthToken } from '@/utils/AuthToken'

type AuthContextType = {
  token: string | null
  login: (token: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = getAuthToken(false)
    if (stored) setToken(stored)
    setLoading(false)
  }, [])

  const login = (newToken: string) => {
    updateAuthToken(newToken)
    setToken(newToken)
  }

  const logout = () => {
    clearAuthToken()
    setToken(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
