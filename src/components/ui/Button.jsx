import React, { forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  iconEnd: IconEnd,
  disabled = false,
  onClick,
  type,
  className = ''
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-[120ms] focus:outline-none focus:shadow-focus'
  
  // Sizes from Figma Design System
  const sizeStyles = {
    sm: 'h-[24px] px-[7px] py-1 text-12 rounded-sm gap-[3px]',      // Small
    md: 'h-[32px] px-[8px] py-2 text-13 rounded-md gap-1',           // Medium  
    lg: 'h-[40px] px-3 py-3 text-13 rounded-lg gap-1',               // Large
    compact: 'h-[28px] px-3 py-1.5 text-13 rounded-sm gap-1',        // Compact
  }
  
  // Colors from Figma Design System - using explicit hex values for reliability
  const variantStyles = {
    primary: disabled 
      ? 'bg-[#D9D9D9] text-white cursor-not-allowed'
      : 'bg-[#4D5FFF] text-white hover:bg-[#4555E3] active:bg-[#4150DD] [text-shadow:0px_0.5px_1px_rgba(0,0,0,0.08)]',
    secondary: disabled
      ? 'bg-[#F0F0F0] text-[#D9D9D9] cursor-not-allowed'
      : 'bg-[#F0F0F0] text-[#656565] hover:bg-[#E8E8E8] active:bg-[#E1E1E1]',
    outline: disabled
      ? 'bg-white text-[#D9D9D9] border border-[#E8E8E8] cursor-not-allowed'
      : 'bg-white text-[#656565] border border-[rgba(0,0,0,0.1)] hover:bg-[#F9F9F9] active:bg-[#F0F0F0]',
    ghost: disabled
      ? 'bg-transparent text-[#D9D9D9] cursor-not-allowed'
      : 'bg-transparent text-[#656565] hover:bg-[#F0F0F0] active:bg-[#E8E8E8]',
    tertiary: disabled
      ? 'text-[#D9D9D9] cursor-not-allowed'
      : 'text-[#656565] hover:text-[#18181A]',
    danger: disabled
      ? 'bg-[#D9D9D9] text-white cursor-not-allowed'
      : 'bg-[#F13B3B] text-white hover:bg-[#E3272D] active:bg-[#D71723]',
  }

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {IconEnd && <IconEnd className="w-4 h-4 shrink-0" />}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
