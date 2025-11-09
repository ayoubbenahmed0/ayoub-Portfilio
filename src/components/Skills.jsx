import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles, TrendingUp, Code2 } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import { fadeIn, staggerContainer, scaleIn } from '../utils/motion'
import { cn } from '../utils/cn'

function EnhancedSkillSphere({ selectedCategory, skills }) {
  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory)

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#6366f1" intensity={0.5} />
      
      {/* Central glowing sphere */}
      <Sphere args={[0.8, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#3b82f6"
          distort={0.5}
          speed={2}
          roughness={0}
          metalness={0.8}
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Orbiting skill spheres */}
      {filteredSkills.slice(0, 12).map((skill, index) => {
        const angle = (index / filteredSkills.length) * Math.PI * 2
        const radius = 2 + (skill.level / 100) * 1
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle * 1.5) * 0.8
        const z = Math.sin(angle) * radius
        const size = 0.15 + (skill.level / 100) * 0.1

        return (
          <group key={skill.id} position={[x, y, z]}>
            <Sphere args={[size, 32, 32]}>
              <MeshDistortMaterial
                color="#6366f1"
                distort={0.3}
                speed={1.5}
                roughness={0}
                opacity={0.8}
                transparent
                emissive="#3b82f6"
                emissiveIntensity={0.5}
              />
            </Sphere>
            {/* Glow effect based on skill level */}
            <Sphere args={[size * 1.5, 32, 32]}>
              <meshStandardMaterial
                color="#3b82f6"
                opacity={skill.level / 300}
                transparent
                emissive="#3b82f6"
                emissiveIntensity={skill.level / 200}
              />
            </Sphere>
          </group>
        )
      })}

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.03, 16, 16]}
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
        autoRotateSpeed={1}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 2.5}
      />
    </>
  )
}

function SkillCard({ skill, index }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)

  const getLevelColor = (level) => {
    if (level >= 90) return 'from-green-500 to-emerald-500'
    if (level >= 80) return 'from-blue-500 to-primary'
    if (level >= 70) return 'from-yellow-500 to-orange-500'
    return 'from-gray-400 to-gray-500'
  }

  const getLevelLabel = (level) => {
    if (level >= 90) return 'Expert'
    if (level >= 80) return 'Advanced'
    if (level >= 70) return 'Intermediate'
    return 'Beginner'
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
        'hover:shadow-xl hover:shadow-primary/20',
        'backdrop-blur-sm overflow-hidden group'
      )}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Animated background gradient on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none"
        />
      )}

      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              animate={{ 
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? 10 : 0 
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-4xl"
            >
              {skill.icon}
            </motion.div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-1">{skill.name}</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                  {skill.category}
                </span>
                <span className={cn(
                  'px-2 py-1 text-xs rounded-full font-medium',
                  skill.level >= 90 ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                  skill.level >= 80 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  skill.level >= 70 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                  'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                )}>
                  {getLevelLabel(skill.level)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground/70">Proficiency</span>
            <motion.span
              animate={{ scale: isHovered ? 1.2 : 1 }}
              className={cn(
                'text-lg font-bold',
                skill.level >= 90 ? 'text-green-500' :
                skill.level >= 80 ? 'text-blue-500' :
                skill.level >= 70 ? 'text-yellow-500' :
                'text-gray-500'
              )}
            >
              {skill.level}%
            </motion.span>
          </div>
          
          {/* Enhanced progress bar */}
          <div className="relative w-full h-3 bg-accent/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
              transition={{ 
                duration: 1.5, 
                delay: 0.3 + index * 0.05,
                ease: 'easeOut'
              }}
              className={cn(
                'h-full rounded-full bg-gradient-to-r',
                getLevelColor(skill.level),
                'shadow-lg shadow-primary/30',
                'relative overflow-hidden'
              )}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>

          {/* Experience indicator */}
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <TrendingUp className="w-3 h-3" />
            <span>{getLevelLabel(skill.level)} Level</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm transition-all',
            'border border-border bg-card hover:bg-accent/10',
            selectedCategory === category
              ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
              : 'text-foreground/70 hover:text-foreground'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedCategory, setSelectedCategory] = useState('All')
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { skills, loading } = usePortfolio()

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

  if (loading) {
    return <div className="min-h-screen py-20 flex items-center justify-center">Loading...</div>
  }

  if (!skills || skills.length === 0) {
    return null // Don't show section if no skills
  }

  const categories = ['All', ...new Set(skills.map(skill => skill.category))]
  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory)

  // Calculate stats
  const totalSkills = skills.length
  const averageLevel = Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length)
  const expertSkills = skills.filter(skill => skill.level >= 90).length

  return (
    <section
      id="skills"
      ref={ref}
      className="relative min-h-screen py-20 md:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.05),transparent_70%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            variants={fadeIn('up', 0.2)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4"
          >
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/70">
              Technical Expertise
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            My <span className="text-primary">Skills</span>
          </h2>
          <p className="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>

          {/* Stats Summary */}
          <motion.div
            variants={fadeIn('up', 0.3)}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-primary">{totalSkills}+</div>
              <div className="text-xs text-foreground/60">Technologies</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-primary">{averageLevel}%</div>
              <div className="text-xs text-foreground/60">Average Proficiency</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-primary">{expertSkills}+</div>
              <div className="text-xs text-foreground/60">Expert Level</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          variants={fadeIn('up', 0.4)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Skills Cards */}
          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </motion.div>

          {/* 3D Sphere */}
          <motion.div
            variants={fadeIn('left', 0.3)}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            className="h-[400px] md:h-[500px] lg:h-[600px] relative hidden lg:flex items-center justify-center"
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="w-full h-full"
            >
              <Suspense fallback={null}>
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                  <EnhancedSkillSphere selectedCategory={selectedCategory} skills={skills} />
                </Canvas>
              </Suspense>
            </motion.div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          variants={fadeIn('up', 0.5)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="mt-16 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-border hover:border-primary transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground/70">
              Always learning and improving
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

