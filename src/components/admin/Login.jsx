import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fadeIn } from '../../utils/motion'
import { cn } from '../../utils/cn'

export default function Login() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const { login, unlockAccount } = useAuth()
  
  // Get owner password from environment (falls back to default)
  const ownerPassword = import.meta.env.VITE_OWNER_UNLOCK_PASSWORD || 'owner_unlock_2024'

  useEffect(() => {
    // Check if account is locked
    const lockUntil = localStorage.getItem('portfolio_admin_lock_until')
    if (lockUntil) {
      const now = new Date().getTime()
      if (now < parseInt(lockUntil)) {
        setIsLocked(true)
        const remainingTime = Math.ceil((parseInt(lockUntil) - now) / 1000 / 60)
        setError(`Account locked. Please try again in ${remainingTime} minute(s).`)
      } else {
        localStorage.removeItem('portfolio_admin_lock_until')
        localStorage.removeItem('portfolio_admin_attempts')
      }
    }

    // Load attempts from localStorage
    const storedAttempts = localStorage.getItem('portfolio_admin_attempts')
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!password.trim()) {
      setError('Please enter a password')
      return
    }

    // Check if owner password first (works even when locked)
    if (password.trim() === ownerPassword.trim()) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const unlocked = unlockAccount(password)
      if (unlocked) {
        setError('')
        setIsLocked(false)
        setAttempts(0)
        setPassword('')
        // Show success message using state
        const successMsg = document.createElement('div')
        successMsg.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 shadow-lg flex items-center gap-2'
        successMsg.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>✅ Account unlocked! Please login with your regular password.</span>'
        document.body.appendChild(successMsg)
        setTimeout(() => {
          if (document.body.contains(successMsg)) {
            document.body.removeChild(successMsg)
          }
        }, 4000)
        setIsLoading(false)
        return
      } else {
        setError('Invalid owner password.')
        setIsLoading(false)
        return
      }
    }
    
    // Check if locked (after checking owner password)
    const lockUntil = localStorage.getItem('portfolio_admin_lock_until')
    const isCurrentlyLocked = lockUntil && new Date().getTime() < parseInt(lockUntil)
    
    if (isCurrentlyLocked) {
      const remainingTime = Math.ceil((parseInt(lockUntil) - new Date().getTime()) / 1000 / 60)
      setError(`Account locked. Please try again in ${remainingTime} minute(s). Use owner password to unlock immediately.`)
      return
    }

    setIsLoading(true)

    // Simulate a small delay for better UX (also prevents brute force)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = login(password)
    
    // Handle owner password unlock response
    if (result && typeof result === 'object' && result.unlocked) {
      setIsLocked(false)
      setAttempts(0)
      setPassword('')
      const successMsg = document.createElement('div')
      successMsg.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 shadow-lg'
      successMsg.textContent = result.message
      document.body.appendChild(successMsg)
      setTimeout(() => {
        document.body.removeChild(successMsg)
      }, 3000)
      setIsLoading(false)
      return
    }
    
    if (result === true) {
      // Reset attempts on successful login
      localStorage.removeItem('portfolio_admin_attempts')
      localStorage.removeItem('portfolio_admin_lock_until')
      window.location.href = '/admin'
    } else {
      // Increment failed attempts (but not if account is already locked)
      if (!isCurrentlyLocked) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        localStorage.setItem('portfolio_admin_attempts', newAttempts.toString())

        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          const lockTime = new Date().getTime() + (15 * 60 * 1000) // 15 minutes
          localStorage.setItem('portfolio_admin_lock_until', lockTime.toString())
          setIsLocked(true)
          setError('Too many failed attempts. Account locked for 15 minutes.')
        } else {
          const remaining = 5 - newAttempts
          setError(`Invalid password. ${remaining} attempt(s) remaining.`)
        }
      } else {
        setError('Invalid password. Account is locked.')
      }
      setPassword('')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background px-4">
      <motion.div
        variants={fadeIn('up', 0.2)}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              variants={fadeIn('up', 0.3)}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            >
              <Lock className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-foreground/60">Enter your password to continue</p>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs"
              >
                <p className="font-semibold mb-1">⚠️ Account Locked</p>
                <p>Contact owner for unlock password</p>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-foreground/80"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  className={cn(
                    'w-full pl-4 pr-12 py-3 rounded-lg',
                    'bg-background/50 border border-border',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    'text-foreground placeholder:text-foreground/40',
                    error && 'border-red-500'
                  )}
                  placeholder={isLocked ? "Enter owner password to unlock" : "Enter admin password"}
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 text-sm text-red-500"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !password || (isLocked && password.trim() !== ownerPassword.trim())}
              className={cn(
                'w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground',
                'font-semibold hover:bg-primary/90 transition-all',
                'flex items-center justify-center gap-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'shadow-lg shadow-primary/30'
              )}
              whileHover={{ scale: isLoading || !password || (isLocked && password.trim() !== ownerPassword.trim()) ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !password || (isLocked && password.trim() !== ownerPassword.trim()) ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Login
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

