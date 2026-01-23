import React, { useState, useRef, useEffect } from 'react'
import { Filter, X, ChevronDown, Check, Plus, Search } from 'lucide-react'

// Filter categories configuration (shared with FilterDropdown)
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

// Individual filter row component
const FilterRow = ({ 
  filterId, 
  filterLabel,
  selectedValues, 
  options, 
  onValuesChange, 
  onRemove,
  availableCategories,
  onCategoryChange,
  autoExpandValues = false
}) => {
  const [isValueDropdownOpen, setIsValueDropdownOpen] = useState(autoExpandValues)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const valueDropdownRef = useRef(null)
  const categoryDropdownRef = useRef(null)

  // Auto-expand value dropdown when prop changes
  useEffect(() => {
    if (autoExpandValues) {
      setIsValueDropdownOpen(true)
    }
  }, [autoExpandValues])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (valueDropdownRef.current && !valueDropdownRef.current.contains(event.target)) {
        setIsValueDropdownOpen(false)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleValue = (value) => {
    if (selectedValues.includes(value)) {
      onValuesChange(selectedValues.filter(v => v !== value))
    } else {
      onValuesChange([...selectedValues, value])
    }
  }

  const getDisplayValues = () => {
    if (selectedValues.length === 0) return 'Select...'
    const labels = selectedValues.map(v => {
      const opt = options.find(o => o.value === v)
      return opt?.label || v
    })
    if (labels.length <= 2) return labels.join(', ')
    return `${labels[0]}, ${labels[1]} +${labels.length - 2}`
  }

  return (
    <div className="flex items-center gap-2 py-2 px-3 hover:bg-[#F0F0F0] rounded-md group">
      {/* Category selector */}
      <div ref={categoryDropdownRef} className="relative">
        <button
          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          className="h-8 px-3 flex items-center gap-2 bg-white border border-[#E8E8E8] rounded text-13 text-[#18181A] hover:border-[#D1D5DB] transition-colors min-w-[140px]"
        >
          <span className="flex-1 text-left">{filterLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8D8D8D]" />
        </button>
        
        {isCategoryDropdownOpen && availableCategories.length > 0 && (
          <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-[#E8E8E8] rounded-lg shadow-md z-50 py-1">
            {availableCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id)
                  setIsCategoryDropdownOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-13 text-[#18181A] hover:bg-[#F0F0F0] transition-colors"
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Value selector */}
      <div ref={valueDropdownRef} className="relative flex-1">
        <button
          onClick={() => setIsValueDropdownOpen(!isValueDropdownOpen)}
          className="w-full h-8 px-3 flex items-center gap-2 bg-white border border-[#E8E8E8] rounded text-13 text-[#18181A] hover:border-[#D1D5DB] transition-colors"
        >
          <span className="flex-1 text-left truncate">{getDisplayValues()}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8D8D8D] flex-shrink-0" />
        </button>
        
        {isValueDropdownOpen && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-[#E8E8E8] rounded-lg shadow-md z-50 py-1 max-h-48 overflow-y-auto">
            {options.map(option => {
              const isSelected = selectedValues.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => toggleValue(option.value)}
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
            })}
          </div>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="p-1.5 text-[#8D8D8D] hover:text-[#656565] hover:bg-[#E8E8E8] rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

const AdvancedFilterPanel = ({
  filters,
  onFiltersChange,
  bankOptions = [],
  categoryOptions = [],
  isOpen,
  onOpenChange
}) => {
  const panelRef = useRef(null)
  const addFilterRef = useRef(null)
  const [addFilterOpen, setAddFilterOpen] = useState(false)
  const [pendingFilters, setPendingFilters] = useState([]) // Categories added but may have no values yet
  const [panelMode, setPanelMode] = useState('search') // 'search' | 'filters'
  const [categorySearch, setCategorySearch] = useState('')
  const [justAddedFilterId, setJustAddedFilterId] = useState(null) // Track for auto-expand
  const [highlightedIndex, setHighlightedIndex] = useState(0) // Track highlighted category in search
  const searchInputRef = useRef(null)

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
  
  // Filter categories for search
  const filteredCategories = categories
    .filter(cat => cat.options.length > 0)
    .filter(cat => cat.label.toLowerCase().includes(categorySearch.toLowerCase()))

  // Get active filter IDs (filters with values)
  const activeFilterIds = Object.entries(filters)
    .filter(([_, values]) => values.length > 0)
    .map(([id]) => id)

  // Combine active and pending filter IDs for display
  const displayedFilterIds = [...new Set([...activeFilterIds, ...pendingFilters])]

  // Get available categories for adding new filters
  const availableCategories = categories.filter(cat => 
    !displayedFilterIds.includes(cat.id) && cat.options.length > 0
  )
  
  // Reset state when panel closes or opens
  useEffect(() => {
    if (!isOpen) {
      setPendingFilters([])
      setCategorySearch('')
      setJustAddedFilterId(null)
      setHighlightedIndex(0)
    } else {
      // When opening, determine initial mode based on existing filters
      const hasExistingFilters = Object.values(filters).some(arr => arr.length > 0)
      setPanelMode(hasExistingFilters ? 'filters' : 'search')
      setHighlightedIndex(0)
    }
  }, [isOpen])
  
  // Focus search input when in search mode
  useEffect(() => {
    if (isOpen && panelMode === 'search' && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, panelMode])

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onOpenChange(false)
      }
      // Close add filter dropdown when clicking outside of it
      if (addFilterRef.current && !addFilterRef.current.contains(event.target)) {
        setAddFilterOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onOpenChange])

  // Count active filters
  const activeFilterCount = activeFilterIds.length

  const handleRemoveFilter = (filterId) => {
    // Remove from pending filters
    setPendingFilters(prev => prev.filter(id => id !== filterId))
    // Clear filter values
    onFiltersChange({
      ...filters,
      [filterId]: []
    })
    // Clear just added if it was this one
    if (justAddedFilterId === filterId) {
      setJustAddedFilterId(null)
    }
    // If no more filters, switch back to search mode
    const remainingFilters = displayedFilterIds.filter(id => id !== filterId)
    if (remainingFilters.length === 0) {
      setPanelMode('search')
    }
  }

  const handleValuesChange = (filterId, values) => {
    onFiltersChange({
      ...filters,
      [filterId]: values
    })
    // Clear justAdded after user interacts with values
    if (justAddedFilterId === filterId) {
      setJustAddedFilterId(null)
    }
  }

  const handleAddFilter = (categoryId) => {
    // Add to pending filters so the row appears immediately
    setPendingFilters(prev => [...prev, categoryId])
    // Track for auto-expand
    setJustAddedFilterId(categoryId)
    // Switch to filters view
    setPanelMode('filters')
    // Clear search
    setCategorySearch('')
    // Close add filter dropdown if open
    setAddFilterOpen(false)
  }

  const handleCategoryChange = (oldCategoryId, newCategoryId) => {
    // Move filter to new category
    const newFilters = { ...filters }
    newFilters[newCategoryId] = newFilters[oldCategoryId]
    newFilters[oldCategoryId] = []
    onFiltersChange(newFilters)
  }

  // Handle keyboard navigation in search
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filteredCategories.length > 0) {
      e.preventDefault()
      handleAddFilter(filteredCategories[highlightedIndex].id)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.min(prev + 1, filteredCategories.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.max(prev - 1, 0))
    }
    if (e.key === 'Escape') {
      onOpenChange(false)
    }
  }

  // Get button text based on filter count
  const getButtonText = () => {
    if (activeFilterCount === 0) return 'Filter'
    if (activeFilterCount === 1) return 'Filter applied (1)'
    return `Filters applied (${activeFilterCount})`
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Filter Button */}
      <button
        onClick={() => onOpenChange(!isOpen)}
        className={`h-9 px-3 flex items-center gap-2 rounded-sm border transition-colors ${
          activeFilterCount > 0 
            ? 'border-[#4D5FFF] bg-[#F7F9FF] text-[#4D5FFF]' 
            : 'border-[#E8E8E8] bg-white hover:bg-[#F0F0F0] text-[#656565]'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="text-13 font-medium">{getButtonText()}</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className={`absolute top-full mt-1 right-0 bg-white border border-[#E8E8E8] rounded-lg shadow-md z-50 ${
          panelMode === 'search' ? 'w-64' : 'w-[480px]'
        }`}>
          {/* Search Mode - shown when no filters yet */}
          {panelMode === 'search' && (
            <>
              {/* Search Input */}
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8D8D] pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value)
                      setHighlightedIndex(0) // Reset highlight on search change
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search filters..."
                    className="w-full h-8 pl-8 pr-3 bg-[#F0F0F0] border-0 rounded text-13 text-[#18181A] placeholder:text-[#8D8D8D] focus:outline-none focus:ring-2 focus:ring-focus-ring"
                  />
                </div>
              </div>
              
              {/* Category List */}
              <div className="py-1 max-h-64 overflow-y-auto border-t border-[#E8E8E8]">
                {filteredCategories.map((cat, index) => (
                  <button
                    key={cat.id}
                    onClick={() => handleAddFilter(cat.id)}
                    className={`w-full px-3 py-2 text-left transition-colors ${
                      index === highlightedIndex ? 'bg-[#F0F0F0]' : 'hover:bg-[#F0F0F0]'
                    }`}
                  >
                    <span className="text-13 text-[#18181A]">{cat.label}</span>
                  </button>
                ))}
                {filteredCategories.length === 0 && (
                  <div className="px-3 py-4 text-center text-13 text-[#8D8D8D]">
                    No filters found
                  </div>
                )}
              </div>
            </>
          )}

          {/* Filters Mode - shown when filters exist */}
          {panelMode === 'filters' && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E8]">
                <span className="text-14 font-medium text-[#18181A]">All filters</span>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-1 text-[#8D8D8D] hover:text-[#656565] hover:bg-[#F0F0F0] rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter rows */}
              <div className="p-2">
                {displayedFilterIds.map(filterId => {
                  const category = categories.find(c => c.id === filterId)
                  if (!category) return null
                  
                  return (
                    <FilterRow
                      key={filterId}
                      filterId={filterId}
                      filterLabel={category.label}
                      selectedValues={filters[filterId] || []}
                      options={category.options}
                      onValuesChange={(values) => handleValuesChange(filterId, values)}
                      onRemove={() => handleRemoveFilter(filterId)}
                      availableCategories={[category, ...availableCategories]}
                      onCategoryChange={(newId) => handleCategoryChange(filterId, newId)}
                      autoExpandValues={justAddedFilterId === filterId}
                    />
                  )
                })}
              </div>

              {/* Footer */}
              {availableCategories.length > 0 && (
                <div className="px-4 py-3 border-t border-[#E8E8E8]">
                  <div ref={addFilterRef} className="relative">
                    <button
                      onClick={() => setAddFilterOpen(!addFilterOpen)}
                      className="flex items-center gap-1.5 text-13 text-[#656565] hover:text-[#18181A] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add filter</span>
                    </button>
                    
                    {/* Add filter dropdown */}
                    {addFilterOpen && (
                      <div className="absolute bottom-full mb-1 left-0 w-48 bg-white border border-[#E8E8E8] rounded-lg shadow-md z-50 py-1">
                        {availableCategories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => handleAddFilter(cat.id)}
                            className="w-full px-3 py-2 text-left text-13 text-[#18181A] hover:bg-[#F0F0F0] transition-colors"
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default AdvancedFilterPanel
