import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Edit2, Save, X, CheckCircle } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { cn } from '../../utils/cn'

const iconMap = {
  Mail,
  Phone,
  MapPin,
  Clock,
}

export default function ContactInfoForm() {
  const { contactInfo, updateContactInfo } = usePortfolio()
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  
  // EmailJS Configuration (hardcoded in code)
  const emailjsServiceId = 'service_48ams9f'
  const emailjsTemplateId = 'template_pgyr115'
  const emailjsPublicKey = '4dZJCDcp6anscSSmL'

  const handleEdit = (info) => {
    setEditingId(info.id)
    setEditData({
      title: info.title,
      value: info.value,
      description: info.description,
    })
  }

  const handleSave = (id) => {
    updateContactInfo(id, editData)
    setEditingId(null)
    setEditData({})
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">Contact Information</h3>
          <p className="text-foreground/60 mt-1">Manage your contact details displayed in the contact section</p>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Contact information updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactInfo.map((info) => {
          const IconComponent = iconMap[info.icon] || Mail
          const isEditing = editingId === info.id

          return (
            <motion.div
              key={info.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-6 rounded-xl border',
                info.bgColor,
                info.borderColor,
                'relative'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn('inline-flex p-3 rounded-lg', info.bgColor)}>
                  <IconComponent className={cn('w-6 h-6', info.color)} />
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => handleEdit(info)}
                    className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-foreground/60" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(info.id)}
                      className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div>
                  <h4 className="font-semibold text-lg mb-2">{info.title}</h4>
                  <p className="text-foreground/80 font-medium mb-1">{info.value}</p>
                  <p className="text-sm text-foreground/50">{info.description}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editData.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Value
                    </label>
                    <input
                      type="text"
                      value={editData.value || ''}
                      onChange={(e) => handleChange('value', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* EmailJS Configuration Section - Read Only */}
      <div className="mt-8 p-6 rounded-xl bg-card border border-border">
        <h4 className="text-xl font-bold mb-4">Email Service Configuration</h4>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-semibold">EmailJS Configured</span>
            </div>
            <p className="text-sm text-foreground/70 mb-4">
              EmailJS is configured and ready to use. The contact form will automatically send emails using these settings.
            </p>
            
            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-foreground/60">
                  Service ID
                </label>
                <div className="px-4 py-2 rounded-lg bg-background/30 border border-border text-foreground/80 font-mono text-sm">
                  {emailjsServiceId}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1 text-foreground/60">
                  Template ID
                </label>
                <div className="px-4 py-2 rounded-lg bg-background/30 border border-border text-foreground/80 font-mono text-sm">
                  {emailjsTemplateId}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1 text-foreground/60">
                  Public Key
                </label>
                <div className="px-4 py-2 rounded-lg bg-background/30 border border-border text-foreground/80 font-mono text-sm">
                  {emailjsPublicKey ? '••••••••••••' + emailjsPublicKey.slice(-4) : 'Not set'}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-foreground/50 mt-4">
              ✅ Contact form is active and ready to receive messages.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

