import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { MapPin, CheckCircle, Code, Award, Users, Briefcase } from 'lucide-react'
import { aboutData } from '../data/about'
import { fadeIn, staggerContainer, scaleIn } from '../utils/motion'
import { cn } from '../utils/cn'

function Enhanced3DScene() {
  return (
    <>
      {/* Main floating sphere */}
      <Sphere args={[1.2, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#3b82f6"
          distort={0.4}
          speed={1.5}
          roughness={0}
          metalness={0.5}
        />
      </Sphere>
      
      {/* Orbiting spheres */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2
        const radius = 2.5
        return (
          <Sphere
            key={i}
            args={[0.3, 32, 32]}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 1,
              Math.sin(angle) * radius,
            ]}
          >
            <meshStandardMaterial
              color="#6366f1"
              opacity={0.6}
              transparent
              emissive="#3b82f6"
              emissiveIntensity={0.3}
            />
          </Sphere>
        )
      })}

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.05, 16, 16]}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
          ]}
        >
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={1}
          />
        </Sphere>
      ))}

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.5}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.2}
      />
    </>
  )
}

function StatCard({ stat, index }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)

  const iconMap = {
    PROJECT: <Briefcase className="w-6 h-6" />,
    EXPERIENCE: <Award className="w-6 h-6" />,
    TECH: <Code className="w-6 h-6" />,
    CLIENTS: <Users className="w-6 h-6" />,
  }

  return (
    <motion.div
      ref={cardRef}
      variants={scaleIn(0.1 * index, 0.9)}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative p-6 rounded-xl border border-border bg-card',
        'hover:border-primary transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/20',
        'backdrop-blur-sm'
      )}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'p-3 rounded-lg bg-primary/10 text-primary',
          'transition-transform duration-300',
          isHovered && 'rotate-12 scale-110'
        )}>
          {iconMap[stat.icon] || <Code className="w-6 h-6" />}
        </div>
      </div>
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1 }}
        className="mb-2"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">
          {stat.value}
        </h3>
        <p className="text-sm md:text-base text-foreground/70 font-medium">
          {stat.label}
        </p>
      </motion.div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"
        />
      )}
    </motion.div>
  )
}

function HighlightCard({ highlight, index }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={cardRef}
      variants={fadeIn('up', 0.2 + index * 0.1)}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      className={cn(
        'p-4 rounded-lg border border-border bg-card/50',
        'hover:border-primary/50 hover:bg-card transition-all duration-300',
        'hover:shadow-md backdrop-blur-sm'
      )}
      whileHover={{ scale: 1.02, x: 5 }}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{highlight.icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-base mb-1">{highlight.title}</h4>
          <p className="text-sm text-foreground/70">{highlight.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 50, stiffness: 100 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 2
      const y = (e.clientY / innerHeight - 0.5) * 2
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen py-20 md:py-32 flex items-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_70%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            About <span className="text-primary">Me</span>
          </motion.h2>
          <motion.p
            variants={fadeIn('up', 0.3)}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto"
          >
            Get to know more about my journey, skills, and passion for development
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16"
        >
          {/* Left Side - Bio Content */}
          <motion.div
            variants={fadeIn('right', 0.2)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {aboutData.bio.map((paragraph, index) => (
                <motion.p
                  key={index}
                  variants={fadeIn('up', 0.2 + index * 0.1)}
                  className="text-base md:text-lg text-foreground/70 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Info Cards */}
            <motion.div
              variants={fadeIn('up', 0.4)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
            >
              <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground/60 font-medium">Location</span>
                </div>
                <p className="text-base font-semibold">{aboutData.location}</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-foreground/60 font-medium">Status</span>
                </div>
                <p className="text-base font-semibold">
                  {aboutData.available ? 'Available for Work' : 'Not Available'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground/60 font-medium">Experience</span>
                </div>
                <p className="text-base font-semibold">{aboutData.experience}</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground/60 font-medium">Education</span>
                </div>
                <p className="text-base font-semibold">{aboutData.education}</p>
              </div>
            </motion.div>

            {/* Languages */}
            {aboutData.languages && (
              <motion.div
                variants={fadeIn('up', 0.5)}
                className="mt-6"
              >
                <h4 className="text-sm font-semibold text-foreground/60 mb-3">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {aboutData.languages.map((lang, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                    >
                      {lang}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Side - 3D Scene */}
          <motion.div
            variants={fadeIn('left', 0.3)}
            className="h-[400px] md:h-[500px] lg:h-[600px] relative"
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} color="#6366f1" intensity={0.5} />
                  <Enhanced3DScene />
                </Canvas>
              </Suspense>
            </motion.div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="mb-16"
        >
          <motion.h3
            variants={fadeIn('up', 0.2)}
            className="text-2xl md:text-3xl font-bold text-center mb-8"
          >
            Key <span className="text-primary">Achievements</span>
          </motion.h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {aboutData.stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Highlights Section */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          <motion.h3
            variants={fadeIn('up', 0.2)}
            className="text-2xl md:text-3xl font-bold text-center mb-8"
          >
            What I <span className="text-primary">Do Best</span>
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aboutData.highlights.map((highlight, index) => (
              <HighlightCard key={index} highlight={highlight} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

