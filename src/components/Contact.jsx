import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { Send, Mail, MessageSquare, User, Phone, MapPin, Clock, FileText, CheckCircle, Sparkles, AlertCircle } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import { fadeIn, staggerContainer } from '../utils/motion'
import { cn } from '../utils/cn'
import emailjs from '@emailjs/browser'
 
// Ensure EmailJS is initialized once with the public key
let emailjsInitialized = false
const ensureEmailJsInit = (publicKey) => {
  try {
    if (!emailjsInitialized && publicKey) {
      // Some environments require explicit init before send
      emailjs.init(publicKey)
      emailjsInitialized = true
    }
  } catch (e) {
    // If init fails, we will still try send with the 4th arg fallback
    // This is safe and keeps compatibility with EmailJS API
  }
}

function Floating3D() {
  return (
    <group>
      <Sphere args={[1, 100, 200]} scale={1.2}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0}
        />
      </Sphere>
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.5}
        enablePan={false}
      />
    </group>
  )
}

function SocialIcon({ iconName }) {
  const iconMap = {
    GITHUB: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    LINKEDIN: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
    TWITTER: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
    MAIL: <Mail className="w-5 h-5" />,
  }

  return iconMap[iconName] || <Mail className="w-5 h-5" />
}

// Icon mapping for contact info
const iconMap = {
  Mail,
  Phone,
  MapPin,
  Clock,
}

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { socials, contactInfo, loading } = usePortfolio()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [focusedField, setFocusedField] = useState(null)

  if (loading) {
    return <div className="min-h-screen py-20 flex items-center justify-center">Loading...</div>
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')

    // Get EmailJS configuration from environment or localStorage
    const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || localStorage.getItem('emailjs_service_id')
    const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || localStorage.getItem('emailjs_template_id')
    const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || localStorage.getItem('emailjs_public_key')

    // Check if EmailJS is configured
    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      setIsSubmitting(false)
      setErrorMessage(
        'Email service not configured. Open Admin → Contact Info and fill: Service ID, Template ID, Public Key, then click Save. Alternatively set env vars: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY.'
      )
      setSubmitStatus('error')
      setTimeout(() => {
        setSubmitStatus(null)
        setErrorMessage('')
      }, 5000)
      return
    }

    try {
      // Determine recipient email from Contact Info or environment
      const contactEmail = (contactInfo.find(info => info.id === 'email')?.value || '').trim()
      const envRecipient = (import.meta.env.VITE_CONTACT_EMAIL || localStorage.getItem('contact_to_email') || '').trim()
      const recipientEmail = contactEmail.includes('@') ? contactEmail : envRecipient

      if (!recipientEmail || !recipientEmail.includes('@')) {
        setIsSubmitting(false)
        setErrorMessage(
          'Recipient email is not configured. Open Admin → Contact Info and set the Email card value to a valid address (e.g., yourname@example.com), or set VITE_CONTACT_EMAIL in .env.local.'
        )
        setSubmitStatus('error')
        setTimeout(() => {
          setSubmitStatus(null)
          setErrorMessage('')
        }, 6000)
        return
      }

      // Initialize if needed (best compatibility across environments)
      ensureEmailJsInit(emailjsPublicKey)

      // Template parameters – include common aliases to match various template setups
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: recipientEmail,
        // Common alternative recipient keys some templates expect
        to: recipientEmail,
        recipient: recipientEmail,
        // Helpful aliases used by many EmailJS templates
        reply_to: formData.email,
        user_name: formData.name,
        user_email: formData.email,
        to_name: 'Portfolio Owner',
      }

      // Send email via EmailJS (prefer 3-arg call after init; fallback to 4-arg if not initialized)
      let result
      try {
        result = await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          templateParams
        )
      } catch (sendErr) {
        // Fallback path for cases where init wasn't recognized
        result = await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          templateParams,
          emailjsPublicKey
        )
      }

      if (result.status === 200 || result.text === 'OK') {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setFocusedField(null)
        setTimeout(() => setSubmitStatus(null), 5000)
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('EmailJS Error:', error)
      // Provide more precise messages based on common EmailJS errors and surface raw details
      const raw = (error && (error.text || error.message)) || ''
      let friendly = 'Failed to send message. Please try again later or contact me directly via email.'
      if (/user id|public key/i.test(raw)) friendly = 'EmailJS Public Key missing or invalid. Check Admin → Contact Info (Public Key).'
      if (/service id/i.test(raw)) friendly = 'EmailJS Service ID is invalid. Verify in Admin → Contact Info.'
      if (/template id/i.test(raw)) friendly = 'EmailJS Template ID is invalid. Verify in Admin → Contact Info.'
      if (/not found|does not exist/i.test(raw)) friendly = 'EmailJS template not found. Ensure the Template ID exists in your EmailJS dashboard.'
      if (/unauthorized|401|403/i.test(raw)) friendly = 'EmailJS authorization failed. Re-check the Public Key and that the service/template belong to your account.'
      if (/network|fetch|cors/i.test(raw)) friendly = 'Network error while contacting EmailJS. Check your internet connection and try again.'
      const detailed = raw ? `${friendly} Details: ${raw}` : friendly
      setSubmitStatus('error')
      setErrorMessage(detailed)
      setTimeout(() => {
        setSubmitStatus(null)
        setErrorMessage('')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative min-h-screen py-20 md:py-32 overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.05),transparent_60%)]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            variants={fadeIn('up', 0.2)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/70">
              Let's Work Together
            </span>
          </motion.div>
          
          <motion.h2
            variants={fadeIn('up', 0.3)}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Get In <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Touch</span>
          </motion.h2>
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto"
          >
            Have a project in mind or want to collaborate? I'm always excited to hear about new opportunities and ideas.
          </motion.p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16"
        >
          {contactInfo.map((info, index) => {
            const IconComponent = iconMap[info.icon] || Mail
            return (
              <motion.div
                key={info.id}
                variants={fadeIn('up', 0.2 + index * 0.1)}
                className={cn(
                  'relative p-4 md:p-6 rounded-xl border',
                  info.bgColor,
                  info.borderColor,
                  'hover:shadow-lg transition-all duration-300',
                  'group cursor-pointer'
                )}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className={cn('inline-flex p-3 rounded-lg mb-3', info.bgColor)}>
                  <IconComponent className={cn('w-5 h-5 md:w-6 md:h-6', info.color)} />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{info.title}</h3>
                <p className="text-xs md:text-sm text-foreground/80 font-medium mb-1">{info.value}</p>
                <p className="text-xs text-foreground/50">{info.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Social Links */}
          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            className="space-y-8"
          >
            <motion.div variants={fadeIn('right', 0.3)}>
              <h3 className="text-3xl font-bold mb-4">Let's Connect</h3>
              <p className="text-foreground/70 text-lg mb-8 leading-relaxed">
                I'm always open to discussing new projects, creative ideas, or
                opportunities to be part of your visions. Feel free to reach out through
                any of these channels.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn('right', 0.4)}
              className="flex flex-wrap gap-4"
            >
              {socials.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-5 py-3 rounded-xl',
                    'bg-card/50 hover:bg-card border border-border',
                    'transition-all duration-300 text-foreground/80 hover:text-foreground',
                    'shadow-sm hover:shadow-md backdrop-blur-sm'
                  )}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SocialIcon iconName={social.icon} />
                  <span className="text-sm font-semibold">{social.name}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            variants={fadeIn('left', 0.3)}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            className="relative"
          >
            <div className="relative p-8 rounded-2xl bg-card/50 border border-border shadow-xl backdrop-blur-sm">
              {/* Gradient Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-t-2xl" />
              
              <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2 text-foreground/90"
                >
                  Name *
                </label>
                <div className="relative">
                  <User className={cn(
                    'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors',
                    focusedField === 'name' ? 'text-primary' : 'text-foreground/40'
                  )} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-lg transition-all',
                      'bg-background/50 border',
                      focusedField === 'name' 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                      'text-foreground placeholder:text-foreground/40'
                    )}
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2 text-foreground/90"
                >
                  Email *
                </label>
                <div className="relative">
                  <Mail className={cn(
                    'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors',
                    focusedField === 'email' ? 'text-primary' : 'text-foreground/40'
                  )} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-lg transition-all',
                      'bg-background/50 border',
                      focusedField === 'email' 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                      'text-foreground placeholder:text-foreground/40'
                    )}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold mb-2 text-foreground/90"
                >
                  Subject *
                </label>
                <div className="relative">
                  <FileText className={cn(
                    'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors',
                    focusedField === 'subject' ? 'text-primary' : 'text-foreground/40'
                  )} />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-lg transition-all',
                      'bg-background/50 border',
                      focusedField === 'subject' 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                      'text-foreground placeholder:text-foreground/40'
                    )}
                    placeholder="What's this about?"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-foreground/90"
                  >
                    Message *
                  </label>
                  <span className="text-xs text-foreground/50">
                    {formData.message.length} / 1000
                  </span>
                </div>
                <div className="relative">
                  <MessageSquare className={cn(
                    'absolute left-3 top-3 w-5 h-5 transition-colors',
                    focusedField === 'message' ? 'text-primary' : 'text-foreground/40'
                  )} />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    maxLength={1000}
                    rows={6}
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-lg transition-all',
                      'bg-background/50 border',
                      focusedField === 'message' 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                      'text-foreground placeholder:text-foreground/40 resize-none'
                    )}
                    placeholder="Tell me about your project or idea..."
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full px-6 py-4 rounded-lg bg-gradient-to-r from-primary to-primary/80',
                  'text-primary-foreground font-semibold',
                  'hover:from-primary/90 hover:to-primary/70 transition-all',
                  'flex items-center justify-center gap-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'shadow-lg hover:shadow-xl relative overflow-hidden',
                  'group'
                )}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {/* Shine effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 text-green-500"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Message sent successfully!</p>
                        <p className="text-sm text-green-500/80">I'll get back to you as soon as possible.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20 text-red-500"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Failed to send message</p>
                        <p className="text-sm text-red-500/80">{errorMessage || 'Please try again later.'}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeIn('up', 0.5)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="mt-16 h-[300px] hidden lg:block"
        >
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Floating3D />
            </Canvas>
          </Suspense>
        </motion.div>
      </div>
    </section>
  )
}

