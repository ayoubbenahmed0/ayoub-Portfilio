import { createContext, useContext, useState, useEffect } from 'react'
import { projects as initialProjects } from '../data/projects'
import { skills as initialSkills } from '../data/skills'
import { socials as initialSocials } from '../data/socials'
import { contactInfo as initialContactInfo } from '../data/contact'

const PortfolioContext = createContext()

export const usePortfolio = () => {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider')
  }
  return context
}

export const PortfolioProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [socials, setSocials] = useState([])
  const [contactInfo, setContactInfo] = useState([])
  const [loading, setLoading] = useState(true)

  // Load data from localStorage or use initial data
  useEffect(() => {
    const loadData = () => {
      try {
        const storedProjects = localStorage.getItem('portfolio_projects')
        const storedSkills = localStorage.getItem('portfolio_skills')
        const storedSocials = localStorage.getItem('portfolio_socials')
        const storedContactInfo = localStorage.getItem('portfolio_contact_info')

        setProjects(
          storedProjects ? JSON.parse(storedProjects) : initialProjects
        )
        setSkills(storedSkills ? JSON.parse(storedSkills) : initialSkills)
        setSocials(storedSocials ? JSON.parse(storedSocials) : initialSocials)
        setContactInfo(
          storedContactInfo ? JSON.parse(storedContactInfo) : initialContactInfo
        )
      } catch (error) {
        console.error('Error loading data:', error)
        setProjects(initialProjects)
        setSkills(initialSkills)
        setSocials(initialSocials)
        setContactInfo(initialContactInfo)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('portfolio_projects', JSON.stringify(projects))
    }
  }, [projects, loading])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('portfolio_skills', JSON.stringify(skills))
    }
  }, [skills, loading])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('portfolio_socials', JSON.stringify(socials))
    }
  }, [socials, loading])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('portfolio_contact_info', JSON.stringify(contactInfo))
    }
  }, [contactInfo, loading])

  // Projects CRUD
  const addProject = (project) => {
    const newProject = {
      ...project,
      id: `project-${Date.now()}`,
      featured: project.featured || false,
    }
    setProjects([...projects, newProject])
  }

  const updateProject = (id, updatedProject) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, ...updatedProject } : project
      )
    )
  }

  const deleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  // Skills CRUD
  const addSkill = (skill) => {
    const newSkill = {
      ...skill,
      id: skill.id || skill.name.toLowerCase().replace(/\s+/g, '-'),
    }
    setSkills([...skills, newSkill])
  }

  const updateSkill = (id, updatedSkill) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, ...updatedSkill } : skill
      )
    )
  }

  const deleteSkill = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  // Socials CRUD
  const updateSocial = (id, updatedSocial) => {
    setSocials(
      socials.map((social) =>
        social.id === id ? { ...social, ...updatedSocial } : social
      )
    )
  }

  const addSocial = (social) => {
    const newSocial = {
      ...social,
      id: social.id || social.name.toLowerCase().replace(/\s+/g, '-'),
    }
    setSocials([...socials, newSocial])
  }

  const deleteSocial = (id) => {
    setSocials(socials.filter((social) => social.id !== id))
  }

  // Contact Info CRUD
  const updateContactInfo = (id, updatedInfo) => {
    setContactInfo(
      contactInfo.map((info) =>
        info.id === id ? { ...info, ...updatedInfo } : info
      )
    )
  }

  const value = {
    projects,
    skills,
    socials,
    contactInfo,
    loading,
    // Projects
    addProject,
    updateProject,
    deleteProject,
    // Skills
    addSkill,
    updateSkill,
    deleteSkill,
    // Socials
    addSocial,
    updateSocial,
    deleteSocial,
    // Contact Info
    updateContactInfo,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

