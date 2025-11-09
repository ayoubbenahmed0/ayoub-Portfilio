import { useState, useEffect } from 'react'
import { PortfolioProvider } from './context/PortfolioContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Login from './components/admin/Login'
import AdminDashboard from './components/admin/AdminDashboard'

function MainPortfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [path, setPath] = useState(window.location.pathname || window.location.hash.replace('#', '') || '/')

  useEffect(() => {
    // Check path on mount and when location changes
    const updatePath = () => {
      const currentPath = window.location.pathname || window.location.hash.replace('#', '') || '/'
      setPath(currentPath)
    }
    
    updatePath()
    
    // Listen for navigation events
    window.addEventListener('popstate', updatePath)
    window.addEventListener('hashchange', updatePath)

    return () => {
      window.removeEventListener('popstate', updatePath)
      window.removeEventListener('hashchange', updatePath)
    }
  }, [])

  // Wait for auth to finish loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  // Handle admin routes
  if (path === '/admin/login' || path === '#/admin/login') {
    return <Login />
  }

  if ((path === '/admin' || path === '#/admin') && !isAuthenticated) {
    return <Login />
  }

  if ((path === '/admin' || path === '#/admin') && isAuthenticated) {
    return <AdminDashboard />
  }

  // Default: Show main portfolio
  return <MainPortfolio />
}

function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </AuthProvider>
  )
}

export default App
