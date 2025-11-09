import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function ProjectForm({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: [],
    github: '',
    demo: '',
    featured: false,
  })
  const [techInput, setTechInput] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        image: project.image || '',
        technologies: project.technologies || [],
        github: project.github || '',
        demo: project.demo || '',
        featured: project.featured || false,
      })
    }
  }, [project])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required'
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL'
    }
    if (formData.github && !isValidUrl(formData.github)) {
      newErrors.github = 'Please enter a valid URL'
    }
    if (formData.demo && !isValidUrl(formData.demo)) {
      newErrors.demo = 'Please enter a valid URL'
    }
    if (formData.technologies.length === 0) {
      newErrors.technologies = 'At least one technology is required'
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

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput('')
      if (errors.technologies) {
        setErrors({ ...errors, technologies: null })
      }
    }
  }

  const handleRemoveTech = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          {project ? 'Edit Project' : 'Add New Project'}
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
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value })
              if (errors.title) setErrors({ ...errors, title: null })
            }}
            className={cn(
              'w-full px-4 py-2 rounded-lg border',
              'bg-background/50 border-border focus:ring-2 focus:ring-primary',
              'focus:outline-none focus:border-transparent',
              errors.title && 'border-red-500'
            )}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value })
              if (errors.description) setErrors({ ...errors, description: null })
            }}
            rows={4}
            className={cn(
              'w-full px-4 py-2 rounded-lg border resize-none',
              'bg-background/50 border-border focus:ring-2 focus:ring-primary',
              'focus:outline-none focus:border-transparent',
              errors.description && 'border-red-500'
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL *</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => {
              setFormData({ ...formData, image: e.target.value })
              if (errors.image) setErrors({ ...errors, image: null })
            }}
            className={cn(
              'w-full px-4 py-2 rounded-lg border',
              'bg-background/50 border-border focus:ring-2 focus:ring-primary',
              'focus:outline-none focus:border-transparent',
              errors.image && 'border-red-500'
            )}
            placeholder="https://images.unsplash.com/..."
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
          )}
          {formData.image && (
            <div className="mt-3">
              <label className="block text-xs font-medium mb-2 text-foreground/60">Preview</label>
              <div className="w-full h-48 rounded-lg overflow-hidden border border-border bg-accent/5">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    const errorDiv = e.target.nextElementSibling
                    if (errorDiv) errorDiv.style.display = 'flex'
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-foreground/40 text-sm">
                  Invalid image URL or image failed to load
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Technologies *</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTech()
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg border bg-background/50 border-border focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Add technology..."
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          {errors.technologies && (
            <p className="mt-1 text-sm text-red-500">{errors.technologies}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <input
            type="url"
            value={formData.github}
            onChange={(e) => {
              setFormData({ ...formData, github: e.target.value })
              if (errors.github) setErrors({ ...errors, github: null })
            }}
            className={cn(
              'w-full px-4 py-2 rounded-lg border',
              'bg-background/50 border-border focus:ring-2 focus:ring-primary',
              'focus:outline-none focus:border-transparent',
              errors.github && 'border-red-500'
            )}
            placeholder="https://github.com/..."
          />
          {errors.github && (
            <p className="mt-1 text-sm text-red-500">{errors.github}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Demo URL</label>
          <input
            type="url"
            value={formData.demo}
            onChange={(e) => {
              setFormData({ ...formData, demo: e.target.value })
              if (errors.demo) setErrors({ ...errors, demo: null })
            }}
            className={cn(
              'w-full px-4 py-2 rounded-lg border',
              'bg-background/50 border-border focus:ring-2 focus:ring-primary',
              'focus:outline-none focus:border-transparent',
              errors.demo && 'border-red-500'
            )}
            placeholder="https://example.com"
          />
          {errors.demo && (
            <p className="mt-1 text-sm text-red-500">{errors.demo}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Featured Project
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            {project ? 'Update Project' : 'Add Project'}
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

