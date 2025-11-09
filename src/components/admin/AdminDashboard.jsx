import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderKanban, 
  Code2, 
  Link as LinkIcon, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut,
  ExternalLink,
  Eye,
  CheckCircle,
  Search,
  BarChart3,
  Settings,
  X,
  Mail
} from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useAuth } from '../../context/AuthContext'
import ProjectForm from './ProjectForm'
import SkillForm from './SkillForm'
import SocialForm from './SocialForm'
import ContactInfoForm from './ContactInfoForm'
import Statistics from './Statistics'
import SettingsComponent from './Settings'
import { cn } from '../../utils/cn'
import { fadeIn } from '../../utils/motion'

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'socials', label: 'Social Links', icon: LinkIcon },
  { id: 'contact', label: 'Contact Info', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    projects,
    skills,
    socials,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addSocial,
    updateSocial,
    deleteSocial,
  } = usePortfolio()

  const { logout } = useAuth()

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleSaveProject = (data) => {
    if (editingItem) {
      updateProject(editingItem.id, data)
      showSuccess('Project updated successfully!')
    } else {
      addProject(data)
      showSuccess('Project added successfully!')
    }
    setShowForm(false)
    setEditingItem(null)
  }

  const handleSaveSkill = (data) => {
    if (editingItem) {
      updateSkill(editingItem.id, data)
      showSuccess('Skill updated successfully!')
    } else {
      addSkill(data)
      showSuccess('Skill added successfully!')
    }
    setShowForm(false)
    setEditingItem(null)
  }

  const handleSaveSocial = (data) => {
    if (editingItem) {
      updateSocial(editingItem.id, data)
      showSuccess('Social link updated successfully!')
    } else {
      addSocial(data)
      showSuccess('Social link added successfully!')
    }
    setShowForm(false)
    setEditingItem(null)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'project') {
        deleteProject(id)
        showSuccess('Project deleted successfully!')
      } else if (type === 'skill') {
        deleteSkill(id)
        showSuccess('Skill deleted successfully!')
      } else if (type === 'social') {
        deleteSocial(id)
        showSuccess('Social link deleted successfully!')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      window.location.href = '/admin/login'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent/10 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                View Portfolio
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent/10 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 shadow-lg">
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setShowForm(false)
                  setEditingItem(null)
                  setSearchQuery('')
                }}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 font-medium transition-colors relative',
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-foreground/60 hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Search Bar - Only for list views */}
          {!showForm && activeTab !== 'overview' && activeTab !== 'settings' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-10 py-3 rounded-lg border',
                  'bg-background/50 border-border focus:ring-2 focus:ring-primary',
                  'focus:outline-none focus:border-transparent',
                  'text-foreground placeholder:text-foreground/40'
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Add Button */}
          {!showForm && activeTab !== 'overview' && activeTab !== 'settings' && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setEditingItem(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New {activeTab === 'projects' ? 'Project' : activeTab === 'skills' ? 'Skill' : 'Social Link'}
            </motion.button>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && <Statistics />}

          {/* Settings Tab */}
          {activeTab === 'contact' && <ContactInfoForm />}
          {activeTab === 'settings' && (
            <SettingsComponent onShowSuccess={showSuccess} />
          )}

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {activeTab === 'projects' && (
                  <ProjectForm
                    project={editingItem}
                    onSave={handleSaveProject}
                    onCancel={handleCancel}
                  />
                )}
                {activeTab === 'skills' && (
                  <SkillForm
                    skill={editingItem}
                    onSave={handleSaveSkill}
                    onCancel={handleCancel}
                  />
                )}
                {activeTab === 'socials' && (
                  <SocialForm
                    social={editingItem}
                    onSave={handleSaveSocial}
                    onCancel={handleCancel}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          {!showForm && activeTab !== 'overview' && activeTab !== 'settings' && (
            <motion.div
              variants={fadeIn('up', 0.2)}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {activeTab === 'projects' && (
                <div className="grid gap-4">
                  {(() => {
                    const filteredProjects = searchQuery
                      ? projects.filter(p =>
                          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
                        )
                      : projects

                    return filteredProjects.length === 0 ? (
                      <div className="text-center py-12 text-foreground/60">
                        {searchQuery
                          ? 'No projects found matching your search.'
                          : 'No projects yet. Click "Add New Project" to get started.'}
                      </div>
                    ) : (
                      filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          {project.image && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{project.title}</h3>
                              {project.featured && (
                                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-foreground/70 mb-3 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.technologies?.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-4 text-sm">
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-primary hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  GitHub
                                </a>
                              )}
                              {project.demo && (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-primary hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Demo
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="p-2 rounded-lg border border-border hover:bg-accent/10 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('project', project.id)}
                              className="p-2 rounded-lg border border-border hover:bg-red-500/10 hover:border-red-500 transition-colors text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      ))
                    )
                  })()}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="grid gap-4">
                  {(() => {
                    const filteredSkills = searchQuery
                      ? skills.filter(s =>
                          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      : skills

                    return filteredSkills.length === 0 ? (
                      <div className="text-center py-12 text-foreground/60">
                        {searchQuery
                          ? 'No skills found matching your search.'
                          : 'No skills yet. Click "Add New Skill" to get started.'}
                      </div>
                    ) : (
                      filteredSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-4xl">{skill.icon}</span>
                            <div>
                              <h3 className="text-xl font-bold">{skill.name}</h3>
                              <p className="text-sm text-foreground/60">
                                {skill.category} • {skill.level}%
                              </p>
                              <div className="mt-2 w-48 h-2 bg-accent/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="p-2 rounded-lg border border-border hover:bg-accent/10 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('skill', skill.id)}
                              className="p-2 rounded-lg border border-border hover:bg-red-500/10 hover:border-red-500 transition-colors text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      ))
                    )
                  })()}
                </div>
              )}

              {activeTab === 'socials' && (
                <div className="grid gap-4">
                  {(() => {
                    const filteredSocials = searchQuery
                      ? socials.filter(s =>
                          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.url.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      : socials

                    return filteredSocials.length === 0 ? (
                      <div className="text-center py-12 text-foreground/60">
                        {searchQuery
                          ? 'No social links found matching your search.'
                          : 'No social links yet. Click "Add New Social Link" to get started.'}
                      </div>
                    ) : (
                      filteredSocials.map((social) => (
                      <div
                        key={social.id}
                        className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{social.name}</h3>
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                            >
                              {social.url}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <p className="text-xs text-foreground/60 mt-1">
                              Icon: {social.icon}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(social)}
                              className="p-2 rounded-lg border border-border hover:bg-accent/10 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('social', social.id)}
                              className="p-2 rounded-lg border border-border hover:bg-red-500/10 hover:border-red-500 transition-colors text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      ))
                    )
                  })()}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

