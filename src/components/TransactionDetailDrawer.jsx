import React, { useState, useEffect, useMemo, useRef } from 'react'
import { X, Search, ChevronRight, Upload, FileText, Unlink, Check, ZoomIn, ZoomOut, ArrowLeft } from 'lucide-react'
import { formatCurrency, banks, allCategories, getAICategorySuggestions, formatCategoryBreadcrumb, getBestMatch, mockReceipts } from '../data/mockData'

// Detail row component
const DetailRow = ({ label, children }) => {
  return (
    <div className="flex justify-between items-center py-3 px-4 border-b border-[#E8E8E8] last:border-b-0">
      <span className="text-13 text-[#8D8D8D]">{label}</span>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  )
}

// Toggle switch component
const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${
        checked ? 'bg-[#4D5FFF]' : 'bg-[#E8E8E8]'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

// Receipt suggestion card component
const ReceiptSuggestionCard = ({ receipt, isSelected, onClick, index }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg text-left transition-colors ${
        isSelected 
          ? 'border border-[#4D5FFF] bg-[#F7F9FF]' 
          : 'border border-[#E8E8E8] hover:border-[#BBBBBB] bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail placeholder */}
        <div className="w-10 h-10 rounded bg-[#F0F0F0] flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-[#8D8D8D]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-13 font-medium text-[#18181A] truncate">{receipt.vendorName}</span>
            {receipt.isTopRecommendation && (
              <span className="px-1.5 py-0.5 bg-[#4D5FFF]/10 text-[#4D5FFF] text-10 font-medium rounded">
                Best match
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-12 text-[#656565]">{formatCurrency(receipt.amount)}</span>
            <span className="text-12 text-[#8D8D8D]">·</span>
            <span className="text-12 text-[#8D8D8D]">{receipt.invoiceNumber}</span>
          </div>
          {/* Match reasons */}
          {receipt.matchReasons && receipt.matchReasons.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {receipt.matchReasons.slice(0, 2).map((reason, idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-[#F0F0F0] text-[#656565] text-10 rounded">
                  {reason.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

// Upload zone component
const UploadZone = ({ onFileSelect, uploadedFile, onRemoveFile }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  if (uploadedFile) {
    return (
      <div className="flex items-center justify-between p-3 bg-[#F0F0F0] rounded-lg">
        <div className="flex items-center gap-2 min-w-0">
          <Upload className="w-4 h-4 text-[#8D8D8D] flex-shrink-0" />
          <span className="text-13 text-[#18181A] truncate">{uploadedFile.name}</span>
        </div>
        <button
          onClick={onRemoveFile}
          className="text-12 text-[#8D8D8D] hover:text-[#F13B3B] flex-shrink-0"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-[#4D5FFF] bg-[#F7F9FF]'
          : 'border-[#E8E8E8] hover:border-[#BBBBBB]'
      }`}
    >
      <Upload className={`w-6 h-6 mx-auto mb-2 ${isDragging ? 'text-[#4D5FFF]' : 'text-[#8D8D8D]'}`} />
      <p className="text-13 text-[#18181A] mb-0.5">Upload receipt or invoice</p>
      <p className="text-12 text-[#8D8D8D]">Drag and drop or click to browse</p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

// Format number for German locale
const formatGermanNumber = (num) => {
  if (num === '' || num === null || num === undefined) return ''
  const number = typeof num === 'string' ? parseFloat(num.replace(',', '.')) : num
  if (isNaN(number)) return ''
  return number.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Parse German number string to float
const parseGermanNumber = (str) => {
  if (!str) return 0
  return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0
}

const TransactionDetailDrawer = ({ 
  transaction, 
  isOpen, 
  onClose,
  onCategorySelect,
  onPrivateToggle,
  onReceiptSelect,
  onConfirmDetails
}) => {
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedFilePreviewUrl, setUploadedFilePreviewUrl] = useState(null)
  const [internalNote, setInternalNote] = useState('')
  const [selectedReceiptId, setSelectedReceiptId] = useState(null)
  const [receiptSearch, setReceiptSearch] = useState('')
  const [receiptSearchHighlightedIndex, setReceiptSearchHighlightedIndex] = useState(0)
  const [noReceiptMarked, setNoReceiptMarked] = useState(false)
  
  // Tax details state
  const [netAmount, setNetAmount] = useState('')
  const [taxRate, setTaxRate] = useState('19')
  const [taxAmount, setTaxAmount] = useState('')
  
  // Preview state
  const [previewZoom, setPreviewZoom] = useState(1)
  
  const categoryInputRef = useRef(null)
  const noteInputRef = useRef(null)
  const receiptSearchInputRef = useRef(null)
  
  // Get selected receipt object
  const selectedReceipt = useMemo(() => {
    if (!selectedReceiptId) return null
    return mockReceipts.find(r => r.id === selectedReceiptId) || null
  }, [selectedReceiptId])
  
  // Determine if split view should be shown
  const showSplitView = !isPrivate && (selectedReceiptId || uploadedFile)
  
  // Sync local state with transaction
  useEffect(() => {
    if (transaction) {
      setIsPrivate(transaction.isPrivate || false)
      // Find the category object if transaction has a category
      if (transaction.category) {
        const cat = allCategories.find(c => c.label === transaction.category)
        setSelectedCategory(cat || null)
      } else {
        setSelectedCategory(null)
      }
      setUploadedFile(null)
      setUploadedFilePreviewUrl(null)
      setInternalNote('')
      setSelectedReceiptId(null)
      setReceiptSearch('')
      setNoReceiptMarked(false)
      setNetAmount('')
      setTaxRate('19')
      setTaxAmount('')
      setPreviewZoom(1)
    }
  }, [transaction])

  // Auto-populate tax details when receipt is selected
  useEffect(() => {
    if (selectedReceipt) {
      const amount = selectedReceipt.amount || 0
      const rate = 19 // Default tax rate
      const net = amount / (1 + rate / 100)
      const tax = amount - net
      
      setNetAmount(formatGermanNumber(net))
      setTaxRate('19')
      setTaxAmount(formatGermanNumber(tax))
    } else if (uploadedFile) {
      // For uploaded files, use transaction amount as basis
      if (transaction) {
        const amount = Math.abs(transaction.amount)
        const rate = 19
        const net = amount / (1 + rate / 100)
        const tax = amount - net
        
        setNetAmount(formatGermanNumber(net))
        setTaxRate('19')
        setTaxAmount(formatGermanNumber(tax))
      }
    }
  }, [selectedReceipt, uploadedFile, transaction])

  // Create preview URL for uploaded file
  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile)
      setUploadedFilePreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setUploadedFilePreviewUrl(null)
    }
  }, [uploadedFile])

  // Recalculate tax amount when net amount or rate changes
  const handleNetAmountChange = (value) => {
    setNetAmount(value)
    const net = parseGermanNumber(value)
    const rate = parseFloat(taxRate) || 0
    const tax = net * (rate / 100)
    setTaxAmount(formatGermanNumber(tax))
  }

  const handleTaxRateChange = (value) => {
    setTaxRate(value)
    const net = parseGermanNumber(netAmount)
    const rate = parseFloat(value) || 0
    const tax = net * (rate / 100)
    setTaxAmount(formatGermanNumber(tax))
  }

  // Auto-focus category field when drawer opens (if not private and no category selected)
  useEffect(() => {
    if (isOpen && transaction && !isPrivate && !selectedCategory) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setShowCategoryPicker(true)
        setHighlightedIndex(0)
        if (categoryInputRef.current) {
          categoryInputRef.current.focus()
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, transaction?.id])

  // Auto-focus note input when category is selected
  useEffect(() => {
    if (selectedCategory && noteInputRef.current) {
      noteInputRef.current.focus()
    }
  }, [selectedCategory])

  // Handle ESC key to close drawer or dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showCategoryPicker) {
          setShowCategoryPicker(false)
          setCategorySearch('')
        } else if (isOpen) {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, showCategoryPicker])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (showCategoryPicker && categoryInputRef.current) {
      categoryInputRef.current.focus()
    }
  }, [showCategoryPicker])
  
  // Get AI suggestions for current transaction
  const aiSuggestions = useMemo(() => {
    if (!transaction) return []
    return getAICategorySuggestions(transaction)
  }, [transaction])

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return allCategories
    const query = categorySearch.toLowerCase()
    return allCategories.filter(cat => cat.label.toLowerCase().includes(query))
  }, [categorySearch])

  // Get matching receipts for current transaction
  const { bestMatch, otherMatches, partialMatches } = useMemo(() => {
    if (!transaction) return { bestMatch: null, otherMatches: [], partialMatches: [] }
    return getBestMatch(transaction)
  }, [transaction])

  // Get top 3 suggested receipts
  const suggestedReceipts = useMemo(() => {
    const receipts = []
    if (bestMatch) receipts.push({ ...bestMatch, isTopRecommendation: true })
    const others = [...otherMatches, ...partialMatches]
    others.forEach(r => {
      if (receipts.length < 3) receipts.push({ ...r, isTopRecommendation: false })
    })
    return receipts
  }, [bestMatch, otherMatches, partialMatches])

  // Filter receipts based on search
  const filteredReceipts = useMemo(() => {
    if (!receiptSearch.trim()) return []
    const query = receiptSearch.toLowerCase()
    return mockReceipts.filter(r => !r.matched && (
      r.vendorName.toLowerCase().includes(query) ||
      r.invoiceNumber.toLowerCase().includes(query)
    )).slice(0, 5)
  }, [receiptSearch])

  // Reset highlighted index when receipt search changes
  useEffect(() => {
    setReceiptSearchHighlightedIndex(0)
    if (receiptSearch.trim() && filteredReceipts.length > 0) {
      setSelectedReceiptId(filteredReceipts[0].id)
    }
  }, [receiptSearch])

  if (!isOpen || !transaction) return null
  
  // Determine counterparty based on transaction direction
  const isIncome = transaction.amount >= 0
  const counterparty = isIncome ? transaction.sender : transaction.recipient
  
  // Format the date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Handle private toggle
  const handlePrivateToggle = (value) => {
    setIsPrivate(value)
    onPrivateToggle?.(transaction.id, value)
  }

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setShowCategoryPicker(false)
    setCategorySearch('')
    onCategorySelect?.(transaction.id, category)
  }

  // Handle clearing category
  const handleClearCategory = (e) => {
    e.stopPropagation()
    setSelectedCategory(null)
    setInternalNote('')
    onCategorySelect?.(transaction.id, null)
  }

  // Handle receipt selection
  const handleReceiptSelect = (receiptId) => {
    setSelectedReceiptId(receiptId === selectedReceiptId ? null : receiptId)
    setReceiptSearch('')
    onReceiptSelect?.(transaction.id, receiptId)
  }

  // Handle no receipt marking
  const handleNoReceipt = () => {
    setNoReceiptMarked(true)
    setSelectedReceiptId(null)
    setReceiptSearch('')
    setUploadedFile(null)
  }

  // Handle undo no receipt
  const handleUndoNoReceipt = () => {
    setNoReceiptMarked(false)
  }

  // Handle file upload
  const handleFileUpload = (file) => {
    setUploadedFile(file)
    setSelectedReceiptId(null)
  }

  // Handle remove uploaded file
  const handleRemoveUploadedFile = () => {
    setUploadedFile(null)
    setUploadedFilePreviewUrl(null)
  }

  // Handle exit split view
  const handleExitSplitView = () => {
    setSelectedReceiptId(null)
    setUploadedFile(null)
    setUploadedFilePreviewUrl(null)
    setNetAmount('')
    setTaxRate('19')
    setTaxAmount('')
  }

  // Handle confirm details
  const handleConfirmDetails = () => {
    onConfirmDetails?.({
      transactionId: transaction.id,
      receiptId: selectedReceiptId,
      uploadedFile,
      netAmount: parseGermanNumber(netAmount),
      taxRate: parseFloat(taxRate),
      taxAmount: parseGermanNumber(taxAmount),
      category: selectedCategory,
      internalNote
    })
    onClose()
  }

  // Get mock bank data for "From" field
  const getSourceBank = () => {
    // Mock data - Sparkasse with Payroll Account
    const sparkasse = banks.find(b => b.id.includes('sparkasse')) || banks[0]
    return {
      name: sparkasse?.name || 'Sparkasse',
      logo: sparkasse?.logo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sparkasse.svg/512px-Sparkasse.svg.png',
      bgColor: sparkasse?.bgColor || '#FFF5F5',
      accountType: 'Payroll Account'
    }
  }

  const sourceBank = getSourceBank()

  // Handle keyboard navigation in category dropdown
  const handleCategoryKeyDown = (e) => {
    const items = categorySearch.trim() 
      ? filteredCategories.slice(0, 8)
      : aiSuggestions.map(s => s.category)
    const maxIndex = items.length - 1
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.min(prev + 1, maxIndex))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && items.length > 0) {
      e.preventDefault()
      handleCategorySelect(items[highlightedIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setShowCategoryPicker(false)
      setCategorySearch('')
    }
  }

  // Handle keyboard navigation in receipt search
  const handleReceiptSearchKeyDown = (e) => {
    if (!receiptSearch.trim() || filteredReceipts.length === 0) return
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newIndex = Math.min(receiptSearchHighlightedIndex + 1, filteredReceipts.length - 1)
      setReceiptSearchHighlightedIndex(newIndex)
      setSelectedReceiptId(filteredReceipts[newIndex].id)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newIndex = Math.max(receiptSearchHighlightedIndex - 1, 0)
      setReceiptSearchHighlightedIndex(newIndex)
      setSelectedReceiptId(filteredReceipts[newIndex].id)
    } else if (e.key === 'Enter' && selectedReceiptId) {
      e.preventDefault()
      handleReceiptSelect(selectedReceiptId)
    }
  }

  // Get display receipt for preview
  const displayReceipt = selectedReceipt

  return (
    <>
      {/* Backdrop or Split View Left Panel */}
      {showSplitView ? (
        /* Invoice Preview Panel (Left Side) */
        <div className="fixed inset-0 right-[420px] bg-[#1a1a1a] z-40 flex flex-col">
          {/* Preview Header */}
          <div className="p-4 border-b border-[#333] flex items-center justify-between bg-[#242424]">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExitSplitView}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#333] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#8D8D8D]" />
              </button>
              <div>
                <p className="text-14 font-semibold text-white">
                  {displayReceipt?.invoiceNumber || uploadedFile?.name || 'Document Preview'}
                </p>
                <p className="text-12 text-[#8D8D8D]">
                  {displayReceipt?.vendorName || 'Uploaded document'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleExitSplitView}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#333] transition-colors"
            >
              <X className="w-4 h-4 text-[#8D8D8D]" />
            </button>
          </div>
          
          {/* Document Preview - Scrollable */}
          <div className="flex-1 bg-[#1a1a1a] overflow-y-auto p-4 relative">
            {/* Zoom Controls */}
            <div className="sticky top-0 z-10 flex justify-center mb-4">
              <div className="flex items-center gap-1 bg-[#242424] rounded-lg shadow-md border border-[#333] p-1">
                <button
                  onClick={() => setPreviewZoom(prev => Math.max(0.5, prev - 0.25))}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#333] transition-colors"
                  disabled={previewZoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4 text-[#8D8D8D]" />
                </button>
                <span className="text-12 text-[#8D8D8D] px-2 min-w-[48px] text-center">{Math.round(previewZoom * 100)}%</span>
                <button
                  onClick={() => setPreviewZoom(prev => Math.min(2, prev + 0.25))}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#333] transition-colors"
                  disabled={previewZoom >= 2}
                >
                  <ZoomIn className="w-4 h-4 text-[#8D8D8D]" />
                </button>
              </div>
            </div>
            
            {/* Invoice Display */}
            <div 
              className="bg-white rounded-lg shadow-lg w-full max-w-[520px] mx-auto overflow-hidden origin-top transition-transform"
              style={{ transform: `scale(${previewZoom})` }}
            >
              {uploadedFilePreviewUrl ? (
                /* Uploaded file preview */
                <img 
                  src={uploadedFilePreviewUrl}
                  alt="Uploaded document"
                  className="w-full h-auto"
                />
              ) : displayReceipt?.imageUrl ? (
                /* Receipt image */
                <img 
                  src={displayReceipt.imageUrl}
                  alt={displayReceipt.vendorName}
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                /* Styled invoice placeholder */
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-10 text-[#8D8D8D] mb-1">VENDOR</div>
                      <div className="w-10 h-10 bg-[#E8E8E8] rounded flex items-center justify-center text-[#8D8D8D] text-14">📄</div>
                    </div>
                    <div className="text-right">
                      <p className="text-10 text-[#8D8D8D]">{displayReceipt?.invoiceNumber || 'INV-000'}</p>
                    </div>
                  </div>
                  
                  {/* Invoice Title */}
                  <h2 className="text-28 font-bold text-[#18181A] mb-8 tracking-tight">INVOICE</h2>
                  
                  {/* Date */}
                  <div className="mb-8">
                    <p className="text-10 text-[#8D8D8D] mb-1">Issue Date</p>
                    <p className="text-13 text-[#18181A]">{displayReceipt?.issueDate || '—'}</p>
                  </div>
                  
                  {/* Items */}
                  <div className="mb-8">
                    <div className="border-b border-[#E8E8E8] pb-2 mb-2">
                      <div className="flex justify-between text-10 text-[#8D8D8D]">
                        <span>Description</span>
                        <span>Amount</span>
                      </div>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-13 text-[#18181A]">Services</span>
                      <span className="text-13 text-[#18181A]">{formatCurrency(displayReceipt?.amount || 0)}</span>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="border-t-2 border-[#18181A] pt-4">
                    <div className="flex justify-between">
                      <span className="text-16 font-bold text-[#18181A]">Total</span>
                      <span className="text-16 font-bold text-[#18181A]">{formatCurrency(displayReceipt?.amount || 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Regular Backdrop */
        <div 
          className="fixed inset-0 bg-black/16 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-[420px] bg-white shadow-md z-50 flex flex-col overflow-hidden animate-slide-in-right rounded-l-lg">
        {/* Header - only close button */}
        <div className="flex items-center justify-end px-4 py-4 border-b border-[#E8E8E8]">
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-[#8D8D8D] hover:text-[#18181A] hover:bg-[#F0F0F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto px-4 pt-6 pb-4">
          <div className="flex flex-col gap-6">
            {/* Transaction Summary */}
            <div className="flex flex-col items-center gap-2">
              {/* Avatar/Icon placeholder */}
              <div className="w-[48px] h-[48px] rounded-xl bg-[#F5F5F5] border border-[#E8E8E8] flex items-center justify-center">
                <span className="text-16 font-semibold text-[#8D8D8D]">
                  {counterparty?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              
              {/* Amount */}
              <div className="flex flex-col items-center gap-0.5">
                <span className={`text-16 font-semibold leading-6 ${
                  isIncome ? 'text-[#2A531E]' : 'text-[#86340F]'
                }`}>
                  {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                </span>
                
                {/* Counterparty and date */}
                <div className="flex flex-col items-center gap-0">
                  <span className="text-13 font-medium text-[#18181A]">
                    {counterparty}
                  </span>
                  <span className="text-13 text-[#8D8D8D]">
                    {formatDateTime(transaction.date)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Details Table - simplified to Reference and From */}
            <div className="rounded-lg border border-[#E8E8E8] overflow-hidden">
              <DetailRow label="Reference">
                <span className="text-13 text-[#18181A] font-medium">{transaction.reference || '—'}</span>
              </DetailRow>
              <DetailRow label="From">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center overflow-hidden border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: sourceBank.bgColor }}
                  >
                    <img 
                      src={sourceBank.logo} 
                      alt={sourceBank.name}
                      className="w-3.5 h-3.5 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                  <span className="text-13 text-[#18181A] font-medium">{sourceBank.name}</span>
                  <span className="text-13 text-[#8D8D8D]">{sourceBank.accountType}</span>
                </div>
              </DetailRow>
            </div>

            {/* Mark as Private Toggle - moved above category */}
            <div className="rounded-lg border border-[#E8E8E8] overflow-hidden">
              <div className="flex justify-between items-center py-3 px-4">
                <span className="text-13 text-[#18181A]">Mark as private</span>
                <ToggleSwitch 
                  checked={isPrivate}
                  onChange={handlePrivateToggle}
                />
              </div>
            </div>

            {/* Category Search Field - hidden when private */}
            {!isPrivate && (
              <div className="relative">
                <label className="text-12 text-[#8D8D8D] mb-2 block">Category</label>
                <button
                  onClick={() => {
                    if (!selectedCategory) {
                      setShowCategoryPicker(true)
                      setHighlightedIndex(0)
                    }
                  }}
                  onKeyDown={(e) => {
                    // Type-to-search: any printable character opens dropdown and starts search
                    if (!selectedCategory && !e.metaKey && !e.ctrlKey && e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/)) {
                      e.preventDefault()
                      setCategorySearch(e.key)
                      setHighlightedIndex(0)
                      setShowCategoryPicker(true)
                    }
                  }}
                  className={`w-full p-3 bg-[#F8F9FF] border border-[#E8EBFF] rounded-lg transition-colors text-left ${
                    selectedCategory 
                      ? 'cursor-default' 
                      : 'hover:border-[#4D5FFF] hover:bg-[#F0F2FF] focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring focus:outline-none'
                  }`}
                >
                  {selectedCategory ? (
                    <div className="flex items-center gap-3">
                      <span className="text-18">{selectedCategory.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-14 font-medium text-[#18181A] block">
                          {selectedCategory.label}
                        </span>
                        {selectedCategory.path?.length > 1 && (
                          <span className="text-10 text-[#8D8D8D] block truncate mt-0.5">
                            {formatCategoryBreadcrumb(selectedCategory)}
                          </span>
                        )}
                      </div>
                      {/* Clear button */}
                      <button
                        onClick={handleClearCategory}
                        className="p-1 rounded-sm text-[#8D8D8D] hover:text-[#18181A] hover:bg-[#E8E8E8] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-[#8D8D8D]" />
                      <span className="text-14 text-[#8D8D8D]">Search categories...</span>
                    </div>
                  )}
                </button>

                {/* Category Dropdown */}
                {showCategoryPicker && (
                  <>
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-lg shadow-md z-50">
                      {/* Search */}
                      <div className="p-3 border-b border-[#E8E8E8]">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8D8D]" />
                          <input
                            ref={categoryInputRef}
                            type="text"
                            value={categorySearch}
                            onChange={(e) => {
                              setCategorySearch(e.target.value)
                              setHighlightedIndex(0)
                            }}
                            onKeyDown={handleCategoryKeyDown}
                            placeholder="Search categories..."
                            className="w-full h-9 pl-9 pr-3 bg-[#F0F0F0] border border-[#E8E8E8] rounded-sm text-14 text-[#18181A] placeholder:text-[#8D8D8D] focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                      
                      {/* Suggestions or search results */}
                      <div className="max-h-64 overflow-y-auto">
                        {!categorySearch.trim() ? (
                          // Show AI suggestions
                          <div className="p-2">
                            <p className="text-11 text-[#8D8D8D] px-2 py-1 mb-1">Suggestions</p>
                            {aiSuggestions.map((suggestion, index) => (
                              <button
                                key={suggestion.category.id}
                                onClick={() => handleCategorySelect(suggestion.category)}
                                className={`w-full p-2.5 rounded-md flex items-center gap-2.5 transition-colors text-left ${
                                  highlightedIndex === index ? 'bg-[#E8E8E8]' : 'hover:bg-[#F0F0F0]'
                                }`}
                              >
                                <span className="text-16">{suggestion.category.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <span className="text-13 text-[#18181A] block">{suggestion.category.label}</span>
                                  {suggestion.category?.path?.length > 1 && (
                                    <span className="text-10 text-[#8D8D8D] block truncate">
                                      {formatCategoryBreadcrumb(suggestion.category)}
                                    </span>
                                  )}
                                </div>
                                <span className="text-10 text-[#8D8D8D]">{suggestion.confidence}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          // Show search results
                          <div className="p-2">
                            {filteredCategories.slice(0, 8).map((category, index) => (
                              <button
                                key={category.id}
                                onClick={() => handleCategorySelect(category)}
                                className={`w-full p-2.5 rounded-md flex items-center gap-2.5 transition-colors text-left ${
                                  highlightedIndex === index ? 'bg-[#E8E8E8]' : 'hover:bg-[#F0F0F0]'
                                }`}
                              >
                                <span className="text-16">{category.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <span className="text-13 text-[#18181A] block">{category.label}</span>
                                  {category?.path?.length > 1 && (
                                    <span className="text-10 text-[#8D8D8D] block truncate">
                                      {formatCategoryBreadcrumb(category)}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                            {filteredCategories.length === 0 && (
                              <p className="text-13 text-[#8D8D8D] text-center py-4">No categories found</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => {
                        setShowCategoryPicker(false)
                        setCategorySearch('')
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {/* Internal Note - only visible when category is selected and not private */}
            {!isPrivate && selectedCategory && (
              <div>
                <label className="text-12 text-[#8D8D8D] mb-2 block">Internal Note</label>
                <input
                  ref={noteInputRef}
                  type="text"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add internal note..."
                  className="w-full h-10 px-3 bg-white border border-[#D9D9D9] rounded-lg text-14 text-[#18181A] placeholder:text-[#8D8D8D] hover:border-[#BBBBBB] focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring focus:outline-none transition-all"
                />
              </div>
            )}

            {/* Receipt/Invoice Section - hidden when private */}
            {!isPrivate && (
              <div>
                <label className="text-12 text-[#8D8D8D] mb-2 block">Receipt / Invoice</label>
                
                {/* No Receipt Marked State */}
                {noReceiptMarked ? (
                  <div className="p-4 bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#E8E8E8] flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#656565]" />
                        </div>
                        <div>
                          <p className="text-13 font-medium text-[#18181A]">No receipt available</p>
                          <p className="text-12 text-[#8D8D8D]">Flagged for tax advisor</p>
                        </div>
                      </div>
                      <button
                        onClick={handleUndoNoReceipt}
                        className="text-12 text-[#4D5FFF] hover:text-[#3D4FEF] font-medium"
                      >
                        Undo
                      </button>
                    </div>
                  </div>
                ) : showSplitView ? (
                  /* Linked Receipt State (when in split view) */
                  <div className="p-3 bg-[#F7F9FF] border border-[#4D5FFF] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#F0F0F0] flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-[#8D8D8D]" />
                        </div>
                        <div>
                          {displayReceipt ? (
                            <>
                              <p className="text-13 font-medium text-[#18181A]">{displayReceipt.vendorName}</p>
                              <p className="text-12 text-[#8D8D8D]">{displayReceipt.invoiceNumber}</p>
                            </>
                          ) : uploadedFile ? (
                            <>
                              <p className="text-13 font-medium text-[#18181A]">{uploadedFile.name}</p>
                              <p className="text-12 text-[#8D8D8D]">Uploaded document</p>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <button
                        onClick={handleExitSplitView}
                        className="text-12 text-[#4D5FFF] hover:text-[#3D4FEF] font-medium"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Receipt Search and Selection */
                  <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8D8D]" />
                      <input
                        ref={receiptSearchInputRef}
                        type="text"
                        value={receiptSearch}
                        onChange={(e) => setReceiptSearch(e.target.value)}
                        onKeyDown={handleReceiptSearchKeyDown}
                        placeholder="Search existing receipts..."
                        className="w-full h-10 pl-10 pr-9 bg-white border border-[#D9D9D9] rounded-lg text-14 text-[#18181A] placeholder:text-[#8D8D8D] hover:border-[#BBBBBB] focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring focus:outline-none transition-all"
                      />
                      {receiptSearch && (
                        <button
                          onClick={() => setReceiptSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#8D8D8D] hover:text-[#18181A]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Search Results */}
                    {receiptSearch.trim() && (
                      <div className="space-y-2">
                        {filteredReceipts.length > 0 ? (
                          filteredReceipts.map((receipt, index) => (
                            <button
                              key={receipt.id}
                              onClick={() => handleReceiptSelect(receipt.id)}
                              className={`w-full p-3 rounded-lg text-left transition-colors ${
                                selectedReceiptId === receipt.id || receiptSearchHighlightedIndex === index
                                  ? 'border border-[#4D5FFF] bg-[#F7F9FF]' 
                                  : 'border border-[#E8E8E8] hover:border-[#BBBBBB] bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded bg-[#F0F0F0] flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-[#8D8D8D]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-13 font-medium text-[#18181A] block truncate">{receipt.vendorName}</span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-12 text-[#656565]">{formatCurrency(receipt.amount)}</span>
                                    <span className="text-12 text-[#8D8D8D]">·</span>
                                    <span className="text-12 text-[#8D8D8D]">{receipt.invoiceNumber}</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="text-13 text-[#8D8D8D] text-center py-4">No receipts found</p>
                        )}
                      </div>
                    )}

                    {/* Suggested Receipts - show when not searching */}
                    {!receiptSearch.trim() && suggestedReceipts.length > 0 && (
                      <div>
                        <p className="text-11 text-[#8D8D8D] mb-2">Suggested matches</p>
                        <div className="space-y-2">
                          {suggestedReceipts.map((receipt, index) => (
                            <ReceiptSuggestionCard
                              key={receipt.id}
                              receipt={receipt}
                              isSelected={selectedReceiptId === receipt.id}
                              onClick={() => handleReceiptSelect(receipt.id)}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload Zone */}
                    {!receiptSearch.trim() && (
                      <div>
                        <p className="text-11 text-[#8D8D8D] mb-2">
                          {suggestedReceipts.length > 0 ? 'Or upload manually' : 'Upload'}
                        </p>
                        <UploadZone
                          onFileSelect={handleFileUpload}
                          uploadedFile={uploadedFile}
                          onRemoveFile={handleRemoveUploadedFile}
                        />
                      </div>
                    )}

                    {/* I don't have a receipt button */}
                    {!receiptSearch.trim() && (
                      <button
                        onClick={handleNoReceipt}
                        className="w-full py-2.5 px-3 text-13 text-[#8D8D8D] hover:text-[#18181A] hover:bg-[#F0F0F0] rounded-lg transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-[#E8E8E8]"
                      >
                        <Unlink className="w-4 h-4" />
                        I don't have a receipt
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tax Details Section - only visible when receipt is selected or file uploaded */}
            {showSplitView && (
              <div className="rounded-lg border border-[#E8E8E8] overflow-hidden bg-[#1a1a1a]">
                <div className="grid grid-cols-3">
                  {/* Net Amount */}
                  <div className="p-4 border-r border-[#333]">
                    <label className="text-11 text-[#8D8D8D] block mb-2">Betrag ohne MwSt.</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={netAmount}
                        onChange={(e) => handleNetAmountChange(e.target.value)}
                        className="w-full bg-transparent text-white text-14 font-medium focus:outline-none"
                        placeholder="0,00"
                      />
                      <span className="text-14 text-white ml-1">€</span>
                    </div>
                  </div>
                  
                  {/* Tax Rate */}
                  <div className="p-4 border-r border-[#333]">
                    <label className="text-11 text-[#8D8D8D] block mb-2">MwSt.-Satz</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={taxRate}
                        onChange={(e) => handleTaxRateChange(e.target.value)}
                        className="w-full bg-transparent text-white text-14 font-medium focus:outline-none"
                        placeholder="19"
                      />
                      <span className="text-14 text-white ml-1">%</span>
                    </div>
                  </div>
                  
                  {/* Tax Amount */}
                  <div className="p-4">
                    <label className="text-11 text-[#8D8D8D] block mb-2">MwSt.-Betrag</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={taxAmount}
                        onChange={(e) => setTaxAmount(e.target.value)}
                        className="w-full bg-transparent text-white text-14 font-medium focus:outline-none"
                        placeholder="0,00"
                      />
                      <span className="text-14 text-white ml-1">€</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Button - sticky at bottom when in split view */}
        {showSplitView && (
          <div className="p-4 bg-white border-t border-[#E8E8E8]">
            <button
              onClick={handleConfirmDetails}
              className="w-full py-3 bg-[#4D5FFF] hover:bg-[#3D4FEF] text-white rounded-lg font-medium text-14 transition-colors"
            >
              Confirm Details
            </button>
          </div>
        )}
      </div>
      
      {/* Animation styles */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

export default TransactionDetailDrawer
