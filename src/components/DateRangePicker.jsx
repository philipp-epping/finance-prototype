import React, { useState } from 'react'
import { X, Calendar } from 'lucide-react'
import { Button } from './ui'

const DateRangePicker = ({ isOpen, onClose, startDate, endDate, onApply }) => {
  const [localStartDate, setLocalStartDate] = useState(startDate || new Date())
  const [localEndDate, setLocalEndDate] = useState(endDate || new Date())
  const [activeTab, setActiveTab] = useState('range') // 'range' | 'month' | 'preset'

  if (!isOpen) return null

  // Preset options
  const presets = [
    { label: 'This month', getValue: () => {
      const now = new Date()
      return { 
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      }
    }},
    { label: 'Last month', getValue: () => {
      const now = new Date()
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0)
      }
    }},
    { label: 'Last 3 months', getValue: () => {
      const now = new Date()
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      }
    }},
    { label: 'This year', getValue: () => {
      const now = new Date()
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31)
      }
    }},
    { label: 'Last year', getValue: () => {
      const now = new Date()
      return {
        start: new Date(now.getFullYear() - 1, 0, 1),
        end: new Date(now.getFullYear() - 1, 11, 31)
      }
    }},
  ]

  // Month grid for quick selection
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const handleMonthSelect = (monthIndex) => {
    const start = new Date(selectedYear, monthIndex, 1)
    const end = new Date(selectedYear, monthIndex + 1, 0)
    setLocalStartDate(start)
    setLocalEndDate(end)
  }

  const handlePresetSelect = (preset) => {
    const { start, end } = preset.getValue()
    setLocalStartDate(start)
    setLocalEndDate(end)
  }

  const handleApply = () => {
    onApply(localStartDate, localEndDate)
    onClose()
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-md border border-[#E8E8E8] w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
          <h2 className="text-16 font-semibold text-[#18181A]">Select date range</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F0F0F0] rounded-sm transition-colors"
          >
            <X className="w-4 h-4 text-[#8D8D8D]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8E8E8]">
          {[
            { id: 'preset', label: 'Presets' },
            { id: 'month', label: 'Month' },
            { id: 'range', label: 'Custom' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-13 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#4D5FFF] border-b-2 border-[#4D5FFF]'
                  : 'text-[#656565] hover:text-[#18181A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Preset Tab */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(preset)}
                  className="w-full text-left px-3 py-2.5 rounded-md text-14 text-[#18181A] hover:bg-[#F0F0F0] transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Month Tab */}
          {activeTab === 'month' && (
            <div>
              {/* Year Selector */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setSelectedYear(selectedYear - 1)}
                  className="text-13 text-[#656565] hover:text-[#18181A]"
                >
                  ← {selectedYear - 1}
                </button>
                <span className="text-16 font-semibold text-[#18181A]">{selectedYear}</span>
                <button
                  onClick={() => setSelectedYear(selectedYear + 1)}
                  disabled={selectedYear >= new Date().getFullYear()}
                  className={`text-13 ${
                    selectedYear >= new Date().getFullYear()
                      ? 'text-[#BBBBBB] cursor-not-allowed'
                      : 'text-[#656565] hover:text-[#18181A]'
                  }`}
                >
                  {selectedYear + 1} →
                </button>
              </div>
              
              {/* Month Grid */}
              <div className="grid grid-cols-4 gap-2">
                {months.map((month, idx) => {
                  const isSelected = 
                    localStartDate.getMonth() === idx && 
                    localStartDate.getFullYear() === selectedYear
                  const isFuture = 
                    selectedYear > new Date().getFullYear() ||
                    (selectedYear === new Date().getFullYear() && idx > new Date().getMonth())
                  
                  return (
                    <button
                      key={month}
                      onClick={() => !isFuture && handleMonthSelect(idx)}
                      disabled={isFuture}
                      className={`py-2.5 rounded-md text-13 font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#4D5FFF] text-white'
                          : isFuture
                            ? 'text-[#BBBBBB] cursor-not-allowed'
                            : 'text-[#18181A] hover:bg-[#F0F0F0]'
                      }`}
                    >
                      {month}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Custom Range Tab */}
          {activeTab === 'range' && (
            <div className="space-y-4">
              <div>
                <label className="block text-12 font-medium text-[#656565] mb-1">
                  Start date
                </label>
                <input
                  type="date"
                  value={localStartDate.toISOString().split('T')[0]}
                  onChange={(e) => setLocalStartDate(new Date(e.target.value))}
                  className="w-full h-[36px] px-3 bg-white border border-[#E8E8E8] rounded-sm text-14 text-[#18181A] focus:outline-none focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring"
                />
              </div>
              <div>
                <label className="block text-12 font-medium text-[#656565] mb-1">
                  End date
                </label>
                <input
                  type="date"
                  value={localEndDate.toISOString().split('T')[0]}
                  onChange={(e) => setLocalEndDate(new Date(e.target.value))}
                  className="w-full h-[36px] px-3 bg-white border border-[#E8E8E8] rounded-sm text-14 text-[#18181A] focus:outline-none focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring"
                />
              </div>
            </div>
          )}

          {/* Selected Range Display */}
          <div className="mt-4 p-3 bg-[#F0F0F0] rounded-md">
            <p className="text-12 text-[#8D8D8D] mb-0.5">Selected range</p>
            <p className="text-14 font-medium text-[#18181A]">
              {formatDate(localStartDate)} — {formatDate(localEndDate)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-[#E8E8E8]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DateRangePicker
