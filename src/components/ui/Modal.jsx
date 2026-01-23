import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, actions, size = 'md', showCloseButton = true }) => {
  if (!isOpen) return null
  
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-alpha-48" onClick={onClose} />
      
      {/* Modal content - 12px border radius, shadow-md from Figma */}
      <div className={`relative bg-white rounded-xl shadow-md ${sizeStyles[size]} w-full mx-4`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            {title && (
              <h2 className="text-14 font-medium text-[#18181A]">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-sm text-[#8D8D8D] hover:text-[#18181A] hover:bg-[#F0F0F0] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="px-5 pb-3 text-13 text-[#656565]">
          {children}
        </div>
        
        {/* Actions */}
        {actions && (
          <div className="flex justify-end gap-2 px-5 pb-5 pt-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
