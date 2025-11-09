import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

const iconOptions = [
  { value: 'GITHUB', label: 'GitHub' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'TWITTER', label: 'Twitter' },
  { value: 'MAIL', label: 'Email' },
]

export default function SocialForm({ social, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    url: '',
    icon: 'GITHUB',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (social) {
      setFormData({
        id: social.id || '',
        name: social.name || '',
        url: social.url || '',
        icon: social.icon || 'GITHUB',
      })
    }
  }, [social])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else if (!isValidUrl(formData.url) && !formData.url.startsWith('mailto:')) {
      newErrors.url = 'Please enter a valid URL or mailto link'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const finalData = {
        ...formData,
        id: formData.id || formData.name.toLowerCase().replace(/\s+/g, '-'),
      }
      onSave(finalData)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          {social ? 'Edit Social Link' : 'Add New Social Link'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              if (errors.name) setErrors({ ...errors, name: null })
            }}
            className={cn(
              'w-full px-4 py-2 rounded-lg border',
              'bg-background/50 border-border focus:ring-2 focus:ring-primary',
              'focus:outline-none focus:border-transparent',
              errors.name && 'border-red-500'
            )}
            placeholder="GitHub"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL *</label>
          <input
            type="text"
            value={formData.url}
            onChange={(e) => {
              setFormData({ ...formData, url: e.target.value })
              if (errors.url) setErrors({ ...errors, url: null })
            }}
            className={cn(
              'w-full px-4 py-2 rounded-lg border',
              'bg-background/50 border-border focus:ring-2 focus:ring-primary',
              'focus:outline-none focus:border-transparent',
              errors.url && 'border-red-500'
            )}
            placeholder="https://github.com/username or mailto:email@example.com"
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-500">{errors.url}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Icon *</label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border bg-background/50 border-border focus:ring-2 focus:ring-primary focus:outline-none"
          >
            {iconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            {social ? 'Update Social Link' : 'Add Social Link'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent/10 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  )
}

