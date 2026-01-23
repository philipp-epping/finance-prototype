import React from 'react'
import { X } from 'lucide-react'

const FilterPill = ({ 
  label, 
  values = [], 
  onRemove, 
  onClick,
  isCollapsed = false // When true, this is the "+N more" pill
}) => {
  // Format display text
  const getDisplayText = () => {
    if (isCollapsed) {
      return label // e.g., "+2 more"
    }
    if (values.length === 0) {
      return label
    }
    if (values.length === 1) {
      return `${label}: ${values[0]}`
    }
    return `${label}: ${values[0]} +${values.length - 1}`
  }
  
  // Get tooltip text showing all values
  const getTooltipText = () => {
    if (isCollapsed || values.length <= 1) {
      return undefined // No tooltip needed
    }
    return `${label}: ${values.join(', ')}`
  }

  return (
    <div 
      className={`h-7 px-2.5 flex items-center gap-1.5 rounded-md border transition-colors ${
        isCollapsed 
          ? 'border-[#E8E8E8] bg-[#F0F0F0] text-[#656565] hover:bg-[#E8E8E8] cursor-pointer'
          : 'border-[#DFE9FF] bg-[#F7F9FF] text-[#4D5FFF] hover:bg-[#EDF2FF] cursor-pointer'
      }`}
      onClick={onClick}
      title={getTooltipText()}
    >
      <span className="text-12 font-medium whitespace-nowrap">
        {getDisplayText()}
      </span>
      {!isCollapsed && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="p-0.5 hover:bg-[#EDF2FF] rounded transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

export default FilterPill
