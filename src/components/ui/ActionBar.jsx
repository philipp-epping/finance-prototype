import React from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const ActionBar = ({ 
  selectedCount = 0,
  onClear,
  actions = [],
  className = '' 
}) => {
  if (selectedCount === 0) return null

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${className}`}>
      {/* Container with 10px border radius and shadow-md from Figma */}
      <div className="flex items-center gap-3 bg-white rounded-lg shadow-md px-4 py-3 border border-alpha-10">
        {/* Selection count */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="p-1 rounded-sm hover:bg-[#F0F0F0] transition-colors"
          >
            <X className="w-4 h-4 text-[#8D8D8D]" />
          </button>
          <span className="text-13 font-medium text-[#18181A]">
            {selectedCount} selected
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#E8E8E8]" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              size="sm"
              icon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ActionBar
