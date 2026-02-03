import React from 'react'
import { Check, Minus } from 'lucide-react'

const Checkbox = ({ 
  label, 
  checked, 
  indeterminate = false,
  onChange, 
  disabled = false, 
  className = '' 
}) => {
  const isActive = checked || indeterminate

  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        {/* Checkbox: 16x16px, 4px border radius - larger squared style */}
        <div className={`w-4 h-4 rounded-[4px] border transition-all duration-[120ms] flex items-center justify-center ${
          isActive 
            ? 'bg-[#4D5FFF] border-[#4D5FFF]' 
            : 'bg-white border-[#D9D9D9] hover:bg-[#F0F0F0]'
        } ${disabled && isActive ? 'bg-[#D9D9D9] border-[#D9D9D9]' : ''}`}>
          {indeterminate && !checked && (
            <Minus className="w-3 h-3 text-white" strokeWidth={3} />
          )}
          {checked && (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </div>
      </div>
      {label && <span className="text-13 text-[#18181A] select-none">{label}</span>}
    </label>
  )
}

export default Checkbox
