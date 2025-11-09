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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  // Helper function to validate array data (returns null if empty or invalid)
  const getValidArray = (data) => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data
    }
    return null
  }

  // Load data from shared storage (JSONBin.io) or fallback to localStorage/initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('📥 Loading portfolio data...')
        console.log('📦 Initial data available:', {
          projects: initialProjects.length,
          skills: initialSkills.length,
          socials: initialSocials.length,
          contactInfo: initialContactInfo.length
        })
        
        // Try to load from shared storage first
        const sharedData = await loadSharedData()
        console.log('🔍 Shared data result:', sharedData)
        
        // Check if sharedData has actual data (not just empty arrays)
        const hasSharedData = sharedData && (
          (sharedData.projects && Array.isArray(sharedData.projects) && sharedData.projects.length > 0) ||
          (sharedData.skills && Array.isArray(sharedData.skills) && sharedData.skills.length > 0) ||
          (sharedData.socials && Array.isArray(sharedData.socials) && sharedData.socials.length > 0) ||
          (sharedData.contactInfo && Array.isArray(sharedData.contactInfo) && sharedData.contactInfo.length > 0)
        )
        
        if (hasSharedData) {
          console.log('✅ Using data from shared storage (JSONBin.io)')
          // Use shared data if available, fallback to initial if empty
          const finalProjects = getValidArray(sharedData.projects) || initialProjects
          const finalSkills = getValidArray(sharedData.skills) || initialSkills
          const finalSocials = getValidArray(sharedData.socials) || initialSocials
          const finalContactInfo = getValidArray(sharedData.contactInfo) || initialContactInfo
          
          setProjects(finalProjects)
          setSkills(finalSkills)
          setSocials(finalSocials)
          setContactInfo(finalContactInfo)
          
          console.log('📊 Data counts:', {
            projects: finalProjects.length,
            skills: finalSkills.length,
            socials: finalSocials.length,
            contactInfo: finalContactInfo.length
          })
        } else {
          console.log('📦 Loading from localStorage or using initial data')
          // Fallback to localStorage or initial data
          const storedProjects = localStorage.getItem('portfolio_projects')
          const storedSkills = localStorage.getItem('portfolio_skills')
          const storedSocials = localStorage.getItem('portfolio_socials')
          const storedContactInfo = localStorage.getItem('portfolio_contact_info')

          // Parse and validate localStorage data
          let parsedProjects = null
          let parsedSkills = null
          let parsedSocials = null
          let parsedContactInfo = null

          try {
            if (storedProjects) {
              parsedProjects = JSON.parse(storedProjects)
              if (!Array.isArray(parsedProjects) || parsedProjects.length === 0) {
                parsedProjects = null
                // Clear invalid data from localStorage
                localStorage.removeItem('portfolio_projects')
              }
            }
            if (storedSkills) {
              parsedSkills = JSON.parse(storedSkills)
              if (!Array.isArray(parsedSkills) || parsedSkills.length === 0) {
                parsedSkills = null
                localStorage.removeItem('portfolio_skills')
              }
            }
            if (storedSocials) {
              parsedSocials = JSON.parse(storedSocials)
              if (!Array.isArray(parsedSocials) || parsedSocials.length === 0) {
                parsedSocials = null
                localStorage.removeItem('portfolio_socials')
              }
            }
            if (storedContactInfo) {
              parsedContactInfo = JSON.parse(storedContactInfo)
              if (!Array.isArray(parsedContactInfo) || parsedContactInfo.length === 0) {
                parsedContactInfo = null
                localStorage.removeItem('portfolio_contact_info')
              }
            }
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError)
            // Clear corrupted data
            localStorage.removeItem('portfolio_projects')
            localStorage.removeItem('portfolio_skills')
            localStorage.removeItem('portfolio_socials')
            localStorage.removeItem('portfolio_contact_info')
          }

          // Use localStorage data if valid, otherwise use initial data
          // Always ensure we have data - never use empty arrays if initial data exists
          let finalProjects = (parsedProjects && parsedProjects.length > 0) ? parsedProjects : initialProjects
          let finalSkills = (parsedSkills && parsedSkills.length > 0) ? parsedSkills : initialSkills
          let finalSocials = (parsedSocials && parsedSocials.length > 0) ? parsedSocials : initialSocials
          let finalContactInfo = (parsedContactInfo && parsedContactInfo.length > 0) ? parsedContactInfo : initialContactInfo
          
          // Double-check: never set empty arrays if we have initial data
          if (finalProjects.length === 0 && initialProjects.length > 0) {
            console.warn('⚠️ Projects array is empty, using initial data')
            finalProjects = initialProjects
          }
          if (finalSkills.length === 0 && initialSkills.length > 0) {
            console.warn('⚠️ Skills array is empty, using initial data')
            finalSkills = initialSkills
          }
          if (finalSocials.length === 0 && initialSocials.length > 0) {
            console.warn('⚠️ Socials array is empty, using initial data')
            finalSocials = initialSocials
          }
          if (finalContactInfo.length === 0 && initialContactInfo.length > 0) {
            console.warn('⚠️ ContactInfo array is empty, using initial data')
            finalContactInfo = initialContactInfo
          }
          
          setProjects(finalProjects)
          setSkills(finalSkills)
          setSocials(finalSocials)
          setContactInfo(finalContactInfo)
          
          console.log('✅ Data loaded and set in state:', {
            projects: finalProjects.length,
            skills: finalSkills.length,
            socials: finalSocials.length,
            contactInfo: finalContactInfo.length,
            source: parsedProjects ? 'localStorage' : 'initial data'
          })
          console.log('📋 Sample data:', {
            firstProject: finalProjects[0]?.title,
            firstSkill: finalSkills[0]?.name,
            firstContact: finalContactInfo[0]?.title
          })
        }
      } catch (error) {
        console.error('❌ Error loading data:', error)
        // Fallback to initial data on error
        console.log('🔄 Using initial data due to error')
        setProjects(initialProjects)
        setSkills(initialSkills)
        setSocials(initialSocials)
        setContactInfo(initialContactInfo)
      } finally {
        setLoading(false)
        setInitialLoadComplete(true)
      }
    }

    loadData()
  }, [])

  // Debug: Log state changes
  useEffect(() => {
    if (!loading) {
      console.log('🔄 State updated:', {
        projects: projects.length,
        skills: skills.length,
        socials: socials.length,
        contactInfo: contactInfo.length,
        initialLoadComplete
      })
    }
  }, [projects, skills, socials, contactInfo, loading, initialLoadComplete])

  // Save to shared storage (JSONBin.io) and localStorage whenever data changes
  // Only save to shared storage if user is admin
  // Don't save during initial load to prevent overwriting with empty arrays
  useEffect(() => {
    if (!initialLoadComplete || loading) {
      return // Skip saving during initial load
    }
    
    if (projects.length > 0 || skills.length > 0 || socials.length > 0 || contactInfo.length > 0) {
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
  }, [projects, skills, socials, contactInfo, initialLoadComplete, loading])

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

