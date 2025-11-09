import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Security: Passwords loaded from environment variables
// IMPORTANT: Even with env vars, passwords are still visible in bundled JavaScript
// For production, consider server-side authentication
// See SECURITY.md for more information
const DEFAULT_PASSWORD = import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD || 'ayoub100'
const OWNER_PASSWORD = import.meta.env.VITE_OWNER_UNLOCK_PASSWORD || 'owner_unlock_2024'

// Simple hash function for password comparison (basic obfuscation)
const hashPassword = (password) => {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize password on first load if not set
    if (!localStorage.getItem('portfolio_admin_password_hash')) {
      localStorage.setItem('portfolio_admin_password_hash', hashPassword(DEFAULT_PASSWORD))
    }

    // Check if user is already authenticated
    const authToken = localStorage.getItem('portfolio_admin_token')
    const authExpiry = localStorage.getItem('portfolio_admin_expiry')
    
    if (authToken && authExpiry) {
      const now = new Date().getTime()
      if (now < parseInt(authExpiry)) {
        setIsAuthenticated(true)
      } else {
        // Token expired
        localStorage.removeItem('portfolio_admin_token')
        localStorage.removeItem('portfolio_admin_expiry')
      }
    }
    setLoading(false)
  }, [])

  const login = (password) => {
    if (!password || password.trim() === '') {
      return false
    }

    // Check if owner password (master unlock password)
    if (password && password.trim() === OWNER_PASSWORD.trim()) {
      // Reset lockout and attempts
      localStorage.removeItem('portfolio_admin_lock_until')
      localStorage.removeItem('portfolio_admin_attempts')
      // Don't log in with owner password, just unlock
      return { unlocked: true, message: 'Account unlocked. Please login with your regular password.' }
    }

    // Get stored password hash
    const storedHash = localStorage.getItem('portfolio_admin_password_hash')
    
    // Calculate hash of entered password
    const enteredHash = hashPassword(password)
    
    // Verify password - must match stored hash exactly
    if (enteredHash === storedHash) {
      // Reset lockout and attempts on successful login
      localStorage.removeItem('portfolio_admin_lock_until')
      localStorage.removeItem('portfolio_admin_attempts')
      
      const token = btoa(`admin_${Date.now()}_${Math.random()}`)
      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000 // 24 hours
      
      localStorage.setItem('portfolio_admin_token', token)
      localStorage.setItem('portfolio_admin_expiry', expiry.toString())
      setIsAuthenticated(true)
      return true
    }
    
    return false
  }

  const unlockAccount = (password) => {
    // Owner password can unlock the account
    if (password === OWNER_PASSWORD) {
      localStorage.removeItem('portfolio_admin_lock_until')
      localStorage.removeItem('portfolio_admin_attempts')
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('portfolio_admin_token')
    localStorage.removeItem('portfolio_admin_expiry')
    setIsAuthenticated(false)
  }

  const changePassword = (oldPassword, newPassword) => {
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      return false
    }

    // Get stored password hash
    const storedHash = localStorage.getItem('portfolio_admin_password_hash')
    const oldPasswordHash = hashPassword(oldPassword)
    
    // Verify old password matches
    if (oldPasswordHash === storedHash) {
      // Store new password hash
      const newPasswordHash = hashPassword(newPassword)
      localStorage.setItem('portfolio_admin_password_hash', newPasswordHash)
      return true
    }
    
    return false
  }

  const getPasswordHint = () => {
    // For security, we don't expose the password, but provide a hint if needed
    const storedHash = localStorage.getItem('portfolio_admin_password_hash')
    const defaultHash = hashPassword(DEFAULT_PASSWORD)
    
    // If using default password, show hint
    if (storedHash === defaultHash) {
      return 'Using default password. Please change it in Settings.'
    }
    
    return null
  }

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    changePassword,
    getPasswordHint,
    unlockAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

