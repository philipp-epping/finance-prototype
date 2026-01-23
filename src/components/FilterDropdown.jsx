import React, { useState, useRef, useEffect } from 'react'
import { Filter, Search, ChevronLeft, Check, X } from 'lucide-react'

// Filter categories configuration
const FILTER_CATEGORIES = [
  { 
    id: 'receiptStatus', 
    label: 'Receipt Status',
    options: [
      { value: 'has-receipt', label: 'Has Receipt' },
      { value: 'no-receipt', label: 'No Receipt' },
      { value: 'private', label: 'Marked Private' },
    ]
  },
  { 
    id: 'categorization', 
    label: 'Categorization',
    options: [
      { value: 'ai', label: 'AI Categorized' },
      { value: 'manual', label: 'Manually' },
      { value: 'uncategorized', label: 'Uncategorized' },
    ]
  },
  { 
    id: 'banks', 
    label: 'Bank',
    options: [] // Will be populated from props
  },
  { 
    id: 'categories', 
    label: 'Category',
    options: [] // Will be populated from props
  },
]

const FilterDropdown = ({ 
  filters, 
  onFiltersChange, 
  bankOptions = [], 
  categoryOptions = [],
  isOpen: controlledIsOpen,
  onOpenChange,
  initialCategory = null, // When set, opens directly to this category
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = onOpenChange || setInternalIsOpen
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null) // null = showing categories, otherwise showing values
  const [tempValues, setTempValues] = useState([]) // Temporary values while editing
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Handle initialCategory when dropdown opens
  useEffect(() => {
    if (isOpen && initialCategory) {
      setSelectedCategory(initialCategory)
      setTempValues(filters[initialCategory] || [])
    }
  }, [isOpen, initialCategory])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, selectedCategory])

  // Build categories with dynamic options
  const categories = FILTER_CATEGORIES.map(cat => {
    if (cat.id === 'banks') {
      return { ...cat, options: bankOptions }
    }
    if (cat.id === 'categories') {
      return { ...cat, options: categoryOptions }
    }
    return cat
  })

  // Filter categories by search
  const filteredCategories = categories.filter(cat =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get current category
  const currentCategory = selectedCategory 
    ? categories.find(c => c.id === selectedCategory) 
    : null

  // Filter options by search
  const filteredOptions = currentCategory?.options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleClose = () => {
    setIsOpen(false)
    setSelectedCategory(null)
    setSearchQuery('')
    setTempValues([])
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setSearchQuery('')
    // Load existing filter values for this category
    setTempValues(filters[categoryId] || [])
  }

  const handleBack = () => {
    setSelectedCategory(null)
    setSearchQuery('')
    setTempValues([])
  }

  const handleValueToggle = (value) => {
    setTempValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleApply = () => {
    if (selectedCategory) {
      onFiltersChange({
        ...filters,
        [selectedCategory]: tempValues
      })
    }
    handleClose()
  }

  const handleClearCategory = () => {
    if (selectedCategory) {
      onFiltersChange({
        ...filters,
        [selectedCategory]: []
      })
    }
    handleClose()
  }

  // Count active filters
  const activeFilterCount = Object.values(filters).reduce((count, arr) => 
    count + (arr.length > 0 ? 1 : 0), 0
  )

  return (
    <div ref={dropdownRef} className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 px-3 flex items-center gap-2 rounded-sm border transition-colors ${
          activeFilterCount > 0 
            ? 'border-[#4D5FFF] bg-[#F7F9FF] text-[#4D5FFF]' 
            : 'border-[#E8E8E8] bg-white hover:bg-[#F0F0F0] text-[#656565]'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="text-13 font-medium">Filter</span>
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#4D5FFF] text-white text-11 font-medium flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-64 bg-white border border-[#E8E8E8] rounded-lg shadow-md z-50">
          {/* Header */}
          <div className="p-2 border-b border-[#E8E8E8]">
            {selectedCategory ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleBack}
                  className="p-1 hover:bg-[#F0F0F0] rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-[#8D8D8D]" />
                </button>
                <span className="text-13 font-medium text-[#18181A]">
                  {currentCategory?.label}
                </span>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8D8D] pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search filters..."
                  className="w-full h-8 pl-8 pr-3 bg-[#F0F0F0] border-0 rounded text-13 text-[#18181A] placeholder:text-[#8D8D8D] focus:outline-none focus:ring-2 focus:ring-focus-ring"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="max-h-64 overflow-y-auto py-1">
            {!selectedCategory ? (
              // Category List
              filteredCategories.length > 0 ? (
                filteredCategories.map(category => {
                  const hasActiveFilter = filters[category.id]?.length > 0
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full px-3 py-2 text-left hover:bg-[#F0F0F0] transition-colors flex items-center justify-between"
                    >
                      <span className="text-13 text-[#18181A]">{category.label}</span>
                      {hasActiveFilter && (
                        <span className="text-10 text-[#8D8D8D]">
                          {filters[category.id].length}
                        </span>
                      )}
                    </button>
                  )
                })
              ) : (
                <div className="px-3 py-4 text-center text-13 text-[#8D8D8D]">
                  No filters found
                </div>
              )
            ) : (
              // Value List
              filteredOptions.length > 0 ? (
                filteredOptions.map(option => {
                  const isSelected = tempValues.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleValueToggle(option.value)}
                      className="w-full px-3 py-2 text-left hover:bg-[#F0F0F0] transition-colors flex items-center gap-2"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        isSelected 
                          ? 'bg-[#4D5FFF] border-[#4D5FFF]' 
                          : 'border-[#E8E8E8]'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-13 text-[#18181A]">{option.label}</span>
                    </button>
                  )
                })
              ) : (
                <div className="px-3 py-4 text-center text-13 text-[#8D8D8D]">
                  No options found
                </div>
              )
            )}
          </div>

          {/* Footer (only when selecting values) */}
          {selectedCategory && (
            <div className="p-2 border-t border-[#E8E8E8] flex items-center justify-between">
              <button
                onClick={handleClearCategory}
                className="text-12 text-[#8D8D8D] hover:text-[#656565] transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className="h-7 px-3 bg-[#4D5FFF] text-white text-12 font-medium rounded hover:bg-[#4555E3] transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
