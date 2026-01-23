import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Upload, Check, AlertCircle, Archive, Search, ChevronLeft, ChevronRight, FileText, X, Maximize2, Link2 } from 'lucide-react'
import { Table } from './ui'
import { sampleDocuments, formatCurrency } from '../data/mockData'
import DateRangePicker from './DateRangePicker'
import DocumentFilterPanel from './DocumentFilterPanel'

const DocumentsPage = () => {
  const [documents, setDocuments] = useState(sampleDocuments)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedDocId, setSelectedDocId] = useState(null)
  const fileInputRef = useRef(null)
  
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState(new Set())
  
  // Preview tab state
  const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'data'
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: [], // 'outgoing', 'incoming', 'tax'
    status: [], // 'matched', 'unmatched', 'archived'
  })
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  
  // Date range state
  const [dateRangeStart, setDateRangeStart] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 6)
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [dateRangeEnd, setDateRangeEnd] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth() + 1, 0)
  })
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)
  
  // Toast state for cleanup notification
  const [showCleanupToast, setShowCleanupToast] = useState(true)

  // Clear selection helper
  const clearSelection = () => setSelectedIds(new Set())

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  // Get old unmatched documents (> 60 days old)
  const oldUnmatchedDocs = useMemo(() => {
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
    return documents.filter(d => 
      d.status === 'unmatched' && 
      !d.isArchived && 
      new Date(d.uploadDate) < sixtyDaysAgo
    )
  }, [documents])

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(d => {
      // Status filter (includes archived)
      if (filters.status.length > 0) {
        const docStatus = d.isArchived ? 'archived' : d.status
        if (!filters.status.includes(docStatus)) return false
      } else {
        // Default: hide archived unless explicitly filtering for them
        if (d.isArchived) return false
      }
      
      // Date filter
      const docDate = new Date(d.uploadDate)
      if (docDate < dateRangeStart || docDate > dateRangeEnd) return false
      
      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(d.type)) return false
      
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesFileName = d.fileName?.toLowerCase().includes(query)
        const matchesVendor = d.vendor?.toLowerCase().includes(query)
        if (!matchesFileName && !matchesVendor) return false
      }
      
      return true
    })
  }, [documents, filters, dateRangeStart, dateRangeEnd, searchQuery])

  // Selected document for preview
  const selectedDoc = useMemo(() => {
    return documents.find(d => d.id === selectedDocId) || null
  }, [documents, selectedDocId])

  // Auto-select first document if none selected
  useEffect(() => {
    if (!selectedDocId && filteredDocuments.length > 0) {
      setSelectedDocId(filteredDocuments[0].id)
    } else if (selectedDocId && !filteredDocuments.find(d => d.id === selectedDocId)) {
      // Selected doc is no longer in filtered list
      setSelectedDocId(filteredDocuments[0]?.id || null)
    }
  }, [filteredDocuments, selectedDocId])

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    // Mock AI extraction - in real app this would call an API
    const newDocs = files.map((file, index) => {
      const id = `doc-new-${Date.now()}-${index}`
      // Simulate AI-extracted data
      return {
        id,
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        documentDate: new Date().toISOString().split('T')[0],
        vendor: 'Processing...', // Would be extracted by AI
        amount: null,
        type: 'incoming',
        status: 'unmatched',
        matchedTransactionId: null,
        isArchived: false,
      }
    })
    setDocuments(prev => [...newDocs, ...prev])
    // Select the first newly uploaded document
    if (newDocs.length > 0) {
      setSelectedDocId(newDocs[0].id)
    }
  }

  const handleArchive = (docId) => {
    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, isArchived: true } : d
    ))
  }

  const handleUnarchive = (docId) => {
    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, isArchived: false } : d
    ))
  }

  const handleArchiveOld = () => {
    const oldIds = oldUnmatchedDocs.map(d => d.id)
    setDocuments(prev => prev.map(d => 
      oldIds.includes(d.id) ? { ...d, isArchived: true } : d
    ))
    setShowCleanupToast(false)
  }

  // Bulk actions
  const handleBulkArchive = () => {
    setDocuments(prev => prev.map(d => 
      selectedIds.has(d.id) ? { ...d, isArchived: true } : d
    ))
    clearSelection()
  }

  // Get type indicator with color
  const getTypeIndicator = (type) => {
    const colors = {
      outgoing: 'bg-[#50942A]',
      incoming: 'bg-[#F13B3B]',
      tax: 'bg-[#FEA101]',
    }
    return (
      <div className={`w-2 h-2 rounded-full ${colors[type] || 'bg-gray-400'}`} />
    )
  }

  // Get status icon
  const getStatusIcon = (doc) => {
    if (doc.isArchived) {
      return <Archive className="w-3.5 h-3.5 text-[#8D8D8D]" />
    }
    if (doc.status === 'matched') {
      return <Check className="w-3.5 h-3.5 text-[#50942A]" />
    }
    return <AlertCircle className="w-3.5 h-3.5 text-[#FEA101]" />
  }

  // Get type label
  const getTypeLabel = (type) => {
    const labels = { outgoing: 'Outgoing Invoice', incoming: 'Receipt / Bill', tax: 'Tax Document' }
    return labels[type] || type
  }

  // Get amount color class - red for negative, green for positive
  const getAmountColorClass = (amount) => {
    if (amount === null || amount === undefined) return 'text-[#8D8D8D]'
    return amount >= 0 ? 'text-[#50942A]' : 'text-[#F13B3B]'
  }

  // Count stats
  const unmatchedCount = documents.filter(d => d.status === 'unmatched' && !d.isArchived).length
  const archivedCount = documents.filter(d => d.isArchived).length

  // Month navigation
  const handleMonthChange = (direction) => {
    const newStart = new Date(dateRangeStart)
    const newEnd = new Date(dateRangeEnd)
    newStart.setMonth(newStart.getMonth() + direction)
    newEnd.setMonth(newEnd.getMonth() + direction)
    setDateRangeStart(newStart)
    setDateRangeEnd(newEnd)
  }

  const formatMonthRange = () => {
    const startMonth = dateRangeStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const endMonth = dateRangeEnd.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    return `${startMonth} - ${endMonth}`
  }

  // Table columns (compact for split view)
  const columns = [
    {
      header: '',
      width: '32px',
      accessor: (row) => getTypeIndicator(row.type),
    },
    {
      header: 'Document',
      accessor: (row) => (
        <div className="min-w-0">
          <p className="text-13 text-[#18181A] truncate">{row.vendor || row.fileName}</p>
          <p className="text-11 text-[#8D8D8D] truncate">{formatDate(row.documentDate)}</p>
        </div>
      ),
    },
    {
      header: 'Amount',
      width: '90px',
      accessor: (row) => (
        <span className={`text-13 font-medium ${getAmountColorClass(row.amount)}`}>
          {row.amount ? formatCurrency(row.amount) : '—'}
        </span>
      ),
    },
    {
      header: '',
      width: '32px',
      accessor: (row) => getStatusIcon(row),
    },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-18 font-semibold text-[#18181A]">Documents</h1>
            <p className="text-13 text-[#656565] mt-0.5">
              {filteredDocuments.length} documents • {unmatchedCount} unmatched
              {archivedCount > 0 && ` • ${archivedCount} archived`}
            </p>
          </div>
        </div>
      </div>

      {/* Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Table */}
        <div className="w-[55%] flex flex-col border-r border-[#E8E8E8] overflow-hidden relative">
          {/* Cleanup Toast */}
          {showCleanupToast && oldUnmatchedDocs.length > 0 && filters.status.length === 0 && (
            <div className="mx-4 mt-4 p-3 bg-[#FEA101]/10 border border-[#FEA101]/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#FEA101] flex-shrink-0" />
                <p className="text-12 text-[#18181A]">
                  <span className="font-medium">{oldUnmatchedDocs.length} old receipt{oldUnmatchedDocs.length > 1 ? 's' : ''}</span>
                  <span className="text-[#656565]"> — over 60 days, unmatched</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCleanupToast(false)}
                  className="text-11 text-[#8D8D8D] hover:text-[#656565] transition-colors px-2 py-1"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleArchiveOld}
                  className="text-11 font-medium text-[#4D5FFF] hover:text-[#4D5FFF]/80 transition-colors px-2 py-1"
                >
                  Archive
                </button>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8D8D8D] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full h-8 pl-8 pr-3 bg-white border border-[#E8E8E8] rounded-sm text-13 text-[#18181A] placeholder:text-[#8D8D8D] hover:border-[#D1D5DB] focus:border-[#4D5FFF] focus:ring-2 focus:ring-focus-ring focus:outline-none transition-all duration-[120ms]"
              />
            </div>

            {/* Right: Filters & Date */}
            <div className="flex items-center gap-2">
              {/* Filter Panel */}
              <DocumentFilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                isOpen={filterPanelOpen}
                onOpenChange={setFilterPanelOpen}
              />

              {/* Divider */}
              <div className="w-px h-5 bg-[#E8E8E8]" />

              {/* Date Range */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F0F0F0] transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#8D8D8D]" />
                </button>
                <button
                  onClick={() => setIsDateRangeOpen(true)}
                  className="h-8 px-2.5 flex items-center gap-1.5 rounded-sm border border-[#E8E8E8] bg-white hover:bg-[#F0F0F0] text-[#656565] transition-colors"
                >
                  <span className="text-12 font-medium">{formatMonthRange()}</span>
                </button>
                <button
                  onClick={() => handleMonthChange(1)}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F0F0F0] transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#8D8D8D]" />
                </button>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="flex-1 overflow-auto px-4">
            <div className="bg-white rounded-lg border border-[#E8E8E8] h-full">
              <Table
                columns={columns}
                data={filteredDocuments}
                emptyMessage="No documents found"
                onRowClick={(row) => setSelectedDocId(row.id)}
                activeRowId={selectedDocId}
                selectable
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            </div>
          </div>

          {/* Drag and Drop Zone - Bottom */}
          <div className="p-4 pt-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg cursor-pointer transition-all
                flex items-center justify-center gap-3 py-3 px-4
                ${isDragOver 
                  ? 'border-[#4D5FFF] bg-[#F7F9FF]' 
                  : 'border-[#E8E8E8] hover:border-[#BBBBBB] hover:bg-[#F0F0F0]/50'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDragOver ? 'bg-[#EDF2FF]' : 'bg-[#F0F0F0]'
              }`}>
                <Upload className={`w-4 h-4 ${isDragOver ? 'text-[#4D5FFF]' : 'text-[#8D8D8D]'}`} />
              </div>
              <div>
                <p className={`text-13 font-medium ${isDragOver ? 'text-[#4D5FFF]' : 'text-[#18181A]'}`}>
                  {isDragOver ? 'Drop files here' : 'Drop files or click to upload'}
                </p>
                <p className="text-11 text-[#8D8D8D]">Single receipts or monthly exports</p>
              </div>
            </div>
          </div>

          {/* Floating Action Panel for Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a2e] text-white rounded-lg shadow-md px-4 py-3 flex items-center gap-4">
              <span className="text-13 font-medium">
                {selectedIds.size} selected
              </span>
              <div className="w-px h-4 bg-white/20" />
              <button
                onClick={handleBulkArchive}
                className="flex items-center gap-1.5 text-13 hover:text-white/80 transition-colors"
              >
                <Archive className="w-4 h-4" />
                Archive
              </button>
              <button
                onClick={clearSelection}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Document Preview */}
        <div className="w-[45%] flex flex-col bg-[#F0F0F0]/30 overflow-hidden">
          {selectedDoc ? (
            <>
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-[#E8E8E8] bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIndicator(selectedDoc.type)}
                    <div>
                      <h2 className="text-14 font-semibold text-[#18181A]">{selectedDoc.vendor || 'Unknown Vendor'}</h2>
                      <p className="text-12 text-[#8D8D8D]">{getTypeLabel(selectedDoc.type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-[#8D8D8D] hover:text-[#656565] hover:bg-[#F0F0F0] rounded transition-colors" title="Expand">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs Row with Archive Button */}
              <div className="px-6 bg-white border-b border-[#E8E8E8]">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`py-3 text-13 font-medium border-b-2 transition-colors ${
                        activeTab === 'preview'
                          ? 'text-[#4D5FFF] border-[#4D5FFF]'
                          : 'text-[#8D8D8D] border-transparent hover:text-[#656565]'
                      }`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setActiveTab('data')}
                      className={`py-3 text-13 font-medium border-b-2 transition-colors ${
                        activeTab === 'data'
                          ? 'text-[#4D5FFF] border-[#4D5FFF]'
                          : 'text-[#8D8D8D] border-transparent hover:text-[#656565]'
                      }`}
                    >
                      Extracted Data
                    </button>
                  </div>
                  {/* Archive/Restore Button */}
                  {selectedDoc.isArchived ? (
                    <button
                      onClick={() => handleUnarchive(selectedDoc.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-12 font-medium text-[#656565] hover:text-[#18181A] hover:bg-[#F0F0F0] rounded transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => handleArchive(selectedDoc.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-12 font-medium text-[#656565] hover:text-[#18181A] hover:bg-[#F0F0F0] rounded transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      Archive
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-auto p-6">
                {activeTab === 'preview' ? (
                  /* Preview Tab - Document Display */
                  <div className="bg-white rounded-lg border border-[#E8E8E8] shadow-sm overflow-hidden h-full">
                    <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-8">
                      {/* Mock Invoice/Receipt */}
                      <div className="w-full max-w-[300px] bg-white rounded shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="w-20 h-5 bg-gray-200 rounded mb-2" />
                            <div className="w-28 h-3 bg-gray-100 rounded" />
                          </div>
                          <div className="text-right">
                            <p className="text-10 text-[#8D8D8D] uppercase tracking-wide mb-1">
                              {selectedDoc.type === 'outgoing' ? 'Invoice' : selectedDoc.type === 'tax' ? 'Tax Document' : 'Receipt'}
                            </p>
                            <p className="text-11 font-medium text-[#656565]">{formatDate(selectedDoc.documentDate)}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-11 text-[#8D8D8D] mb-1">From</p>
                          <p className="text-13 font-medium text-[#18181A]">{selectedDoc.vendor || 'Unknown'}</p>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-4 mb-4">
                          <div className="w-full h-3 bg-gray-100 rounded mb-2" />
                          <div className="w-3/4 h-3 bg-gray-100 rounded mb-2" />
                          <div className="w-1/2 h-3 bg-gray-100 rounded" />
                        </div>

                        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                          <span className="text-11 font-medium text-[#656565]">Total</span>
                          <span className={`text-16 font-semibold ${getAmountColorClass(selectedDoc.amount)}`}>
                            {selectedDoc.amount ? formatCurrency(selectedDoc.amount) : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Extracted Data Tab */
                  <div className="bg-white rounded-lg border border-[#E8E8E8] p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-11 text-[#8D8D8D] mb-1">Vendor</p>
                        <p className="text-13 text-[#18181A] font-medium">{selectedDoc.vendor || '—'}</p>
                      </div>
                      <div>
                        <p className="text-11 text-[#8D8D8D] mb-1">Document Date</p>
                        <p className="text-13 text-[#18181A] font-medium">{formatDate(selectedDoc.documentDate)}</p>
                      </div>
                      <div>
                        <p className="text-11 text-[#8D8D8D] mb-1">Amount</p>
                        <p className={`text-13 font-medium ${getAmountColorClass(selectedDoc.amount)}`}>
                          {selectedDoc.amount ? formatCurrency(selectedDoc.amount) : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-11 text-[#8D8D8D] mb-1">Type</p>
                        <div className="flex items-center gap-1.5">
                          {getTypeIndicator(selectedDoc.type)}
                          <p className="text-13 text-[#18181A] font-medium capitalize">{selectedDoc.type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#E8E8E8] pt-4">
                      <p className="text-11 text-[#8D8D8D] mb-1">File</p>
                      <p className="text-13 text-[#18181A]">{selectedDoc.fileName}</p>
                      <p className="text-11 text-[#8D8D8D] mt-1">Uploaded {formatDate(selectedDoc.uploadDate)}</p>
                    </div>

                    {/* Status */}
                    <div className="border-t border-[#E8E8E8] pt-4">
                      <p className="text-11 text-[#8D8D8D] mb-2">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedDoc)}
                        <span className="text-13 text-[#18181A] font-medium capitalize">
                          {selectedDoc.isArchived ? 'Archived' : selectedDoc.status}
                        </span>
                        {selectedDoc.status === 'matched' && selectedDoc.matchedTransactionId && (
                          <button className="ml-auto flex items-center gap-1 text-12 text-[#4D5FFF] hover:underline">
                            <Link2 className="w-3.5 h-3.5" />
                            View transaction
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-[#BBBBBB] mx-auto mb-3" />
                <p className="text-14 text-[#8D8D8D]">Select a document to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date Range Picker Modal */}
      {isDateRangeOpen && (
        <DateRangePicker
          startDate={dateRangeStart}
          endDate={dateRangeEnd}
          onStartChange={setDateRangeStart}
          onEndChange={setDateRangeEnd}
          onClose={() => setIsDateRangeOpen(false)}
        />
      )}
    </div>
  )
}

export default DocumentsPage
