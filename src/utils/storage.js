

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3'

// Hardcoded JSONBin credentials (fallback if environment variables are not set)
const JSONBIN_MASTER_KEY = '$2a$10$h0TqXfKJUFANLz/8duPtGuynSMlrYSuaBO9AVfcT3dkiRge1HGTPy'
const JSONBIN_BIN_ID = '69106b3bd0ea881f40dd4ef0'

// Get API key from environment variable or use hardcoded value
// Get your API key from https://jsonbin.io/ (free account)
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY || JSONBIN_MASTER_KEY

// Get Bin ID from environment variable, localStorage, or hardcode here
// If not set, it will be created automatically on first save
const getBinId = () => {
  // Try environment variable first
  if (import.meta.env.VITE_JSONBIN_BIN_ID) {
    return import.meta.env.VITE_JSONBIN_BIN_ID
  }
  // Try hardcoded value
  if (JSONBIN_BIN_ID) {
    return JSONBIN_BIN_ID
  }
  // Try localStorage (stored after first bin creation)
  const storedBinId = localStorage.getItem('portfolio_jsonbin_id')
  if (storedBinId) {
    return storedBinId
  }
  // Return empty if not configured (will be created on first save)
  return ''
}

// Check if JSONBin.io is configured (at least API key)
const isConfigured = () => {
  return !!API_KEY
}

/**
 * Load portfolio data from JSONBin.io
 * Public bins can be read without API key
 */
export const loadSharedData = async () => {
  try {
    const binId = getBinId()
    
    // If no bin ID, return null (bin will be created on first save)
    if (!binId) {
      console.log('JSONBin ID not configured, will be created on first save')
      return null
    }

    // For public bins, we can read without API key
    // But if API key is available, use it for better reliability
    const headers = {}
    if (API_KEY) {
      headers['X-Master-Key'] = API_KEY
    }

    const response = await fetch(`${JSONBIN_API_URL}/b/${binId}/latest`, {
      headers,
    })

    if (!response.ok) {
      // If bin doesn't exist (404), return null to use initial data
      if (response.status === 404) {
        console.log('JSONBin not found yet, will be created on first save')
        return null
      }
      // For other errors, log and fallback
      console.error(`Failed to load data: ${response.status} ${response.statusText}`)
      const errorText = await response.text().catch(() => '')
      console.error('Error details:', errorText)
      return loadFromLocalStorage()
    }

    const data = await response.json()
    console.log('✅ Data loaded from JSONBin successfully')
    return data.record || null
  } catch (error) {
    console.error('Error loading shared data:', error)
    // Fallback to localStorage on error
    return loadFromLocalStorage()
  }
}

/**
 * Save portfolio data to JSONBin.io
 * Creates the bin if it doesn't exist
 */
export const saveSharedData = async (data) => {
  try {
    // If not configured (no API key), fallback to localStorage
    if (!isConfigured()) {
      console.log('JSONBin API key not configured, using localStorage only')
      saveToLocalStorage(data)
      return false
    }

    let binId = getBinId()
    let response

    // If no bin ID exists, create a new bin
    if (!binId) {
      console.log('Creating new JSONBin...')
      response = await fetch(`${JSONBIN_API_URL}/b`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
          'X-Bin-Name': 'Portfolio Data',
          'X-Bin-Private': 'false', // Make it public
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to create bin: ${response.statusText}`)
      }

      const createdData = await response.json()
      binId = createdData.metadata.id
      
      // Store bin ID in localStorage for future use
      localStorage.setItem('portfolio_jsonbin_id', binId)
      
      console.log('✅ Created new JSONBin with ID:', binId)
      console.log('📝 Add this to Netlify environment variables:')
      console.log('   VITE_JSONBIN_BIN_ID=' + binId)
    } else {
      // Try to update existing bin
      response = await fetch(`${JSONBIN_API_URL}/b/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(data),
      })

      // If bin doesn't exist (404), create it
      if (response.status === 404) {
        console.log('Bin not found, creating new bin...')
        response = await fetch(`${JSONBIN_API_URL}/b`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY,
            'X-Bin-Name': 'Portfolio Data',
            'X-Bin-Private': 'false', // Make it public
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error(`Failed to create bin: ${response.statusText}`)
        }

        const createdData = await response.json()
        const newBinId = createdData.metadata.id
        localStorage.setItem('portfolio_jsonbin_id', newBinId)
        console.log('✅ Created new JSONBin with ID:', newBinId)
        console.log('📝 Add this to Netlify environment variables:')
        console.log('   VITE_JSONBIN_BIN_ID=' + newBinId)
      } else if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        console.error(`❌ Failed to save data: ${response.status} ${response.statusText}`)
        console.error('Error details:', errorText)
        throw new Error(`Failed to save data: ${response.status} ${response.statusText} - ${errorText}`)
      } else {
        console.log('✅ JSONBin updated successfully')
      }
    }

    // Also save to localStorage as backup
    saveToLocalStorage(data)
    console.log('✅ Data saved to shared storage successfully')
    return true
  } catch (error) {
    console.error('❌ Error saving shared data:', error)
    console.error('Error stack:', error.stack)
    // Fallback to localStorage on error
    saveToLocalStorage(data)
    return false
  }
}

/**
 * Create a new bin on JSONBin.io (first time setup)
 * This is called automatically if the bin doesn't exist
 */
export const createBin = async (initialData) => {
  try {
    if (!API_KEY) {
      console.warn('JSONBin API key not configured')
      return null
    }

    const response = await fetch(`${JSONBIN_API_URL}/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
        'X-Bin-Name': 'Portfolio Data',
        'X-Bin-Private': 'false', // Make it public so all users can read
      },
      body: JSON.stringify(initialData),
    })

    if (!response.ok) {
      throw new Error(`Failed to create bin: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Created JSONBin with ID:', data.metadata.id)
    return data.metadata.id
  } catch (error) {
    console.error('Error creating bin:', error)
    return null
  }
}

/**
 * Fallback: Load from localStorage
 */
const loadFromLocalStorage = () => {
  try {
    const projects = localStorage.getItem('portfolio_projects')
    const skills = localStorage.getItem('portfolio_skills')
    const socials = localStorage.getItem('portfolio_socials')
    const contactInfo = localStorage.getItem('portfolio_contact_info')

    if (!projects && !skills && !socials && !contactInfo) {
      return null
    }

    return {
      projects: projects ? JSON.parse(projects) : null,
      skills: skills ? JSON.parse(skills) : null,
      socials: socials ? JSON.parse(socials) : null,
      contactInfo: contactInfo ? JSON.parse(contactInfo) : null,
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return null
  }
}

/**
 * Fallback: Save to localStorage
 */
const saveToLocalStorage = (data) => {
  try {
    if (data.projects) {
      localStorage.setItem('portfolio_projects', JSON.stringify(data.projects))
    }
    if (data.skills) {
      localStorage.setItem('portfolio_skills', JSON.stringify(data.skills))
    }
    if (data.socials) {
      localStorage.setItem('portfolio_socials', JSON.stringify(data.socials))
    }
    if (data.contactInfo) {
      localStorage.setItem('portfolio_contact_info', JSON.stringify(data.contactInfo))
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * Check if user is admin (for saving to shared storage)
 */
export const isAdmin = () => {
  // Check if user is authenticated as admin
  const authToken = localStorage.getItem('portfolio_admin_token')
  const authExpiry = localStorage.getItem('portfolio_admin_expiry')
  
  if (authToken && authExpiry) {
    const now = new Date().getTime()
    return now < parseInt(authExpiry)
  }
  
  return false
}
