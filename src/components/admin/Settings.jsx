import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Lock, 
  Download, 
  Upload, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePortfolio } from '../../context/PortfolioContext'
import { cn } from '../../utils/cn'

export default function Settings({ onShowSuccess }) {
  const { changePassword } = useAuth()
  const { projects, skills, socials } = usePortfolio()
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setPasswordError('')
    setPasswordSuccess('')
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from the current password')
      return
    }

    const success = changePassword(passwordData.oldPassword, passwordData.newPassword)
    
    if (success) {
      setPasswordSuccess('Password changed successfully! Please login again with your new password.')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      if (onShowSuccess) {
        onShowSuccess('Password changed successfully! Please login again.')
      }
      // Logout after password change for security
      setTimeout(() => {
        window.location.href = '/admin/login'
      }, 2000)
    } else {
      setPasswordError('Current password is incorrect')
    }
  }

  const handleExportData = () => {
    const data = {
      projects,
      skills,
      socials,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    if (onShowSuccess) {
      onShowSuccess('Data exported successfully!')
    }
  }

  const handleImportData = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        
        if (data.projects) localStorage.setItem('portfolio_projects', JSON.stringify(data.projects))
        if (data.skills) localStorage.setItem('portfolio_skills', JSON.stringify(data.skills))
        if (data.socials) localStorage.setItem('portfolio_socials', JSON.stringify(data.socials))
        
        if (onShowSuccess) {
          onShowSuccess('Data imported successfully! Refreshing...')
          setTimeout(() => window.location.reload(), 1500)
        }
      } catch (error) {
        alert('Error importing data: Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone!')) {
      localStorage.removeItem('portfolio_projects')
      localStorage.removeItem('portfolio_skills')
      localStorage.removeItem('portfolio_socials')
      if (onShowSuccess) {
        onShowSuccess('Data reset successfully! Refreshing...')
        setTimeout(() => window.location.reload(), 1500)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Change Password</h3>
            <p className="text-sm text-foreground/60">Update your admin password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.old ? 'text' : 'password'}
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className={cn(
                  'w-full pl-4 pr-12 py-2 rounded-lg border',
                  'bg-background/50 border-border focus:ring-2 focus:ring-primary',
                  'focus:outline-none'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={cn(
                  'w-full pl-4 pr-12 py-2 rounded-lg border',
                  'bg-background/50 border-border focus:ring-2 focus:ring-primary',
                  'focus:outline-none'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={cn(
                  'w-full pl-4 pr-12 py-2 rounded-lg border',
                  'bg-background/50 border-border focus:ring-2 focus:ring-primary',
                  'focus:outline-none'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckCircle className="w-4 h-4" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Change Password
          </button>
        </form>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Data Management</h3>
            <p className="text-sm text-foreground/60">Export or import your portfolio data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExportData}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:bg-accent/10 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>

            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:bg-accent/10 transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={handleResetData}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Reset All Data
            </button>
            <p className="text-xs text-foreground/50 mt-2">
              This will delete all your custom data and restore defaults
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


