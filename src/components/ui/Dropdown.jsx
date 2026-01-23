import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const Dropdown = ({ 
  label,
  value, 
  options, 
  onChange,
  onSelect,
  placeholder = 'Select an option',
  menuHeader,
  className = '',
  multiSelect = false,
  allLabel = 'All'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const dropdownRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlighted index when dropdown opens
  useEffect(() => {
    if (isOpen) {
      if (multiSelect) {
        setHighlightedIndex(0)
      } else {
        const currentIndex = options.findIndex(opt => opt.value === value)
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0)
      }
    }
  }, [isOpen, options, value, multiSelect])

  // For single select
  const selectedOption = !multiSelect ? options.find(opt => opt.value === value) : null
  
  // For multi-select: check if a value is selected
  const isValueSelected = (optValue) => {
    if (!multiSelect) return optValue === value
    return Array.isArray(value) && value.includes(optValue)
  }
  
  // Get display text for multi-select
  const getMultiSelectDisplay = () => {
    if (!Array.isArray(value) || value.length === 0) return allLabel
    if (value.length === 1) {
      const opt = options.find(o => o.value === value[0])
      return opt?.label || value[0]
    }
    return `${value.length} selected`
  }
  
  // Handle option click for multi-select
  const handleMultiSelectClick = (optValue) => {
    if (!Array.isArray(value)) {
      onChange([optValue])
      return
    }
    if (value.includes(optValue)) {
      onChange(value.filter(v => v !== optValue))
    } else {
      onChange([...value, optValue])
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (isOpen && e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1
      if (index < options.length) {
        e.preventDefault()
        if (multiSelect) {
          handleMultiSelectClick(options[index].value)
        } else {
          onChange(options[index].value)
          setIsOpen(false)
          onSelect?.()
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
      } else {
        setHighlightedIndex(prev => Math.min(prev + 1, options.length - 1))
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (isOpen) {
        setHighlightedIndex(prev => Math.max(prev - 1, 0))
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpen && options[highlightedIndex]) {
        if (multiSelect) {
          handleMultiSelectClick(options[highlightedIndex].value)
        } else {
          onChange(options[highlightedIndex].value)
          setIsOpen(false)
          onSelect?.()
        }
      } else {
        setIsOpen(true)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  const handleFocus = () => {
    setIsOpen(true)
  }
  
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-13 font-medium text-[#656565] mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className="w-full h-[36px] px-3 bg-white border border-[#D9D9D9] rounded-sm text-13 text-left flex items-center justify-between hover:border-[#BBBBBB] focus:border-[#4D5FFF] focus:shadow-focus focus:outline-none transition-all duration-[120ms]"
      >
        <span className={multiSelect ? (Array.isArray(value) && value.length > 0 ? 'text-[#18181A]' : 'text-[#8D8D8D]') : (selectedOption ? 'text-[#18181A]' : 'text-[#8D8D8D]')}>
          {multiSelect ? getMultiSelectDisplay() : (selectedOption ? selectedOption.label : placeholder)}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#8D8D8D] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-alpha-10 rounded-lg shadow-md py-1.5 z-50">
          {menuHeader && (
            <div className="px-3 py-2 text-12 text-[#8D8D8D]">
              {menuHeader}
            </div>
          )}
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => {
                if (multiSelect) {
                  handleMultiSelectClick(option.value)
                } else {
                  onChange(option.value)
                  setIsOpen(false)
                  onSelect?.()
                }
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-3 py-2 text-13 text-left transition-colors flex items-center gap-3 rounded-[7px] mx-0 ${
                index === highlightedIndex ? 'bg-[#F0F0F0]' : ''
              } text-[#18181A]`}
            >
              {/* Checkbox for multi-select */}
              {multiSelect && (
                <div className={`w-3 h-3 rounded-checkbox border flex items-center justify-center flex-shrink-0 ${
                  isValueSelected(option.value) 
                    ? 'bg-[#4D5FFF] border-[#4D5FFF]' 
                    : 'border-[#D9D9D9]'
                }`}>
                  {isValueSelected(option.value) && (
                    <Check className="w-2.5 h-2.5 text-white" />
                  )}
                </div>
              )}
              
              {/* Icon */}
              {option.icon && (
                <span className="flex-shrink-0 text-[#656565]">{option.icon}</span>
              )}
              
              {/* Label and description */}
              <div className="flex-1 min-w-0">
                <span className="font-medium block">{option.label}</span>
                {option.description && (
                  <span className="text-12 text-[#8D8D8D] block">{option.description}</span>
                )}
              </div>
              
              {/* Selected checkmark (single-select only) */}
              {!multiSelect && isValueSelected(option.value) && (
                <Check className="w-4 h-4 text-[#4D5FFF] flex-shrink-0" />
              )}
              
              {/* Keyboard shortcut */}
              {index < 9 && (
                <span className="text-12 text-[#8D8D8D] bg-[#F0F0F0] px-1.5 py-0.5 rounded-xs flex-shrink-0 min-w-[20px] text-center">
                  {index + 1}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
