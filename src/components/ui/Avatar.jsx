import React, { useState } from 'react'

const Avatar = ({ 
  src, 
  name, 
  size = 'md',
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false)

  // Size mapping from Figma Design System
  const sizes = {
    xs: 'w-4 h-4 text-[8px]',
    sm: 'w-6 h-6 text-10',
    md: 'w-8 h-8 text-12',
    lg: 'w-10 h-10 text-14',
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  // Generate consistent color from name
  const getColorFromName = (name) => {
    if (!name) return 'bg-[#F0F0F0] text-[#8D8D8D]'
    const colors = [
      'bg-[#EDF2FF] text-[#4D5FFF]',
      'bg-[#EAF6E6] text-[#50942A]',
      'bg-[#FFEECD] text-[#4D361A]',
      'bg-[#FFEBE8] text-[#F13B3B]',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const showImage = src && !imageError

  return (
    <div 
      className={`
        ${sizes[size] || sizes.md}
        rounded-sm
        flex items-center justify-center
        overflow-hidden
        flex-shrink-0
        font-medium
        border border-alpha-6
        ${!showImage ? getColorFromName(name) : ''}
        ${className}
      `}
    >
      {showImage ? (
        <img 
          src={src} 
          alt={name || 'Avatar'} 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}

export default Avatar
