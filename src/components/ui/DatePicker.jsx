import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const DatePicker = ({ 
  value, 
  onChange, 
  placeholder = 'Select date',
  showPresets = true,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value || new Date())
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

  const presets = [
    { label: 'Today', getValue: () => new Date() },
    { label: 'Yesterday', getValue: () => { const d = new Date(); d.setDate(d.getDate() - 1); return d } },
    { label: 'Last 7 days', getValue: () => { const d = new Date(); d.setDate(d.getDate() - 7); return d } },
    { label: 'Last 30 days', getValue: () => { const d = new Date(); d.setDate(d.getDate() - 30); return d } },
    { label: 'This month', getValue: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    { label: 'Last month', getValue: () => new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1) },
  ]

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay()
  
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const selectDate = (day) => {
    if (day) {
      const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
      onChange?.(newDate)
      setIsOpen(false)
    }
  }

  const selectPreset = (preset) => {
    const newDate = preset.getValue()
    onChange?.(newDate)
    setViewDate(newDate)
    setIsOpen(false)
  }

  const isToday = (day) => {
    if (!day) return false
    const today = new Date()
    return day === today.getDate() && 
           viewDate.getMonth() === today.getMonth() && 
           viewDate.getFullYear() === today.getFullYear()
  }

  const isSelected = (day) => {
    if (!day || !value) return false
    return day === value.getDate() && 
           viewDate.getMonth() === value.getMonth() && 
           viewDate.getFullYear() === value.getFullYear()
  }

  const formatDate = (date) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[36px] px-3 bg-white border border-[#D9D9D9] rounded-sm text-13 text-left flex items-center justify-between hover:border-[#BBBBBB] focus:border-[#4D5FFF] focus:shadow-focus focus:outline-none transition-all duration-[120ms]"
      >
        <span className={value ? 'text-[#18181A]' : 'text-[#8D8D8D]'}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-[#8D8D8D]" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-alpha-10 rounded-lg shadow-sm z-50 overflow-hidden">
          <div className="flex">
            {/* Presets sidebar */}
            {showPresets && (
              <div className="w-[140px] border-r border-[#E8E8E8] py-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => selectPreset(preset)}
                    className="w-full px-3 py-2 text-13 text-left text-[#18181A] hover:bg-[#F0F0F0] rounded-[7px] mx-0 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Calendar */}
            <div className="p-3 w-[280px]">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded-sm hover:bg-[#F0F0F0] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-[#656565]" />
                </button>
                <span className="text-13 font-medium text-[#18181A]">
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-sm hover:bg-[#F0F0F0] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-[#656565]" />
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {dayNames.map((day) => (
                  <div key={day} className="h-8 flex items-center justify-center text-12 text-[#8D8D8D]">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => selectDate(day)}
                    disabled={!day}
                    className={`h-8 w-8 flex items-center justify-center text-13 rounded-[7px] transition-colors ${
                      !day 
                        ? 'invisible' 
                        : isSelected(day)
                        ? 'bg-[#4D5FFF] text-white'
                        : isToday(day)
                        ? 'bg-[#F0F0F0] text-[#18181A] font-medium'
                        : 'text-[#18181A] hover:bg-[#F0F0F0]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
