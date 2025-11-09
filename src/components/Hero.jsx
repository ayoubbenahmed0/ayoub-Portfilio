import { useEffect, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion'
import { ChevronDown, Download, Mail, Sparkles } from 'lucide-react'
import { fadeIn, staggerContainer } from '../utils/motion'
import { heroData } from '../data/hero'
import { cn } from '../utils/cn'
import { useRef } from 'react'

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />
      <Stars radius={300} depth={50} count={2000} factor={4} fade speed={1} />
      
      {/* Animated geometric shapes */}
      <mesh position={[-3, 2, 0]} rotation={[0, 0, 0]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#3b82f6" wireframe />
      </mesh>
      <mesh position={[3, -2, 0]} rotation={[0, 0, 0]}>
        <tetrahedronGeometry args={[0.6]} />
        <meshStandardMaterial color="#6366f1" wireframe />
      </mesh>
      
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}

function FloatingOrbs() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.1, 32, 32]}
          position={[
            Math.sin(i) * 3,
            Math.cos(i) * 2,
            (Math.random() - 0.5) * 3,
          ]}
        >
          <MeshDistortMaterial
            color="#3b82f6"
            distort={0.3}
            speed={2}
            roughness={0}
            opacity={0.6}
            transparent
          />
        </Sphere>
      ))}
    </>
  )
}

export default function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const photoRef = useRef(null)
  const isPhotoInView = useInView(photoRef, { once: true, margin: '-100px' })
  const [imageError, setImageError] = useState(false)

  const springConfig = { damping: 50, stiffness: 100 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10])

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

  const scrollToAbout = () => {
    const element = document.querySelector('#about')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate="show"
            className="space-y-6 lg:text-left text-center"
          >
            <motion.div
              variants={fadeIn('up', 0.2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/70">
                {heroData.greeting}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn('up', 0.3)}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {heroData.name.split(' ')[0]}
              </span>
              <span className="block bg-gradient-to-r from-primary/80 via-primary to-primary/60 bg-clip-text text-transparent">
                {heroData.name.split(' ')[1]}
              </span>
            </motion.h1>

            <motion.div
              variants={fadeIn('up', 0.4)}
              className="space-y-2"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl text-foreground/80 font-semibold">
                {heroData.title}
              </p>
              <p className="text-lg sm:text-xl text-foreground/60 font-medium">
                {heroData.subtitle}
              </p>
            </motion.div>

            <motion.p
              variants={fadeIn('up', 0.5)}
              className="text-base sm:text-lg text-foreground/70 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {heroData.description}
            </motion.p>

            <motion.div
              variants={fadeIn('up', 0.6)}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <motion.a
                href={heroData.cta.primary.href}
                onClick={(e) => handleNavClick(e, heroData.cta.primary.href)}
                className={cn(
                  'px-8 py-4 rounded-lg bg-primary text-primary-foreground',
                  'font-semibold hover:bg-primary/90 transition-all',
                  'flex items-center justify-center gap-2',
                  'shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40',
                  'relative overflow-hidden group'
                )}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Mail className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{heroData.cta.primary.text}</span>
              </motion.a>

              <motion.a
                href={heroData.cta.secondary.href}
                onClick={(e) => handleNavClick(e, heroData.cta.secondary.href)}
                className={cn(
                  'px-8 py-4 rounded-lg border-2 border-primary text-primary',
                  'font-semibold hover:bg-primary/10 transition-all',
                  'flex items-center justify-center gap-2',
                  'backdrop-blur-sm bg-background/50'
                )}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                {heroData.cta.secondary.text}
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Side - Photo with 3D Effects */}
          <motion.div
            ref={photoRef}
            variants={fadeIn('left', 0.4)}
            initial="hidden"
            animate={isPhotoInView ? 'show' : 'hidden'}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full blur-3xl animate-pulse" />
              
              {/* 3D Canvas Background for Photo */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Suspense fallback={null}>
                  <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <FloatingOrbs />
                  </Canvas>
                </Suspense>
              </div>

              {/* Photo Container */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="relative z-10 w-full h-full"
              >
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20">
                  {/* Decorative Border */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
                  
                  {!imageError ? (
                    <img
                      src={heroData.photo}
                      alt={heroData.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                      <div className="text-center space-y-2">
                        <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary">
                            {heroData.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/60">
                          Photo placeholder
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Badge */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full bg-card border-2 border-primary/30 shadow-lg backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-foreground">Available for work</span>
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/10 blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-primary/10 blur-xl" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
        onClick={scrollToAbout}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-foreground/50 font-medium uppercase tracking-wider">
            Scroll
          </span>
          <ChevronDown className="w-6 h-6 text-foreground/50" />
        </div>
      </motion.div>
    </section>
  )
}

