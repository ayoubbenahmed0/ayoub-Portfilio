import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

const categories = ['Frontend', 'Backend', 'Language', 'Database', 'Tools', 'DevOps', 'Cloud', '3D', 'Design']

export default function SkillForm({ skill, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '',
    level: 50,
    category: 'Frontend',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (skill) {
      setFormData({
        id: skill.id || '',
        name: skill.name || '',
        icon: skill.icon || '',
        level: skill.level || 50,
        category: skill.category || 'Frontend',
      })
    }
  }, [skill])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.icon.trim()) {
      newErrors.icon = 'Icon is required'
    }
    if (formData.level < 0 || formData.level > 100) {
      newErrors.level = 'Level must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
          {skill ? 'Edit Skill' : 'Add New Skill'}
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
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Icon (Emoji) *</label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => {
              setFormData({ ...formData, icon: e.target.value })
              if (errors.icon) setErrors({ ...errors, icon: null })
            }}
            className={cn(
              'w-full px-4 py-2 rounded-lg border text-2xl',
              'bg-background/50 border-border focus:ring-2 focus:ring-primary',
              'focus:outline-none focus:border-transparent',
              errors.icon && 'border-red-500'
            )}
            placeholder="⚛️"
            maxLength={2}
          />
          {errors.icon && (
            <p className="mt-1 text-sm text-red-500">{errors.icon}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border bg-background/50 border-border focus:ring-2 focus:ring-primary focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Proficiency Level: {formData.level}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.level}
            onChange={(e) =>
              setFormData({ ...formData, level: parseInt(e.target.value) })
            }
            className="w-full"
          />
          {errors.level && (
            <p className="mt-1 text-sm text-red-500">{errors.level}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            {skill ? 'Update Skill' : 'Add Skill'}
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

