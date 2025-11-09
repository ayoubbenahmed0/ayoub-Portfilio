import { motion } from 'framer-motion'
import { 
  FolderKanban, 
  Code2, 
  Link as LinkIcon,
  TrendingUp,
  Star,
  BarChart3
} from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { cn } from '../../utils/cn'

export default function Statistics() {
  const { projects, skills, socials } = usePortfolio()

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Featured Projects',
      value: projects.filter(p => p.featured).length,
      icon: Star,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Total Skills',
      value: skills.length,
      icon: Code2,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Social Links',
      value: socials.length,
      icon: LinkIcon,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ]

  const averageSkillLevel = skills.length > 0
    ? Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length)
    : 0

  const skillCategories = [...new Set(skills.map(skill => skill.category))]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'bg-card border border-border rounded-xl p-6',
                'hover:border-primary/50 transition-colors'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-3 rounded-lg', stat.bg)}>
                  <Icon className={cn('w-6 h-6', stat.color)} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-foreground/60">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Skills Overview</h3>
              <p className="text-sm text-foreground/60">Statistics about your skills</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground/70">Average Proficiency</span>
                <span className="font-semibold">{averageSkillLevel}%</span>
              </div>
              <div className="w-full h-2 bg-accent/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${averageSkillLevel}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground/70">Categories</span>
                <span className="font-semibold">{skillCategories.length}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {skillCategories.map((category) => {
                  const categorySkills = skills.filter(s => s.category === category).length
                  return (
                    <span
                      key={category}
                      className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {category} ({categorySkills})
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Projects Overview</h3>
              <p className="text-sm text-foreground/60">Statistics about your projects</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground/70">Featured Projects</span>
                <span className="font-semibold">
                  {projects.filter(p => p.featured).length} / {projects.length}
                </span>
              </div>
              <div className="w-full h-2 bg-accent/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{ 
                    width: `${projects.length > 0 ? (projects.filter(p => p.featured).length / projects.length) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground/70">Projects with GitHub</span>
                <span className="font-semibold">
                  {projects.filter(p => p.github).length}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground/70">Projects with Demo</span>
                <span className="font-semibold">
                  {projects.filter(p => p.demo).length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


