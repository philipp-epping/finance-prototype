import React, { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

const Table = ({ 
  columns, 
  data, 
  onRowClick, 
  className = '',
  emptyMessage = 'No data',
  // Active row (for split-view highlighting)
  activeRowId = null,
  // Selection props (multi-select checkboxes)
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  rowIdAccessor = (row) => row.id
}) => {
  // Track if checkboxes should always be visible (after first selection)
  const [checkboxesVisible, setCheckboxesVisible] = useState(false)
  
  // Reset checkbox visibility when selection is cleared
  useEffect(() => {
    if (selectedIds.size === 0) {
      setCheckboxesVisible(false)
    }
  }, [selectedIds.size])
  
  // Check if all rows are selected
  const isAllSelected = data.length > 0 && data.every(row => selectedIds.has(rowIdAccessor(row)))
  const isSomeSelected = data.some(row => selectedIds.has(rowIdAccessor(row)))
  
  // Handle select all
  const handleSelectAll = (e) => {
    e.stopPropagation()
    setCheckboxesVisible(true)
    if (isAllSelected) {
      onSelectionChange?.(new Set())
    } else {
      onSelectionChange?.(new Set(data.map(row => rowIdAccessor(row))))
    }
  }
  
  // Handle row selection
  const handleRowSelect = (e, row) => {
    e.stopPropagation()
    setCheckboxesVisible(true)
    const rowId = rowIdAccessor(row)
    const newSelection = new Set(selectedIds)
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId)
    } else {
      newSelection.add(rowId)
    }
    onSelectionChange?.(newSelection)
  }
  
  return (
    <div className={`rounded-lg border border-border-table-row overflow-hidden bg-white ${className}`} style={{ position: 'relative' }}>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]" style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
        <colgroup>
          {selectable && <col style={{ width: '40px' }} />}
          {columns.map((column, idx) => (
            <col 
              key={idx} 
              style={column.width ? { width: column.width } : {}}
            />
          ))}
        </colgroup>
        <thead>
          {/* Header row with #FAFAFA background from Figma */}
          <tr className="bg-[#FAFAFA] border-b border-border-table-row">
            {selectable && (
              <th className="px-3 h-9 text-left bg-[#FAFAFA]">
                <div 
                  onClick={handleSelectAll}
                  className={`w-3 h-3 rounded-checkbox border flex items-center justify-center cursor-pointer transition-all ${
                    isAllSelected 
                      ? 'bg-[#4D5FFF] border-[#4D5FFF]' 
                      : isSomeSelected
                      ? 'bg-[#4D5FFF]/50 border-[#4D5FFF]'
                      : 'border-[#D9D9D9] hover:border-[#BBBBBB]'
                  } ${checkboxesVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                  {(isAllSelected || isSomeSelected) && (
                    <Check className="w-2.5 h-2.5 text-white" />
                  )}
                </div>
              </th>
            )}
            {columns.map((column, idx) => (
              <th
                key={idx}
                className="px-4 h-9 text-left text-13 font-medium text-[#656565] whitespace-nowrap bg-[#FAFAFA]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-13 text-[#8D8D8D]">
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((row, rowIdx) => {
            const rowId = rowIdAccessor(row)
            const isSelected = selectedIds.has(rowId)
            const isActive = activeRowId === rowId
            
            return (
              <tr
                key={rowIdx}
                onClick={() => onRowClick?.(row)}
                className={`group border-b border-border-table-row last:border-b-0 transition-colors ${
                  isActive ? 'bg-[#F7F9FF] border-l-2 border-l-[#4D5FFF]' :
                  isSelected ? 'bg-[#FDFDFE]' : 'bg-white hover:bg-[#F9F9F9]'
                } ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {selectable && (
                  <td className="px-3 py-2 h-10">
                    <div 
                      onClick={(e) => handleRowSelect(e, row)}
                      className={`w-3 h-3 rounded-checkbox border flex items-center justify-center cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#4D5FFF] border-[#4D5FFF] opacity-100' 
                          : 'border-[#D9D9D9] hover:border-[#BBBBBB]'
                      } ${checkboxesVisible || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      {isSelected && (
                        <Check className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                  </td>
                )}
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className="px-4 py-2 h-10 text-13 text-[#656565]"
                  >
                    {column.accessor ? column.accessor(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Table
