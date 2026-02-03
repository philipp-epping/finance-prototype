import React, { useState, useEffect } from 'react'
import ClientPortalSidebar from '../components/ClientPortalSidebar'

function ClientPortal() {
  const [selectedView, setSelectedView] = useState('client')
  const [isNavVisible, setIsNavVisible] = useState(true)

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

  const renderContent = () => {
    switch (selectedView) {
      case 'client':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-[#18181A] mb-2">Client View</h1>
              <p className="text-[#8D8D8D]">This view is ready for development.</p>
            </div>
          </div>
        )
      case 'agency':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-[#18181A] mb-2">Agency View</h1>
              <p className="text-[#8D8D8D]">This view is ready for development.</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-[#F9F9F9]">
      <ClientPortalSidebar 
        selectedView={selectedView}
        onViewChange={setSelectedView}
        isCollapsed={!isNavVisible}
        onToggleNav={() => setIsNavVisible(!isNavVisible)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {renderContent()}
      </main>
    </div>
  )
}

export default ClientPortal
