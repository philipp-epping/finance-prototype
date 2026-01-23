import React, { useState, forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  placeholder, 
  helperText, 
  error, 
  disabled = false,
  size = 'md',
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  autoFocus = false,
  tabIndex,
  icon: Icon,
  className = ''
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  
  // Sizes from Figma Design System
  const sizeStyles = {
    sm: 'h-[32px] px-3 text-13',
    md: 'h-[36px] px-3 text-13',
  }
  
  // Base styles with 6px border radius from Figma
  const baseStyles = 'w-full rounded-sm border transition-all duration-[120ms] focus:outline-none'
  
  // States from Figma Design System
  const stateStyles = error
    ? 'border-[#F13B3B] bg-white text-[#18181A] focus:border-[#F13B3B] focus:shadow-focus'
    : disabled
    ? 'bg-[#F0F0F0] text-[#8D8D8D] border-[#D9D9D9] cursor-not-allowed'
    : 'bg-white text-[#18181A] border-[#D9D9D9] hover:border-[#BBBBBB] focus:border-[#4D5FFF] focus:shadow-focus'
  
  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }
  
  const handleBlur = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }
  
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-13 font-medium text-[#656565]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8D8D]" />
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          className={`${baseStyles} ${sizeStyles[size]} ${stateStyles} ${Icon ? 'pl-9' : ''} placeholder:text-[#8D8D8D]`}
        />
      </div>
      {(error || (helperText && isFocused)) && (
        <p className={`text-12 ${error ? 'text-[#F13B3B]' : 'text-[#8D8D8D]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
