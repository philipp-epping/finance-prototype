import React from 'react'

const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`border-b border-[#E8E8E8] ${className}`}>
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative h-9 flex items-center gap-2 text-13 font-medium transition-colors duration-[120ms] ${
              activeTab === tab.id 
                ? 'text-[#18181A]' 
                : 'text-[#656565] hover:text-[#18181A]'
            }`}
          >
            {tab.label}
            {/* Count pill with 6px border radius from Figma */}
            {(tab.count !== undefined || tab.badge !== undefined) && (
              <span className={`px-1.5 py-0.5 rounded-sm text-12 font-medium ${
                activeTab === tab.id 
                  ? 'bg-[#F0F0F0] text-[#18181A]' 
                  : 'bg-[#F0F0F0] text-[#656565]'
              }`}>
                {tab.count ?? tab.badge}
              </span>
            )}
            {/* Active indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8E8E8]" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Tabs
