import React from 'react'

const Badge = ({
  children,
  variant = 'neutral',
  appearance = 'subtle',
  className = '',
}) => {
  const isSolid = appearance === 'solid'

  const base =
    'inline-flex items-center px-2 py-0.5 rounded-sm text-12 font-medium leading-none'

  // Badge types from Figma Design System - using explicit hex values for reliability
  const subtleVariants = {
    // Core status types from Figma
    neutral: 'bg-[#F5F5F5] text-[#717171]',
    pending: 'bg-[#E5EDFD] text-[#00349C]',
    info: 'bg-[#EEF0FF] text-[#1729C1]',
    danger: 'bg-[#FCECE7] text-[#86340F]',
    warning: 'bg-[#FCF2E7] text-[#42301C]',
    success: 'bg-[#E9F8E5] text-[#2A531E]',

    // Primary/accent variant
    primary: 'bg-[#EDF2FF] text-[#4D5FFF]',
    
    // Legacy aliases for backward compatibility
    done: 'bg-[#E9F8E5] text-[#2A531E]',
    inProgress: 'bg-[#EEF0FF] text-[#1729C1]',
    next: 'bg-[#EDF2FF] text-[#4D5FFF]',
    review: 'bg-[#FCF2E7] text-[#42301C]',
    needsReview: 'bg-[#FCECE7] text-[#86340F]',
    blocked: 'bg-[#FFEBE8] text-[#F13B3B]',
  }

  const solidVariants = {
    neutral: 'bg-[#8D8D8D] text-white',
    pending: 'bg-[#00349C] text-white',
    info: 'bg-[#1729C1] text-white',
    danger: 'bg-[#F13B3B] text-white',
    warning: 'bg-[#FEA101] text-white',
    success: 'bg-[#50942A] text-white',
    primary: 'bg-[#4D5FFF] text-white',

    // Legacy aliases
    done: 'bg-[#50942A] text-white',
    inProgress: 'bg-[#4D5FFF] text-white',
    next: 'bg-[#4D5FFF] text-white',
    review: 'bg-[#FEA101] text-white',
    needsReview: 'bg-[#F13B3B] text-white',
    blocked: 'bg-[#F13B3B] text-white',
  }

  const variants = isSolid ? solidVariants : subtleVariants

  return (
    <span className={`${base} ${variants[variant] ?? variants.neutral} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
