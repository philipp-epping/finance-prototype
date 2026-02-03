import React from 'react'
import { Link } from 'react-router-dom'
import { 
  PanelLeftClose, 
  PanelLeft,
  ArrowLeft,
  User,
  Building2
} from 'lucide-react'
import Tooltip from './ui/Tooltip'

const ClientPortalSidebar = ({ 
  selectedView, 
  onViewChange, 
  isCollapsed = false, 
  onToggleNav
}) => {
  // Collapsed sidebar view
  if (isCollapsed) {
    return (
      <aside className="w-14 bg-[#FAFAFA] border-r border-[#E8E8E8] flex flex-col flex-shrink-0 transition-all duration-200">
        {/* Header */}
        <div className="p-2 flex flex-col items-center gap-2">
          <Tooltip content="Back to Explorations" position="right">
            <Link
              to="/"
              className="w-8 h-8 flex items-center justify-center rounded-sm text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565] transition-colors duration-[120ms]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Tooltip>
          <div className="w-8 h-8 bg-[#18181A] rounded-sm flex items-center justify-center">
            <span className="text-12 font-semibold text-white">C</span>
          </div>
          <Tooltip content="Expand sidebar" shortcut="⌘B" position="right">
            <button
              onClick={onToggleNav}
              className="w-8 h-8 flex items-center justify-center rounded-sm text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565] transition-colors duration-[120ms]"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center py-2 space-y-1">
          <Tooltip content="Client View" position="right">
            <button
              onClick={() => onViewChange('client')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-[120ms] ${
                selectedView === 'client'
                  ? 'bg-[#F0F0F0] text-[#18181A]'
                  : 'text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565]'
              }`}
            >
              <User className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Agency View" position="right">
            <button
              onClick={() => onViewChange('agency')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-[120ms] ${
                selectedView === 'agency'
                  ? 'bg-[#F0F0F0] text-[#18181A]'
                  : 'text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565]'
              }`}
            >
              <Building2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </nav>
      </aside>
    )
  }

  // Expanded sidebar view
  return (
    <aside className="w-[272px] bg-[#FAFAFA] border-r border-[#E8E8E8] flex flex-col flex-shrink-0 transition-all duration-200">
      {/* Back Link */}
      <div className="px-4 pt-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-[#656565] hover:text-[#18181A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explorations
        </Link>
      </div>
      
      {/* Header */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 bg-[#18181A] rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-12 font-semibold text-white">C</span>
            </div>
            <span className="text-14 font-medium text-[#18181A] truncate">Client Portal</span>
          </div>
          <Tooltip content="Collapse sidebar" shortcut="⌘B" position="bottom">
            <button
              onClick={onToggleNav}
              className="w-6 h-6 flex items-center justify-center rounded-sm text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565] transition-colors duration-[120ms]"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <button
          onClick={() => onViewChange('client')}
          className={`w-full h-9 px-3 rounded-lg flex items-center gap-2.5 text-14 transition-colors duration-[120ms] ${
            selectedView === 'client'
              ? 'bg-[#F0F0F0] text-[#18181A] font-medium'
              : 'text-[#3D3D3F] hover:bg-[#F0F0F0]'
          }`}
        >
          <User className="w-4 h-4" />
          Client View
        </button>
        
        <button
          onClick={() => onViewChange('agency')}
          className={`w-full h-9 px-3 rounded-lg flex items-center gap-2.5 text-14 transition-colors duration-[120ms] mt-0.5 ${
            selectedView === 'agency'
              ? 'bg-[#F0F0F0] text-[#18181A] font-medium'
              : 'text-[#3D3D3F] hover:bg-[#F0F0F0]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Agency View
        </button>
      </nav>
    </aside>
  )
}

export default ClientPortalSidebar
