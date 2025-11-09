import { createContext, useContext, useState, useEffect } from 'react'
import { projects as initialProjects } from '../data/projects'
import { skills as initialSkills } from '../data/skills'
import { socials as initialSocials } from '../data/socials'
import { contactInfo as initialContactInfo } from '../data/contact'
import { loadSharedData, saveSharedData, isAdmin } from '../utils/storage'

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

  // Load data from shared storage (JSONBin.io) or fallback to localStorage/initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from shared storage first
        const sharedData = await loadSharedData()
        
        if (sharedData) {
          // Use shared data if available
          setProjects(sharedData.projects || initialProjects)
          setSkills(sharedData.skills || initialSkills)
          setSocials(sharedData.socials || initialSocials)
          setContactInfo(sharedData.contactInfo || initialContactInfo)
        } else {
          // Fallback to localStorage or initial data
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
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback to initial data on error
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

  // Save to shared storage (JSONBin.io) and localStorage whenever data changes
  // Only save to shared storage if user is admin
  useEffect(() => {
    if (!loading && (projects.length > 0 || skills.length > 0 || socials.length > 0 || contactInfo.length > 0)) {
      const saveData = async () => {
        const data = {
          projects,
          skills,
          socials,
          contactInfo,
        }
        
        // Always save to localStorage as backup
        localStorage.setItem('portfolio_projects', JSON.stringify(projects))
        localStorage.setItem('portfolio_skills', JSON.stringify(skills))
        localStorage.setItem('portfolio_socials', JSON.stringify(socials))
        localStorage.setItem('portfolio_contact_info', JSON.stringify(contactInfo))
        
        // Check if user is admin
        const userIsAdmin = isAdmin()
        console.log('💾 Saving data...', { userIsAdmin, projectsCount: projects.length, skillsCount: skills.length })
        
        // Save to shared storage only if user is admin
        if (userIsAdmin) {
          console.log('👤 Admin detected - saving to shared storage (JSONBin.io)')
          try {
            const saved = await saveSharedData(data)
            if (saved) {
              console.log('✅ Data saved to shared storage - all users will see changes')
            } else {
              console.warn('⚠️ Failed to save to shared storage, using localStorage only')
            }
          } catch (error) {
            console.error('❌ Error saving to shared storage:', error)
          }
        } else {
          console.log('👤 Not admin - data saved to localStorage only (changes visible to this user only)')
        }
      }
      
      // Small delay to avoid saving during initial load
      const timeoutId = setTimeout(saveData, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [projects, skills, socials, contactInfo, loading])

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

