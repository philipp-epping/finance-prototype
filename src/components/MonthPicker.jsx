import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react'

const MonthPicker = ({ selectedDate, onChange, onOpenDateRange }) => {
  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    onChange(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    onChange(newDate)
  }

  // Check if we're at the current month (can't go forward)
  const isCurrentMonth = () => {
    const now = new Date()
    return selectedDate.getMonth() === now.getMonth() && 
           selectedDate.getFullYear() === now.getFullYear()
  }

  return (
    <div className="flex items-center gap-1">
      {/* Previous Month Button */}
      <button
        onClick={goToPreviousMonth}
        className="w-9 h-9 flex items-center justify-center rounded-sm border border-[#D9D9D9] bg-white hover:bg-[#F0F0F0] transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-[#656565]" />
      </button>

      {/* Month Display / Date Range Trigger */}
      <button
        onClick={onOpenDateRange}
        className="h-9 px-3 flex items-center gap-2 rounded-sm border border-[#D9D9D9] bg-white hover:bg-[#F0F0F0] transition-colors"
      >
        <span className="text-14 font-medium text-[#18181A]">
          {formatMonth(selectedDate)}
        </span>
        <ChevronsUpDown className="w-3.5 h-3.5 text-[#8D8D8D]" />
      </button>

      {/* Next Month Button */}
      <button
        onClick={goToNextMonth}
        disabled={isCurrentMonth()}
        className={`w-9 h-9 flex items-center justify-center rounded-sm border border-[#D9D9D9] bg-white transition-colors ${
          isCurrentMonth() 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-[#F0F0F0]'
        }`}
      >
        <ChevronRight className="w-4 h-4 text-[#656565]" />
      </button>
    </div>
  )
}

export default MonthPicker
