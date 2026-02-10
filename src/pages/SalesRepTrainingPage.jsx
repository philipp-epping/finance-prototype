import React, { useState, useEffect } from 'react'
import { Link, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { ArrowLeft, PanelLeft, PanelLeftClose, Headphones, BookOpen, Users, Target } from 'lucide-react'
import ListeningWorkflow from '../components/sales-training/ListeningWorkflow'

// Sidebar navigation items
const navItems = [
  {
    id: 'listening',
    title: 'Listening Workflow',
    description: 'Learn to identify key moments in conversations',
    path: 'listening',
    icon: Headphones,
    available: true
  },
  {
    id: 'discovery',
    title: 'Discovery Questions',
    description: 'Master the art of asking the right questions',
    path: 'discovery',
    icon: BookOpen,
    available: false
  },
  {
    id: 'objections',
    title: 'Handling Objections',
    description: 'Turn objections into opportunities',
    path: 'objections',
    icon: Target,
    available: false
  },
  {
    id: 'roleplay',
    title: 'Role-play Scenarios',
    description: 'Practice with realistic simulations',
    path: 'roleplay',
    icon: Users,
    available: false
  }
]

// Empty state for the main content when no item is selected
const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-6">
        <Headphones className="w-8 h-8 text-accent-800" />
      </div>
      <h1 className="text-xl font-semibold text-grey-1000 mb-3">
        Sales Rep Training and Onboarding
      </h1>
      <p className="text-grey-700 mb-6">
        Build the fundamental skills that top sales reps use to close deals. 
        Start with the Listening Workflow to learn how to identify key buying signals.
      </p>
      <Link
        to="listening"
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent-800 hover:bg-accent-900 text-white rounded-lg text-14 font-medium transition-colors"
      >
        <Headphones className="w-4 h-4" />
        Start Listening Workflow
      </Link>
    </div>
  </div>
)

// Coming soon placeholder for unavailable modules
const ComingSoon = ({ title }) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-18 font-semibold text-grey-1000 mb-2">{title}</h2>
      <p className="text-grey-700">This module is coming soon.</p>
    </div>
  </div>
)

function SalesRepTrainingPage() {
  const [isNavVisible, setIsNavVisible] = useState(true)
  const location = useLocation()

  // Keyboard shortcut to toggle sidebar (Cmd+B)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setIsNavVisible(prev => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen bg-grey-100">
      {/* Sidebar */}
      {isNavVisible && (
        <aside className="w-[280px] bg-grey-50 border-r border-grey-300 flex flex-col">
          {/* Header */}
          <div className="px-4 py-4 border-b border-grey-300">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-13 text-grey-800 hover:text-grey-1000 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Explorations
            </Link>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 px-3 py-4 overflow-auto">
            <h2 className="px-2 text-11 font-semibold text-grey-700 uppercase tracking-wide mb-3">
              Training Modules
            </h2>
            
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname.includes(item.path)
                
                if (!item.available) {
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <div className="w-8 h-8 rounded-lg bg-grey-200 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-grey-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-13 font-medium text-grey-600 truncate">
                            {item.title}
                          </p>
                          <span className="text-10 px-1.5 py-0.5 bg-grey-200 text-grey-600 rounded uppercase tracking-wide">
                            Soon
                          </span>
                        </div>
                        <p className="text-12 text-grey-500 truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                }
                
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-accent-100 text-accent-1000' 
                        : 'hover:bg-grey-200 text-grey-900'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-accent-800' : 'bg-grey-200'
                        }`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-grey-700'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-13 font-medium truncate ${
                            isActive ? 'text-accent-1000' : 'text-grey-1000'
                          }`}>
                            {item.title}
                          </p>
                          <p className={`text-12 truncate mt-0.5 ${
                            isActive ? 'text-accent-800' : 'text-grey-700'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>
          
          {/* Toggle button */}
          <div className="px-4 py-3 border-t border-grey-300">
            <button
              onClick={() => setIsNavVisible(false)}
              className="flex items-center gap-2 text-12 text-grey-700 hover:text-grey-1000 transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
              <span>Hide sidebar</span>
              <span className="ml-auto text-11 text-grey-500">⌘B</span>
            </button>
          </div>
        </aside>
      )}
      
      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Show sidebar button when hidden */}
        {!isNavVisible && (
          <button
            onClick={() => setIsNavVisible(true)}
            className="absolute top-4 left-4 p-2 bg-white border border-grey-300 rounded-lg shadow-xs hover:bg-grey-50 transition-colors z-10"
            title="Show sidebar (⌘B)"
          >
            <PanelLeft className="w-4 h-4 text-grey-700" />
          </button>
        )}
        
        {/* Route content */}
        <Routes>
          <Route index element={<EmptyState />} />
          <Route path="listening" element={<ListeningWorkflow exerciseId="exercise-1" />} />
          <Route path="discovery" element={<ComingSoon title="Discovery Questions" />} />
          <Route path="objections" element={<ComingSoon title="Handling Objections" />} />
          <Route path="roleplay" element={<ComingSoon title="Role-play Scenarios" />} />
        </Routes>
      </main>
    </div>
  )
}

export default SalesRepTrainingPage
