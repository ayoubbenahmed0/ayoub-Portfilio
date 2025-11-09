import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import { fadeIn, staggerContainer } from '../utils/motion'
import { cn } from '../utils/cn'

function ProjectCard({ project }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={cardRef}
      variants={fadeIn('up', 0.2)}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border',
        'bg-card hover:border-primary/50 transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/10'
      )}
      whileHover={{ y: -4 }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className={cn(
                'px-3 py-1 text-xs rounded-full font-medium',
                'bg-primary/10 text-primary border border-primary/20'
              )}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-3 py-1 text-xs text-foreground/50">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
              'bg-accent/10 hover:bg-accent/20 border border-border',
              'text-sm font-medium transition-colors'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-4 h-4" />
            <span>Code</span>
          </motion.a>
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'text-sm font-medium transition-colors'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Demo</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { projects, loading } = usePortfolio()

  if (loading) {
    return <div className="min-h-screen py-20 flex items-center justify-center">Loading...</div>
  }

  return (
    <section
      id="projects"
      ref={ref}
      className="min-h-screen py-20 md:py-32 bg-gradient-to-b from-background/50 to-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            My <span className="text-primary">Projects</span>
          </h2>
          <p className="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto">
            A collection of my recent work and projects
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

