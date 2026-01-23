import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Tags, Check, ChevronLeft, ChevronRight, Search, ArrowRight, Upload, ZoomIn, ZoomOut, Download, FileText, Paperclip, ArrowLeft, Plus, Info, Eye, X, Unlink } from 'lucide-react'
import { Button, Table, Badge, Dropdown, Checkbox } from './ui'
import { formatCurrency, formatDate, getBankName, allCategories, getAICategorySuggestions, taxRates, banks, formatCategoryBreadcrumb, getFullCategoryPath, mockReceipts, getMatchingReceipts, getBestMatch } from '../data/mockData'

// Sample receipt images for demo
const sampleReceipts = {
  1: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop', // Invoice style
  2: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop', // Receipt
  5: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop', // Document
  7: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
  8: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
  10: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop',
  11: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
  12: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
  14: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop',
}

const CategorizationFlow = ({ transactions = [], onComplete }) => {
  // ============ REFS ============
  const categoryButtonRef = useRef(null)
  const taxRateInputRef = useRef(null)
  const noteInputRef = useRef(null)
  const confirmButtonRef = useRef(null)
  const splitPercentageRefs = useRef([])
  const documentSearchInputRef = useRef(null)
  const splitCategoryDropdownRef = useRef(null)
  
  // ============ STATE DECLARATIONS (must come first) ============
  
  // Flow state: 'entry' | 'reviewing' | 'success'
  const [flowState, setFlowState] = useState('reviewing')
  const [showEntryModal, setShowEntryModal] = useState(true) // Show modal on entry
  const [currentIndex, setCurrentIndex] = useState(0)
  const [skippedIds, setSkippedIds] = useState([])
  const [categorizedTransactions, setCategorizedTransactions] = useState({})
  
  // Filter state for browse mode
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBank, setSelectedBank] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('uncategorized') // 'all' | 'uncategorized'
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  
  // Multi-select state for bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set())
  
  // ============ MEMOS & COMPUTED VALUES ============
  
  // Parse selected month
  const selectedMonthDate = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number)
    return { year, month: month - 1 } // JS months are 0-indexed
  }, [selectedMonth])
  
  // Format month for display
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-').map(Number)
    return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }
  
  // Month navigation
  const goToPreviousMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const date = new Date(year, month - 2, 1)
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  }
  
  const goToNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const date = new Date(year, month, 1)
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  }
  
  const isCurrentMonth = () => {
    const now = new Date()
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return selectedMonth === current
  }
  
  // Filter transactions by month
  const monthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === selectedMonthDate.month &&
             transactionDate.getFullYear() === selectedMonthDate.year
    })
  }, [transactions, selectedMonthDate])
  
  // Filter to uncategorized transactions only (for the review flow)
  const uncategorizedTransactions = useMemo(() => 
    monthTransactions.filter(t => !t.category),
    [monthTransactions]
  )
  
  // Filtered transactions for the table (with search, bank filter, category filter)
  const filteredTransactions = useMemo(() => {
    return monthTransactions.filter(t => {
      // Category filter
      if (categoryFilter === 'uncategorized' && t.category) return false
      
      // Bank filter
      if (selectedBank !== 'all' && t.bankId !== selectedBank) return false
      
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const searchFields = [
          t.sender,
          t.recipient,
          t.reference,
          t.category,
          String(Math.abs(t.amount))
        ].filter(Boolean).map(s => s.toLowerCase())
        
        if (!searchFields.some(field => field.includes(query))) return false
      }
      
      return true
    })
  }, [monthTransactions, categoryFilter, selectedBank, searchQuery])
  
  // Current transaction state
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0) // For dropdown keyboard nav
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [note, setNote] = useState('')
  const [taxRate, setTaxRate] = useState(null) // null = not set, will be filled from invoice or manually
  const [taxRateInput, setTaxRateInput] = useState('') // Empty by default
  const [netAmountInput, setNetAmountInput] = useState('') // Empty by default
  const [categorySearch, setCategorySearch] = useState('')
  const [receiptZoom, setReceiptZoom] = useState(1)
  const [receiptSearch, setReceiptSearch] = useState('')
  const [selectedReceiptId, setSelectedReceiptId] = useState(null)
  const [previewingReceiptId, setPreviewingReceiptId] = useState(null)
  const [searchHighlightedIndex, setSearchHighlightedIndex] = useState(0)
  
  // Two-phase flow: after category confirmation, enter document linking phase
  const [isDocumentLinkingPhase, setIsDocumentLinkingPhase] = useState(false)
  const [showMatchSuccessToast, setShowMatchSuccessToast] = useState(false)
  const [lastMatchedReceiptId, setLastMatchedReceiptId] = useState(null)
  const [isLeftPanelFocused, setIsLeftPanelFocused] = useState(false)
  const [showLinkedToast, setShowLinkedToast] = useState(false)
  const [showDocumentOverview, setShowDocumentOverview] = useState(false) // When true, show card overview instead of preview
  const [connectedToastPhase, setConnectedToastPhase] = useState(null) // 'loading' | 'ready' | null
  
  // Split categories state (inline, replaces category section)
  const [showSplitMode, setShowSplitMode] = useState(false)
  const [splitItems, setSplitItems] = useState([
    { id: 1, percentage: 50, category: null },
    { id: 2, percentage: 50, category: null }
  ])
  const [splitCategoryPickerIndex, setSplitCategoryPickerIndex] = useState(null)
  const [splitCategorySearch, setSplitCategorySearch] = useState('')
  const [splitHighlightedIndex, setSplitHighlightedIndex] = useState(0)
  const splitCategorySearchRef = useRef(null)
  
  // Get current transaction
  const currentTransaction = uncategorizedTransactions[currentIndex]
  
  // Get AI suggestions for current transaction
  const aiSuggestions = useMemo(() => {
    if (!currentTransaction) return []
    return getAICategorySuggestions(currentTransaction)
  }, [currentTransaction])
  
  // Get matching receipts for current transaction with best match separation
  const { bestMatch, otherMatches, partialMatches, allMatches } = useMemo(() => {
    if (!currentTransaction) return { bestMatch: null, otherMatches: [], partialMatches: [], allMatches: [] }
    const result = getBestMatch(currentTransaction)
    return { ...result, allMatches: getMatchingReceipts(currentTransaction) }
  }, [currentTransaction])
  
  // Get top 3 suggested receipts for display (best match first, then others)
  const suggestedReceipts = useMemo(() => {
    const receipts = []
    if (bestMatch) receipts.push({ ...bestMatch, isTopRecommendation: true })
    const others = [...otherMatches, ...partialMatches]
    others.forEach(r => {
      if (receipts.length < 3) receipts.push({ ...r, isTopRecommendation: false })
    })
    return receipts
  }, [bestMatch, otherMatches, partialMatches])
  
  // Get receipt being previewed
  const previewingReceipt = useMemo(() => {
    if (!previewingReceiptId) return null
    return mockReceipts.find(r => r.id === previewingReceiptId) || null
  }, [previewingReceiptId])
  
  
  // Calculate net amount based on tax rate
  const calculateNetAmount = (grossAmount, taxPercent) => {
    return grossAmount / (1 + taxPercent / 100)
  }
  
  // Calculate tax rate from gross and net
  const calculateTaxRate = (grossAmount, netAmount) => {
    if (netAmount === 0) return 0
    return ((grossAmount / netAmount) - 1) * 100
  }
  
  // Handle tax rate input change
  const handleTaxRateChange = (value) => {
    setTaxRateInput(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setTaxRate(numValue)
      // Update net amount based on new tax rate
      if (currentTransaction) {
        const newNet = calculateNetAmount(Math.abs(currentTransaction.amount), numValue)
        setNetAmountInput(newNet.toFixed(2))
      }
    }
  }
  
  // Handle net amount input change
  const handleNetAmountChange = (value) => {
    setNetAmountInput(value)
    const numValue = parseFloat(value.replace(',', '.'))
    if (!isNaN(numValue) && numValue > 0 && currentTransaction) {
      const grossAmount = Math.abs(currentTransaction.amount)
      const newTaxRate = calculateTaxRate(grossAmount, numValue)
      if (newTaxRate >= 0 && newTaxRate <= 100) {
        setTaxRate(newTaxRate)
        setTaxRateInput(newTaxRate.toFixed(1))
      }
    }
  }
  
  // Initialize fields when transaction changes
  useEffect(() => {
    if (currentTransaction) {
      // Check if transaction has receipt with prefilled values (mock: some transactions have attachments)
      const hasReceiptData = currentTransaction.hasAttachment && currentTransaction.id % 3 === 0 // Mock: every 3rd with attachment has data
      
      if (hasReceiptData) {
        // Prefill from receipt data (mock values)
        const mockTaxRate = 19
        setTaxRate(mockTaxRate)
        setTaxRateInput(String(mockTaxRate))
        setNetAmountInput(calculateNetAmount(Math.abs(currentTransaction.amount), mockTaxRate).toFixed(2))
      } else {
        // Leave empty - user must fill
        setTaxRate(null)
        setTaxRateInput('')
        setNetAmountInput('')
      }
      
      setSelectedReceiptId(null)
      setReceiptSearch('')
    }
  }, [currentTransaction?.id])
  
  // Progress tracking
  const totalToReview = uncategorizedTransactions.length
  const reviewed = currentIndex
  const remaining = totalToReview - currentIndex
  
  // Auto-focus category button when entering review mode or new transaction
  useEffect(() => {
    if (flowState === 'reviewing' && !showCategoryPicker && !showSplitMode) {
      // Focus category button on new transaction
      const timer = setTimeout(() => {
        categoryButtonRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [flowState, currentIndex, showSplitMode])
  
  // Auto-focus first split percentage when entering split mode
  useEffect(() => {
    if (showSplitMode) {
      const timer = setTimeout(() => {
        splitPercentageRefs.current[0]?.focus()
        splitPercentageRefs.current[0]?.select()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [showSplitMode])
  
  // Auto-focus split category search when dropdown opens
  useEffect(() => {
    if (splitCategoryPickerIndex !== null) {
      setSplitHighlightedIndex(0)
      const timer = setTimeout(() => {
        splitCategorySearchRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      // Reset search when dropdown closes
      setSplitCategorySearch('')
    }
  }, [splitCategoryPickerIndex])
  
  // Click-outside handler for split category dropdown
  useEffect(() => {
    if (splitCategoryPickerIndex === null) return
    
    const handleClickOutside = (e) => {
      if (splitCategoryDropdownRef.current && !splitCategoryDropdownRef.current.contains(e.target)) {
        setSplitCategoryPickerIndex(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [splitCategoryPickerIndex])
  
  // Reset split highlighted index when search changes
  useEffect(() => {
    setSplitHighlightedIndex(0)
  }, [splitCategorySearch])
  
  // Reset highlighted index and auto-select first result when typing in receipt search
  useEffect(() => {
    setSearchHighlightedIndex(0)
    if (receiptSearch.trim()) {
      const filteredReceipts = mockReceipts.filter(r => !r.matched && (
        r.vendorName.toLowerCase().includes(receiptSearch.toLowerCase()) ||
        r.invoiceNumber.toLowerCase().includes(receiptSearch.toLowerCase())
      ))
      if (filteredReceipts.length > 0) {
        setSelectedReceiptId(filteredReceipts[0].id)
      }
    }
  }, [receiptSearch])
  
  // Auto-focus document search input and auto-select first document when entering document linking phase
  useEffect(() => {
    if (isDocumentLinkingPhase && suggestedReceipts.length > 0) {
      // Auto-select the first suggested document
      setSelectedReceiptId(suggestedReceipts[0].id)
      // Focus search input after a brief delay
      const timer = setTimeout(() => {
        documentSearchInputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isDocumentLinkingPhase, suggestedReceipts])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isAlt = e.altKey
      
      // Prevent Mac special characters for all Option+letter shortcuts we use
      // Must be called BEFORE any conditions to prevent character insertion
      const optionShortcuts = ['r', 'c', 'l', 's', 'n', 'z', 'v', 'm', 'p', 'Enter']
      if (isAlt && optionShortcuts.includes(e.key)) {
        e.preventDefault()
      }
      
      // Start reviewing shortcut (⌥R) - works in entry state
      if (flowState === 'entry' && !showEntryModal && isAlt && e.key === 'r') {
        if (totalToReview > 0) {
          handleStartReview()
        }
        return
      }
      
      // Enter key to start review from entry modal
      if (flowState === 'entry' && showEntryModal && e.key === 'Enter') {
        e.preventDefault()
        if (totalToReview > 0) {
          handleStartReview()
        }
        return
      }
      
      if (flowState !== 'reviewing') return
      
      // Escape key always works - close various modals/states
      if (e.key === 'Escape') {
        e.preventDefault()
        if (previewingReceiptId) {
          setPreviewingReceiptId(null)
        } else if (showCategoryPicker) {
          setShowCategoryPicker(false)
          setCategorySearch('')
        } else if (splitCategoryPickerIndex !== null) {
          setSplitCategoryPickerIndex(null)
        } else if (showSplitMode) {
          setShowSplitMode(false)
        }
        return
      }
      
      if (showCategoryPicker) return // Don't capture other shortcuts when dropdown is open
      
      if (isAlt && e.key === 'Enter') {
        e.preventDefault()
        if (showSplitMode) {
          // Confirm split if all conditions are met
          if (getTotalSplitPercentage() === 100 && splitItems.every(i => i.category)) {
            handleSplitConfirm()
          }
        } else if (isTaxRateValid()) {
          // Only confirm if tax rate is valid (button not disabled)
          handleConfirm()
        }
      } else if (isAlt && e.key === 'c') {
        e.preventDefault()
        setShowCategoryPicker(true)
      } else if (isAlt && e.key === 'l' && !isDocumentLinkingPhase) {
        // Later ⌥L (during categorization phase)
        handleSkip()
      } else if (isAlt && e.key === 's') {
        e.preventDefault()
        // Toggle split mode inline
        if (showSplitMode) {
          setShowSplitMode(false)
        } else {
          setShowSplitMode(true)
          setSplitCategoryPickerIndex(null)  // Ensure dropdown is closed
          setSplitCategorySearch('')          // Clear any search
          setSplitItems([
            { id: 1, percentage: 50, category: aiSuggestions[0]?.category || null },
            { id: 2, percentage: 50, category: null }
          ])
        }
      } else if (showCategoryPicker && e.key >= '1' && e.key <= '3') {
        e.preventDefault()
        const index = parseInt(e.key) - 1
        if (aiSuggestions[index]) {
          handleCategorySelect(aiSuggestions[index].category)
        }
      } else if (!isAlt && e.key >= '1' && e.key <= '3' && isDocumentLinkingPhase && !receiptSearch.trim() && !showMatchSuccessToast && !isLeftPanelFocused) {
        // Select document with 1, 2, 3 (without ⌥) in document linking phase
        // Only when not focused on left panel inputs
        const activeTag = document.activeElement?.tagName?.toLowerCase()
        if (activeTag === 'input' || activeTag === 'textarea') {
          return // Let the input handle the number
        }
        e.preventDefault()
        const index = parseInt(e.key) - 1
        if (suggestedReceipts[index]) {
          setSelectedReceiptId(suggestedReceipts[index].id)
        }
      } else if (isAlt && e.key === 'l' && isDocumentLinkingPhase) {
        // Later ⌥L
        handleSkipDocumentLinking()
      } else if (isAlt && e.key === 'n' && isDocumentLinkingPhase) {
        // I don't have a receipt ⌥N - flags for tax advisor
        e.preventDefault()
        console.log('Marked as no receipt - flagged for tax advisor')
        moveToNext()
      } else if (isAlt && e.key === 'z' && showMatchSuccessToast) {
        // Undo match ⌥Z
        e.preventDefault()
        handleUndoMatch()
      } else if (isAlt && e.key === 'v' && !previewingReceiptId) {
        // View document shortcut ⌥V
        const receiptToView = selectedReceiptId || (suggestedReceipts[0]?.isTopRecommendation ? suggestedReceipts[0].id : null)
        if (receiptToView) {
          setPreviewingReceiptId(receiptToView)
        }
      } else if (isAlt && e.key === 'm') {
        // Match document shortcut ⌥M
        if (!selectedReceiptId && suggestedReceipts[0]?.isTopRecommendation) {
          setSelectedReceiptId(suggestedReceipts[0].id)
        }
        if (selectedReceiptId || suggestedReceipts[0]?.isTopRecommendation) {
          handleMatchReceipt()
          setPreviewingReceiptId(null)
        }
      } else if (isAlt && e.key === 'p') {
        // Mark as private ⌥P
        handleMarkAsPrivate()
      } else if (!isAlt && e.key === 'Enter' && selectedReceiptId && !receiptSearch.trim() && !previewingReceiptId) {
        // Enter opens preview when a suggested document is selected
        // Skip if an input is focused (let the input handle it)
        const activeTag = document.activeElement?.tagName?.toLowerCase()
        if (activeTag === 'input' || activeTag === 'textarea') {
          return
        }
        e.preventDefault()
        setPreviewingReceiptId(selectedReceiptId)
      } else if (!isAlt && e.key === 'n' && currentMatchedReceipt) {
        // 'n' continues to next when document is matched
        e.preventDefault()
        setIsDocumentLinkingPhase(false)
        setShowLinkedToast(false)
        setConnectedToastPhase(null)
        moveToNext()
      } else if (!isAlt && (e.key === 'ArrowDown' || e.key === 'ArrowUp') && !receiptSearch.trim() && suggestedReceipts.length > 0 && !previewingReceiptId) {
        // Arrow navigation for suggested documents
        // Skip if an input is focused (let the input handle it)
        const activeTag = document.activeElement?.tagName?.toLowerCase()
        if (activeTag === 'input' || activeTag === 'textarea') {
          return
        }
        e.preventDefault()
        const currentIndex = suggestedReceipts.findIndex(r => r.id === selectedReceiptId)
        let newIndex
        if (e.key === 'ArrowDown') {
          newIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % suggestedReceipts.length
        } else {
          newIndex = currentIndex < 0 ? 0 : (currentIndex - 1 + suggestedReceipts.length) % suggestedReceipts.length
        }
        setSelectedReceiptId(suggestedReceipts[newIndex].id)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [flowState, showCategoryPicker, showSplitMode, aiSuggestions, showEntryModal, totalToReview, suggestedReceipts, selectedReceiptId, previewingReceiptId, receiptSearch, currentTransaction, isDocumentLinkingPhase, showMatchSuccessToast])
  
  // Start the review flow
  const handleStartReview = () => {
    setFlowState('reviewing')
    setCurrentIndex(0)
  }
  
  // Confirm current suggestion
  // Check if tax rate is valid
  const isTaxRateValid = () => {
    const num = parseFloat(taxRateInput)
    return !isNaN(num) && num >= 0 && num <= 100
  }
  
  // Check if net amount exceeds gross amount (warning)
  const isNetExceedingGross = () => {
    if (!currentTransaction) return false
    const netNum = parseFloat(netAmountInput.replace(',', '.'))
    const grossAmount = Math.abs(currentTransaction.amount)
    return !isNaN(netNum) && netNum > grossAmount
  }
  
  const handleConfirm = () => {
    const categoryToSave = selectedCategory || aiSuggestions[0]?.category
    if (!currentTransaction || !categoryToSave) return
    
    // Validate tax rate is filled
    if (!isTaxRateValid()) {
      return
    }
    
    setCategorizedTransactions(prev => ({
      ...prev,
      [currentTransaction.id]: {
        category: categoryToSave,
        note,
        taxRate,
        rememberRule: false
      }
    }))
    
    // Reset selectedCategory for next transaction
    setSelectedCategory(null)
    
    // Enter document linking phase instead of moving to next
    setIsDocumentLinkingPhase(true)
    setIsLeftPanelFocused(false) // Reset left panel focus
    setShowMatchSuccessToast(false)
  }
  
  // Review later (during category phase)
  const handleSkip = () => {
    if (!currentTransaction) return
    setSkippedIds(prev => [...prev, currentTransaction.id])
    moveToNext()
  }
  
  // Mark transaction as private and move to next
  const handleMarkAsPrivate = () => {
    if (!currentTransaction) return
    // Auto-categorize as "Private" and move to next
    setCategorizedTransactions(prev => ({
      ...prev,
      [currentTransaction.id]: {
        category: 'Private',
        taxRate: 0,
        note: 'Marked as private expense',
        isPrivate: true
      }
    }))
    moveToNext()
  }
  
  // Skip document linking and move to next transaction
  const handleSkipDocumentLinking = () => {
    setIsDocumentLinkingPhase(false)
    setShowMatchSuccessToast(false)
    moveToNext()
  }
  
  // Undo the last match
  const handleUndoMatch = () => {
    if (!currentTransaction || !lastMatchedReceiptId) return
    
    // Remove the match
    setMatchedReceipts(prev => {
      const newMatches = { ...prev }
      delete newMatches[currentTransaction.id]
      return newMatches
    })
    
    setShowMatchSuccessToast(false)
    setLastMatchedReceiptId(null)
    setSelectedReceiptId(null)
  }
  
  // Select a category - now just updates the display, user must manually confirm
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setShowCategoryPicker(false)
    setCategorySearch('')
    // Focus tax rate input after category selection
    setTimeout(() => {
      taxRateInputRef.current?.focus()
      taxRateInputRef.current?.select()
    }, 50)
  }
  
  // Handle split category selection
  const handleSplitCategorySelect = (category, index) => {
    setSplitItems(prev => prev.map((item, i) => 
      i === index ? { ...item, category } : item
    ))
    setSplitCategoryPickerIndex(null)
    // Focus the percentage input for this row
    setTimeout(() => {
      splitPercentageRefs.current[index]?.focus()
      splitPercentageRefs.current[index]?.select()
    }, 50)
  }
  
  // Add a new split item
  const addSplitItem = () => {
    const newId = Math.max(...splitItems.map(i => i.id)) + 1
    setSplitItems(prev => [...prev, { id: newId, percentage: 0, category: null }])
  }
  
  // Remove a split item
  const removeSplitItem = (id) => {
    if (splitItems.length <= 2) return
    setSplitItems(prev => prev.filter(item => item.id !== id))
  }
  
  // Update split percentage with auto-balance for 2 items
  const updateSplitPercentage = (id, percentage) => {
    const numValue = parseFloat(percentage) || 0
    const clampedValue = Math.min(100, Math.max(0, numValue))
    
    setSplitItems(prev => {
      // For 2 items, auto-balance the other one
      if (prev.length === 2) {
        return prev.map(item => 
          item.id === id 
            ? { ...item, percentage: clampedValue }
            : { ...item, percentage: 100 - clampedValue }
        )
      }
      // For 3+ items, just update the single item
      return prev.map(item => 
        item.id === id ? { ...item, percentage: clampedValue } : item
      )
    })
  }
  
  // Get total split percentage
  const getTotalSplitPercentage = () => {
    return splitItems.reduce((sum, item) => sum + item.percentage, 0)
  }
  
  // Confirm split categories
  const handleSplitConfirm = () => {
    if (!currentTransaction) return
    if (getTotalSplitPercentage() !== 100) return
    if (splitItems.some(item => !item.category)) return
    
    setCategorizedTransactions(prev => ({
      ...prev,
      [currentTransaction.id]: {
        splits: splitItems.map(item => ({
          category: item.category,
          percentage: item.percentage,
          amount: (Math.abs(currentTransaction.amount) * item.percentage / 100)
        })),
        note,
        taxRate,
        isSplit: true
      }
    }))
    
    setShowSplitModal(false)
    moveToNext()
  }
  
  // Match selected receipt to current transaction
  const [matchedReceipts, setMatchedReceipts] = useState({}) // transactionId -> receiptId
  
  const handleMatchReceipt = () => {
    if (!currentTransaction || !selectedReceiptId) return
    
    const matchedId = selectedReceiptId
    
    setMatchedReceipts(prev => ({
      ...prev,
      [currentTransaction.id]: matchedId
    }))
    
    // Track for undo
    setLastMatchedReceiptId(matchedId)
    
    // Clear selection after matching
    setSelectedReceiptId(null)
    
    // Show the linked toast with animation
    setShowLinkedToast(true)
    setTimeout(() => setShowLinkedToast(false), 2000)
    
    // Automatically open document preview after matching
    setPreviewingReceiptId(matchedId)
  }
  
  // Get the currently matched receipt for display
  const currentMatchedReceipt = useMemo(() => {
    if (!currentTransaction) return null
    const receiptId = matchedReceipts[currentTransaction.id]
    if (!receiptId) return null
    return mockReceipts.find(r => r.id === receiptId)
  }, [currentTransaction, matchedReceipts])
  
  // Determine which receipt to display in preview and if it's already matched
  const displayReceipt = previewingReceipt || (currentMatchedReceipt && !showDocumentOverview ? currentMatchedReceipt : null)
  const isDisplayingMatchedReceipt = !previewingReceipt && currentMatchedReceipt && !showDocumentOverview
  
  // Show connected toast when viewing matched document
  useEffect(() => {
    if (isDisplayingMatchedReceipt) {
      setConnectedToastPhase('loading')
      const timer = setTimeout(() => {
        setConnectedToastPhase('ready')
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setConnectedToastPhase(null)
    }
  }, [isDisplayingMatchedReceipt])
  
  // Move to next transaction
  const moveToNext = () => {
    setNote('')
    setTaxRate(null)
    setTaxRateInput('')
    setNetAmountInput('')
    setReceiptZoom(1)
    setIsDocumentLinkingPhase(false)
    setShowMatchSuccessToast(false)
    setLastMatchedReceiptId(null)
    setShowSplitMode(false)
    setShowDocumentOverview(false)
    setConnectedToastPhase(null)
    
    if (currentIndex + 1 >= totalToReview) {
      setFlowState('success')
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }
  
  // Get receipt URL for current transaction
  const getReceiptUrl = (transaction) => {
    if (!transaction?.hasAttachment) return null
    return sampleReceipts[transaction.id] || null
  }
  
  // Filter categories for search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return allCategories
    const query = categorySearch.toLowerCase()
    return allCategories.filter(c => c.label.toLowerCase().includes(query))
  }, [categorySearch])
  
  // Filter categories for split category search
  const filteredSplitCategories = useMemo(() => {
    if (!splitCategorySearch.trim()) return allCategories.slice(0, 12)
    const query = splitCategorySearch.toLowerCase()
    return allCategories.filter(c => c.label.toLowerCase().includes(query)).slice(0, 12)
  }, [splitCategorySearch])
  
  // Get counterparty (the other party in the transaction)
  const getCounterparty = (t) => t.amount >= 0 ? t.sender : t.recipient
  
  // Table columns for the background view
  // Selection helpers
  const isAllSelected = filteredTransactions.length > 0 && filteredTransactions.every(t => selectedIds.has(t.id))
  const isSomeSelected = filteredTransactions.some(t => selectedIds.has(t.id))
  
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredTransactions.map(t => t.id)))
    }
  }
  
  const toggleSelectRow = (id, e) => {
    if (e) e.stopPropagation()
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }
  
  const handleBulkCategorize = () => {
    // TODO: Open category picker modal for bulk categorization
    console.log('Bulk categorize:', Array.from(selectedIds))
  }
  
  const clearSelection = () => {
    setSelectedIds(new Set())
  }
  
  const tableColumns = [
    { 
      header: (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={isAllSelected}
            indeterminate={isSomeSelected && !isAllSelected}
            onChange={toggleSelectAll}
          />
        </div>
      ),
      accessor: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={selectedIds.has(row.id)}
            onChange={() => toggleSelectRow(row.id)}
          />
        </div>
      ),
      width: '40px'
    },
    { 
      header: 'Date', 
      accessor: (row) => formatDate(row.date),
      width: '100px'
    },
    { 
      header: 'Counterparty', 
      accessor: (row) => row.amount >= 0 ? row.sender : row.recipient
    },
    { 
      header: 'Reference', 
      accessor: (row) => row.reference || '-'
    },
    { 
      header: 'Amount', 
      accessor: (row) => (
        <span className={row.amount >= 0 ? 'text-[#50942A]' : 'text-[#F13B3B]'}>
          {row.amount >= 0 ? '+' : ''}{formatCurrency(row.amount)}
        </span>
      ),
      align: 'right'
    },
    { 
      header: 'Category', 
      accessor: (row) => (
        row.category 
          ? <Badge>{row.category}</Badge>
          : <span className="text-[#8D8D8D] italic">Uncategorized</span>
      )
    }
  ]
  
  // ============ ENTRY STATE ============
  if (flowState === 'entry') {
    // Get the month name for display
    const monthName = new Date(selectedMonthDate.year, selectedMonthDate.month, 1)
      .toLocaleDateString('en-US', { month: 'long' })
    
    // If no uncategorized transactions for this month, show cheerful success state
    if (totalToReview === 0) {
      return (
        <div className="flex flex-col h-full">
          {/* Header with Month Picker */}
          <div className="bg-white border-b border-[#E8E8E8]">
            <div className="px-3 py-2.5 flex items-center justify-between">
              <h1 className="text-14 font-medium text-[#18181A]">Categorization</h1>
              
              {/* Month Picker */}
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPreviousMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F0F0F0] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-[#656565]" />
                </button>
                <div className="px-2 py-1.5 min-w-[70px] text-center">
                  <span className="text-14 font-medium text-[#18181A]">
                    {formatMonth(selectedMonth)}
                  </span>
                </div>
                <button
                  onClick={goToNextMonth}
                  disabled={isCurrentMonth()}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                    isCurrentMonth() 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-[#F0F0F0]'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 text-[#656565]" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Content - Cheerful Success Empty State */}
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-bg-base to-bg-secondary">
            <div className="max-w-md text-center">
              {/* Celebratory icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] flex items-center justify-center shadow-sm">
                <Check className="w-10 h-10 text-[#50942A]" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-22 font-semibold text-[#18181A] mb-2">
                All done for {monthName}!
              </h2>
              <p className="text-15 text-[#656565] mb-2">
                Every transaction is categorized.
              </p>
              <p className="text-14 text-[#8D8D8D] mb-8">
                You're on top of your finances. 🎉
              </p>
              
              <Button variant="secondary" icon={ArrowLeft} onClick={() => onComplete?.()}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )
    }
    
    // Bank options for dropdown
    const bankOptions = [
      { value: 'all', label: 'All banks' },
      ...banks.map(b => ({ value: b.id, label: b.name }))
    ]
    
    // Category filter options
    const categoryOptions = [
      { value: 'uncategorized', label: 'Uncategorized' },
      { value: 'all', label: 'All' }
    ]
    
    return (
      <div className="flex flex-col h-full relative">
        {/* Header Row - Title + Month Picker */}
        <div className="bg-white border-b border-[#E8E8E8]">
          <div className="px-3 py-2.5 flex items-center justify-between">
            <div className="px-1">
              <h1 className="text-14 font-medium text-[#18181A]">Categorization</h1>
            </div>
            
            {/* Month Picker */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousMonth}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F0F0F0] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#656565]" />
              </button>
              <div className="px-2 py-1.5 min-w-[70px] text-center">
                <span className="text-14 font-medium text-[#18181A]">
                  {formatMonth(selectedMonth)}
                </span>
              </div>
              <button
                onClick={goToNextMonth}
                disabled={isCurrentMonth()}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                  isCurrentMonth() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#F0F0F0]'
                }`}
              >
                <ChevronRight className="w-4 h-4 text-[#656565]" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Transactions Content */}
        <div className={`flex-1 overflow-auto p-6 ${showEntryModal ? 'pointer-events-none' : ''}`}>
          {/* Filter Bar - Search left, Filters right */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Search */}
            <div className="relative max-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8D8D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full h-9 pl-9 pr-3 bg-white border border-[#E8E8E8] rounded-sm text-14 text-[#18181A] placeholder:text-[#8D8D8D] focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {/* Category Filter */}
              <Dropdown
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categoryOptions}
              />
              
              {/* Bank Filter */}
              <Dropdown
                value={selectedBank}
                onChange={setSelectedBank}
                options={bankOptions}
              />
            </div>
          </div>
          
          {/* Transactions heading with Start reviewing button */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-14 font-medium text-[#18181A]">Transactions ({filteredTransactions.length})</h2>
            
            {/* Show Start reviewing button if there are uncategorized transactions */}
            {totalToReview > 0 && (
              <Button 
                size="sm" 
                onClick={handleStartReview}
                icon={ArrowRight}
              >
                Start reviewing ({totalToReview}) <span className="text-12 opacity-80 ml-1">⌥R</span>
              </Button>
            )}
          </div>
          <Table
            columns={tableColumns}
            data={filteredTransactions}
            onRowClick={(row) => toggleSelectRow(row.id)}
          />
        </div>
        
        {/* Floating Selection Bar - appears at bottom when rows are selected */}
        {selectedIds.size > 0 && !showEntryModal && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl shadow-md border border-[#E8E8E8]">
              {/* Selection count */}
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 border border-dashed border-text-tertiary rounded-xs" />
                <span className="text-13 font-medium text-[#18181A]">
                  {selectedIds.size} Item{selectedIds.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2 ml-2">
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
                <Button size="sm" onClick={handleBulkCategorize}>
                  Categorize
                </Button>
              </div>
              
              {/* Close button */}
              <button 
                onClick={clearSelection}
                className="ml-1 p-1 text-[#8D8D8D] hover:text-[#656565] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4L10 10M10 4L4 10" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Foreground: Entry Modal Overlay - covers everything */}
        {showEntryModal && (
          <>
            {/* Dark semi-transparent backdrop - covers entire content area */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
            
            {/* Modal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-xl shadow-md border border-[#E8E8E8] p-8 max-w-md pointer-events-auto">
                <div className="text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#F0F2FF] flex items-center justify-center">
                    <Tags className="w-8 h-8 text-[#4D5FFF]" />
                  </div>
                  
                  <h2 className="text-20 font-semibold text-[#18181A] mb-2">
                    {totalToReview} transaction{totalToReview !== 1 ? 's' : ''} need{totalToReview === 1 ? 's' : ''} your input
                  </h2>
                  <p className="text-14 text-[#656565] mb-8">
                    We've auto-categorized most of your transactions based on attached receipts. These few need a quick review to help the system learn.
                  </p>
                  
                  <Button onClick={handleStartReview} icon={ArrowRight} className="w-full justify-center">
                    Start reviewing
                  </Button>
                  
                  <p className="text-12 text-[#8D8D8D] mt-4 mb-4">
                    Takes about {Math.ceil(totalToReview * 0.5)} minute{totalToReview > 2 ? 's' : ''}
                  </p>
                  
                  <button
                    onClick={() => setShowEntryModal(false)}
                    className="text-13 text-[#8D8D8D] hover:text-[#656565] transition-colors"
                  >
                    Browse list instead
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
  
  // ============ SUCCESS STATE ============
  if (flowState === 'success') {
    const categorizedCount = Object.keys(categorizedTransactions).length
    const skippedCount = skippedIds.length
    
    // Get month name for display
    const monthName = new Date(selectedMonthDate.year, selectedMonthDate.month, 1)
      .toLocaleDateString('en-US', { month: 'long' })
    
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-[#E8E8E8]">
          <div className="px-6 py-3 flex items-center justify-between">
            <h1 className="text-14 font-medium text-[#18181A]">Categorization</h1>
          </div>
        </div>
        
        {/* Content - Cheerful Success */}
        <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-bg-base to-bg-secondary">
          <div className="max-w-md text-center">
            {/* Celebratory checkmark */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] flex items-center justify-center shadow-sm">
              <Check className="w-10 h-10 text-[#50942A]" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-22 font-semibold text-[#18181A] mb-3">
              Great job! 🎉
            </h2>
            <p className="text-15 text-[#656565] mb-1">
              You've categorized {categorizedCount} transaction{categorizedCount !== 1 ? 's' : ''} for {monthName}.
            </p>
            {skippedCount > 0 && (
              <p className="text-14 text-[#8D8D8D] mb-1">
                {skippedCount} skipped for later.
              </p>
            )}
            <p className="text-14 text-[#8D8D8D] mb-8">
              The system is learning from your choices.
            </p>
            
            <Button variant="secondary" icon={ArrowLeft} onClick={() => onComplete?.()}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  // ============ REVIEWING STATE ============
  if (!currentTransaction) return null
  
  const netAmount = calculateNetAmount(currentTransaction.amount, taxRate)
  const receiptUrl = getReceiptUrl(currentTransaction)
  
  return (
    <div className="flex flex-col h-full bg-[#F9F9F9] relative">
      {/* Header with progress */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-3 flex items-center relative">
          <h1 className="text-14 font-medium text-[#18181A]">Categorization</h1>
          {/* Progress bar centered over the split line (45% from left) */}
          <div className="absolute left-[45%] -translate-x-1/2">
            <div className="w-24 h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden">
              <div 
                className="h-full bg-contrast-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalToReview) * 100}%` }}
              />
            </div>
          </div>
          {/* "X left" on the right */}
          <span className="absolute right-6 text-13 text-[#8D8D8D]">
            {totalToReview - currentIndex - 1} left
          </span>
        </div>
      </div>
      
      {/* Content - Split View */}
      <div className="flex-1 flex">
        {/* Left Side - Transaction Card */}
        <div 
          className={`w-[45%] min-w-[400px] flex flex-col p-6 overflow-y-auto overflow-x-visible transition-opacity duration-200 ${
            isDocumentLinkingPhase && !isLeftPanelFocused ? 'opacity-60' : ''
          }`}
          onClick={() => {
            if (isDocumentLinkingPhase && !isLeftPanelFocused) {
              setIsLeftPanelFocused(true)
            }
          }}
        >
          <div className="flex-1 flex flex-col justify-center max-w-[480px] mx-auto w-full">
            {/* Transaction Card */}
            <div className="bg-white rounded-xl border border-[#E8E8E8] shadow-sm">
              {/* Card Header */}
              <div className="p-5 border-b border-[#E8E8E8]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-16 font-medium text-[#18181A] mb-1">
                      {getCounterparty(currentTransaction)}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-13 text-[#8D8D8D]">
                        {formatDate(currentTransaction.date)} · {getBankName(currentTransaction.bankId)}
                      </p>
                      {/* Missing receipt tag */}
                      {!currentMatchedReceipt && suggestedReceipts.length === 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F13B3B]/10 text-[#F13B3B] text-11 font-medium rounded-full">
                          <Paperclip className="w-3 h-3" />
                          Missing receipt
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-18 font-semibold ${currentTransaction.amount >= 0 ? 'text-[#50942A]' : 'text-[#F13B3B]'}`}>
                    {currentTransaction.amount >= 0 ? '+' : ''}{formatCurrency(currentTransaction.amount)}
                  </p>
                </div>
                
                {/* Reference */}
                {currentTransaction.reference && (
                  <div className="bg-[#F0F0F0] rounded-md px-3 py-2">
                    <p className="text-12 text-[#8D8D8D] mb-0.5">Reference</p>
                    <p className="text-13 text-[#656565]">{currentTransaction.reference}</p>
                  </div>
                )}
              </div>
              
              {/* Category Section - either normal view or split view */}
              <div className="px-5 py-4 border-b border-[#E8E8E8] relative">
                {!showSplitMode ? (
                  <>
                    {/* Normal Category View */}
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-12 text-[#8D8D8D]">
                        {selectedCategory ? 'Selected category' : 'Suggested category'}
                      </label>
                      {!selectedCategory && (
                        <span className={`text-10 px-1.5 py-0.5 rounded-full ${
                          aiSuggestions[0]?.confidence === 'High confidence' 
                            ? 'bg-[#E8F5E9] text-[#50942A]' 
                            : 'bg-[#FFF8E1] text-[#F59E0B]'
                        }`}>
                          {aiSuggestions[0]?.confidence}
                        </span>
                      )}
                    </div>
                
                {/* Category display - clickable to open picker */}
                <button 
                  ref={categoryButtonRef}
                  onClick={() => setShowCategoryPicker(true)}
                  onKeyDown={(e) => {
                    // ⌥+Enter confirms immediately
                    if (e.altKey && e.key === 'Enter') {
                      e.preventDefault()
                      if (isTaxRateValid()) {
                        handleConfirm()
                      }
                      return
                    }
                    // Enter opens dropdown
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setShowCategoryPicker(true)
                      return
                    }
                    // Type-to-search: any printable character (except with Cmd) opens dropdown and starts search
                    if (!e.metaKey && !e.ctrlKey && e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/)) {
                      e.preventDefault()
                      setCategorySearch(e.key)
                      setHighlightedIndex(0)
                      setShowCategoryPicker(true)
                    }
                  }}
                  className="w-full p-3 bg-[#F8F9FF] border border-[#E8EBFF] rounded-lg hover:border-contrast-primary hover:bg-[#F0F2FF] focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring focus:outline-none transition-colors text-left"
                  title={getFullCategoryPath((selectedCategory || aiSuggestions[0]?.category))}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-20">{(selectedCategory || aiSuggestions[0]?.category)?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-14 font-medium text-[#18181A] block">
                        {(selectedCategory || aiSuggestions[0]?.category)?.label}
                      </span>
                      {/* Breadcrumb path */}
                      {(selectedCategory || aiSuggestions[0]?.category)?.path?.length > 1 && (
                        <span className="text-10 text-[#8D8D8D] block truncate mt-0.5">
                          {formatCategoryBreadcrumb(selectedCategory || aiSuggestions[0]?.category)}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8D8D8D] flex-shrink-0" />
                  </div>
                </button>
                
                {/* Inline Category Dropdown */}
                {showCategoryPicker && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E8E8E8] rounded-lg shadow-md z-50">
                    {/* Search */}
                    <div className="p-3 border-b border-[#E8E8E8]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8D8D]" />
                        <input
                          type="text"
                          value={categorySearch}
                          onChange={(e) => {
                            setCategorySearch(e.target.value)
                            setHighlightedIndex(0) // Reset to first item when typing
                          }}
                          onKeyDown={(e) => {
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
                          }}
                          placeholder="Search categories..."
                          className="w-full h-9 pl-9 pr-3 bg-[#F0F0F0] border border-[#E8E8E8] rounded-sm text-14 text-[#18181A] placeholder:text-[#8D8D8D] focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring focus:outline-none transition-all"
                          autoFocus
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
                              <span className="text-10 text-[#8D8D8D]">{index + 1}</span>
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
                )}
                
                    {/* Backdrop to close dropdown */}
                    {showCategoryPicker && (
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => {
                          setShowCategoryPicker(false)
                          setCategorySearch('')
                        }}
                      />
                    )}
                  </>
                ) : (
                  /* Split Mode - Inline Split UI */
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-12 text-[#8D8D8D]">Split transaction</label>
                      <button 
                        onClick={() => setShowSplitMode(false)}
                        className="text-10 text-[#8D8D8D] hover:text-[#656565]"
                      >
                        Cancel
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {splitItems.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2 p-2.5 bg-[#F0F0F0] rounded-lg">
                          {/* Category picker - now first */}
                          <button
                            onClick={() => setSplitCategoryPickerIndex(splitCategoryPickerIndex === index ? null : index)}
                            onKeyDown={(e) => {
                              // Type-to-search: if user types a letter, open dropdown and start searching
                              if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && /[a-zA-Z0-9]/.test(e.key)) {
                                e.preventDefault()
                                setSplitCategorySearch(e.key)
                                setSplitCategoryPickerIndex(index)
                              } else if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setSplitCategoryPickerIndex(splitCategoryPickerIndex === index ? null : index)
                              }
                            }}
                            tabIndex={index === 0 ? -1 : undefined}
                            className="flex-1 min-h-[44px] px-2.5 py-1.5 bg-white border border-[#E8E8E8] rounded-sm text-left transition-colors flex items-center gap-2 hover:border-[#BBBBBB] focus:border-[#4D5FFF] focus:ring-2 focus:ring-focus-ring focus:outline-none overflow-hidden"
                          >
                            {item.category ? (
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-14 flex-shrink-0">{item.category.icon}</span>
                                <div className="min-w-0">
                                  <span className="text-13 text-[#18181A] block truncate">{item.category.label}</span>
                                  {item.category.path?.length > 1 && (
                                    <span className="text-10 text-[#8D8D8D] block truncate">
                                      {formatCategoryBreadcrumb(item.category)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-13 text-[#8D8D8D]">Select category...</span>
                            )}
                          </button>
                          
                          {/* Percentage input - now second */}
                          <div className="w-16 flex-shrink-0">
                            <div className="relative">
                              <input
                                ref={el => splitPercentageRefs.current[index] = el}
                                type="text"
                                value={item.percentage}
                                onChange={(e) => updateSplitPercentage(item.id, e.target.value)}
                                onKeyDown={(e) => {
                                  // Tab or Enter on last percentage goes to tax rate
                                  if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'Enter') {
                                    if (index === splitItems.length - 1) {
                                      e.preventDefault()
                                      taxRateInputRef.current?.focus()
                                      taxRateInputRef.current?.select()
                                    }
                                  }
                                }}
                                className="w-full h-[44px] px-2 pr-6 bg-white border border-[#E8E8E8] rounded-sm text-13 text-[#18181A] text-center focus:border-[#4D5FFF] focus:ring-2 focus:ring-focus-ring focus:outline-none"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-12 text-[#8D8D8D]">%</span>
                            </div>
                          </div>
                          
                          {/* Amount input - now editable */}
                          <div className="w-24 flex-shrink-0">
                            <div className="relative">
                              <input
                                type="text"
                                tabIndex={-1}
                                value={(Math.abs(currentTransaction.amount) * item.percentage / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                onChange={(e) => {
                                  const amount = parseFloat(e.target.value.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0
                                  const totalAmount = Math.abs(currentTransaction.amount)
                                  const newPercentage = totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0
                                  updateSplitPercentage(item.id, Math.min(100, newPercentage))
                                }}
                                className="w-full h-[44px] px-2 pr-5 bg-white border border-[#E8E8E8] rounded-sm text-13 text-[#18181A] text-right focus:border-[#4D5FFF] focus:ring-2 focus:ring-focus-ring focus:outline-none"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-11 text-[#8D8D8D]">€</span>
                            </div>
                          </div>
                          
                          {/* Remove button */}
                          {splitItems.length > 2 && (
                            <button
                              onClick={() => removeSplitItem(item.id)}
                              tabIndex={-1}
                              className="w-6 h-6 flex items-center justify-center text-[#8D8D8D] hover:text-[#F13B3B] transition-colors text-16"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {/* Inline category picker dropdown */}
                      {splitCategoryPickerIndex !== null && (
                        <div ref={splitCategoryDropdownRef} className="bg-white border border-[#E8E8E8] rounded-lg shadow-md p-2">
                          {/* Search input */}
                          <input
                            ref={splitCategorySearchRef}
                            type="text"
                            value={splitCategorySearch}
                            onChange={(e) => setSplitCategorySearch(e.target.value)}
                            onKeyDown={(e) => {
                              // Handle ⌥S to exit split mode
                              if (e.altKey && e.key === 's') {
                                e.preventDefault()
                                setSplitCategoryPickerIndex(null)
                                setShowSplitMode(false)
                                return
                              }
                              
                              if (e.key === 'ArrowDown') {
                                e.preventDefault()
                                setSplitHighlightedIndex(prev => Math.min(prev + 1, filteredSplitCategories.length - 1))
                              } else if (e.key === 'ArrowUp') {
                                e.preventDefault()
                                setSplitHighlightedIndex(prev => Math.max(prev - 1, 0))
                              } else if (e.key === 'Enter') {
                                e.preventDefault()
                                const category = filteredSplitCategories[splitHighlightedIndex]
                                if (category) {
                                  handleSplitCategorySelect(category, splitCategoryPickerIndex)
                                }
                              } else if (e.key === 'Escape') {
                                e.preventDefault()
                                setSplitCategoryPickerIndex(null)
                              }
                            }}
                            placeholder="Search categories..."
                            className="w-full h-8 px-2.5 mb-1.5 bg-[#F0F0F0] border-0 rounded-md text-13 text-[#18181A] placeholder:text-[#8D8D8D] focus:outline-none focus:ring-2 focus:ring-focus-ring"
                          />
                          
                          {/* Category list */}
                          <div className="max-h-36 overflow-y-auto">
                            {filteredSplitCategories.map((category, idx) => (
                              <button
                                key={category.id}
                                onClick={() => handleSplitCategorySelect(category, splitCategoryPickerIndex)}
                                className={`w-full p-2 rounded-md flex items-center gap-2 transition-colors text-left ${
                                  idx === splitHighlightedIndex ? 'bg-[#F0F0F0]' : 'hover:bg-[#F0F0F0]'
                                }`}
                              >
                                <span className="text-14 flex-shrink-0">{category.icon}</span>
                                <div className="min-w-0">
                                  <span className="text-12 text-[#18181A] block truncate">{category.label}</span>
                                  {category.path?.length > 1 && (
                                    <span className="text-10 text-[#8D8D8D] block truncate">
                                      {formatCategoryBreadcrumb(category)}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                            {filteredSplitCategories.length === 0 && (
                              <div className="p-2 text-12 text-[#8D8D8D] text-center">
                                No categories found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Add split button */}
                      <button
                        onClick={addSplitItem}
                        className="w-full h-8 border-2 border-dashed border-[#E8E8E8] rounded-lg text-12 text-[#8D8D8D] hover:border-[#BBBBBB] hover:text-[#656565] transition-colors"
                      >
                        + Add another split
                      </button>
                    </div>
                    
                    {/* Total indicator */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E8E8E8]">
                      <span className="text-12 text-[#656565]">Total</span>
                      <span className={`text-13 font-medium ${
                        getTotalSplitPercentage() === 100 ? 'text-[#50942A]' : 'text-[#F13B3B]'
                      }`}>
                        {getTotalSplitPercentage()}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tax & Net Amount - now below category */}
              <div className="px-5 py-4 border-b border-[#E8E8E8]">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <label className="text-12 text-[#8D8D8D] mb-1 block">Tax rate <span className="text-[#F13B3B]">*</span></label>
                    <div className="relative">
                      <input
                        ref={taxRateInputRef}
                        type="text"
                        value={taxRateInput}
                        onChange={(e) => handleTaxRateChange(e.target.value)}
                        onKeyDown={(e) => {
                          // ⌥+Enter confirms immediately
                          if (e.altKey && e.key === 'Enter') {
                            e.preventDefault()
                            if (isTaxRateValid()) {
                              handleConfirm()
                            }
                            return
                          }
                          // Plain Enter moves to next field
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            noteInputRef.current?.focus()
                          }
                        }}
                        onBlur={() => {
                          // Format on blur
                          const num = parseFloat(taxRateInput)
                          if (!isNaN(num)) {
                            setTaxRateInput(num.toFixed(num % 1 === 0 ? 0 : 1))
                          }
                        }}
                        className={`w-full h-9 px-3 pr-8 bg-white border rounded-sm text-14 text-[#18181A] focus:ring-3 focus:outline-none transition-all ${
                          !isTaxRateValid() && taxRateInput !== ''
                            ? 'border-[#F13B3B] focus:border-[#F13B3B] focus:ring-[#FFF7F6]'
                            : 'border-[#E8E8E8] focus:border-[#4D5FFF] focus:ring-focus-ring'
                        }`}
                        placeholder="19"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-14 text-[#8D8D8D]">%</span>
                    </div>
                    {/* Error message - only shows when needed, adds its own spacing */}
                    {!isTaxRateValid() && taxRateInput !== '' && (
                      <p className="text-10 text-[#F13B3B] mt-1">0-100%</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-12 text-[#8D8D8D] mb-1 block">Net amount</label>
                    <div className="relative">
                      <input
                        type="text"
                        tabIndex={-1}
                        value={netAmountInput}
                        onChange={(e) => handleNetAmountChange(e.target.value)}
                        onKeyDown={(e) => {
                          // ⌥+Enter confirms immediately
                          if (e.altKey && e.key === 'Enter') {
                            e.preventDefault()
                            if (isTaxRateValid()) {
                              handleConfirm()
                            }
                          }
                        }}
                        onBlur={() => {
                          // Format on blur
                          const num = parseFloat(netAmountInput.replace(',', '.'))
                          if (!isNaN(num)) {
                            setNetAmountInput(num.toFixed(2))
                          }
                        }}
                        className={`w-full h-9 px-3 pr-8 bg-white border rounded-sm text-14 text-[#18181A] focus:ring-3 focus:outline-none transition-all ${
                          isNetExceedingGross()
                            ? 'border-[#F59E0B] focus:border-[#F59E0B] focus:ring-[#FEF3C7]'
                            : 'border-[#E8E8E8] focus:border-[#4D5FFF] focus:ring-focus-ring'
                        }`}
                        placeholder="0.00"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-14 text-[#8D8D8D]">€</span>
                    </div>
                    {/* Warning message - only shows when needed, adds its own spacing */}
                    {isNetExceedingGross() && (
                      <p className="text-10 text-[#F59E0B] mt-1">Exceeds gross</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Note field */}
              <div className="px-5 py-4">
                <label className="text-12 text-[#8D8D8D] mb-1 block">Note (optional)</label>
                <input
                  ref={noteInputRef}
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => {
                    // ⌥+Enter confirms immediately
                    if (e.altKey && e.key === 'Enter') {
                      e.preventDefault()
                      if (isTaxRateValid()) {
                        handleConfirm()
                      }
                      return
                    }
                    // Tab moves to confirm button
                    if (e.key === 'Tab' && !e.shiftKey) {
                      e.preventDefault()
                      confirmButtonRef.current?.focus()
                    }
                  }}
                  placeholder="Add context about this transaction..."
                  className="w-full h-9 px-3 bg-white border border-[#E8E8E8] rounded-sm text-14 text-[#18181A] placeholder:text-[#8D8D8D] focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring focus:outline-none transition-all"
                />
              </div>
            </div>
            
            {/* Actions - hidden when in document linking phase unless left panel is focused */}
            {(!isDocumentLinkingPhase || isLeftPanelFocused) && (
              <div className="flex flex-col gap-2 mt-5">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={handleSkip}
                    >
                      Later <span className="text-12 opacity-60 ml-1">⌥L</span>
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={handleMarkAsPrivate}
                    >
                      Private <span className="text-12 opacity-60 ml-1">⌥P</span>
                    </Button>
                    {!showSplitMode && (
                      <Button 
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setShowCategoryPicker(true)}
                      >
                        Change <span className="text-12 opacity-60 ml-1">⌥C</span>
                      </Button>
                    )}
                    {!showSplitMode ? (
                      <Button 
                        variant="secondary"
                        className="flex-1"
                        onClick={() => {
                          setShowSplitMode(true)
                          setSplitCategoryPickerIndex(null)  // Ensure dropdown is closed
                          setSplitCategorySearch('')          // Clear any search
                          setSplitItems([
                            { id: 1, percentage: 50, category: aiSuggestions[0]?.category || null },
                            { id: 2, percentage: 50, category: null }
                          ])
                        }}
                      >
                        Split <span className="text-12 opacity-60 ml-1">⌥S</span>
                      </Button>
                    ) : (
                      <Button 
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setShowSplitMode(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                  <Button 
                    ref={confirmButtonRef}
                    onClick={showSplitMode ? handleSplitConfirm : handleConfirm}
                    disabled={showSplitMode ? (getTotalSplitPercentage() !== 100 || !splitItems.every(i => i.category)) : !isTaxRateValid()}
                    className={`w-full ${(showSplitMode ? (getTotalSplitPercentage() !== 100 || !splitItems.every(i => i.category)) : !isTaxRateValid()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Confirm <span className="text-12 opacity-80 ml-1">⌥↵</span>
                  </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side - Document Matching Panel */}
        <div 
          className="flex-1 bg-[#1a1a1a] border-l border-[#2a2a2a] flex flex-col"
          onClick={() => {
            if (isLeftPanelFocused) {
              setIsLeftPanelFocused(false)
            }
          }}
        >
          {displayReceipt ? (
            /* Document Preview Mode - for both manual preview and auto-show of matched docs */
            <div className="flex-1 flex flex-col relative">
              {/* Preview Header */}
              <div className="p-4 border-b border-[#E8E8E8] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDisplayingMatchedReceipt && (
                    <button 
                      onClick={() => setShowDocumentOverview(true)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F0F0F0] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 text-[#8D8D8D]" />
                    </button>
                  )}
                  <div>
                    <p className="text-14 font-semibold text-[#18181A]">{displayReceipt.invoiceNumber}</p>
                    <p className="text-12 text-[#656565]">{displayReceipt.vendorName}</p>
                  </div>
                </div>
                {!isDisplayingMatchedReceipt && (
                  <button 
                    onClick={() => setPreviewingReceiptId(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F0F0F0] transition-colors"
                  >
                    <X className="w-4 h-4 text-[#8D8D8D]" />
                  </button>
                )}
              </div>
              
              {/* Action Buttons - Only for unmatched document preview */}
              {!isDisplayingMatchedReceipt && (
                <div className="p-4 border-b border-[#E8E8E8] flex gap-2">
                  <Button 
                    variant="secondary"
                    onClick={() => setPreviewingReceiptId(null)}
                  >
                    Back <span className="text-12 opacity-60 ml-1">Esc</span>
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      handleMatchReceipt()
                      setPreviewingReceiptId(null)
                    }}
                  >
                    Match document <span className="text-12 opacity-80 ml-1">⌥M</span>
                  </Button>
                </div>
              )}
              
              {/* Document Preview - Scrollable invoice */}
              <div className="flex-1 bg-[#F0F0F0] overflow-y-auto p-2 relative">
                {/* Zoom Controls - Top */}
                <div className="sticky top-0 z-10 flex justify-center mb-2">
                  <div className="flex items-center gap-1 bg-white rounded-lg shadow-md border border-[#E8E8E8] p-1">
                    <button
                      onClick={() => setReceiptZoom(prev => Math.max(0.5, prev - 0.25))}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F0F0F0] transition-colors"
                      disabled={receiptZoom <= 0.5}
                    >
                      <ZoomOut className="w-4 h-4 text-[#656565]" />
                    </button>
                    <span className="text-12 text-[#656565] px-2 min-w-[48px] text-center">{Math.round(receiptZoom * 100)}%</span>
                    <button
                      onClick={() => setReceiptZoom(prev => Math.min(2, prev + 0.25))}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F0F0F0] transition-colors"
                      disabled={receiptZoom >= 2}
                    >
                      <ZoomIn className="w-4 h-4 text-[#656565]" />
                    </button>
                  </div>
                </div>
                
                <div 
                  className="bg-white rounded-lg shadow-md w-full max-w-[520px] mx-auto overflow-hidden origin-top transition-transform"
                  style={{ transform: `scale(${receiptZoom})` }}
                >
                  {/* Styled invoice placeholder */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="text-10 text-[#8D8D8D] mb-1">YOUR LOGO</div>
                        <div className="w-10 h-10 bg-[#E8E8E8] rounded flex items-center justify-center text-[#8D8D8D] text-14">📄</div>
                      </div>
                      <div className="text-right">
                        <p className="text-10 text-[#8D8D8D]">{displayReceipt.invoiceNumber}</p>
                      </div>
                    </div>
                    
                    {/* Invoice Title */}
                    <h2 className="text-28 font-bold text-[#18181A] mb-8 tracking-tight">INVOICE</h2>
                    
                    {/* Date */}
                    <p className="text-12 text-[#656565] mb-6">
                      <span className="font-medium">Date:</span> {formatDate(displayReceipt.issueDate || displayReceipt.date)}
                    </p>
                    
                    {/* Billed To / From */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <p className="text-11 font-medium text-[#18181A] mb-1">Billed to:</p>
                        <p className="text-11 text-[#656565]">Your Company</p>
                        <p className="text-11 text-[#656565]">123 Business St.</p>
                        <p className="text-11 text-[#656565]">hello@company.com</p>
                      </div>
                      <div>
                        <p className="text-11 font-medium text-[#18181A] mb-1">From:</p>
                        <p className="text-11 text-[#656565]">{displayReceipt.vendorName}</p>
                        <p className="text-11 text-[#656565]">456 Vendor Ave.</p>
                        <p className="text-11 text-[#656565]">vendor@example.com</p>
                      </div>
                    </div>
                    
                    {/* Items Table */}
                    <div className="border-t border-b border-[#E8E8E8] py-3 mb-4">
                      <div className="grid grid-cols-4 gap-2 text-10 font-medium text-[#8D8D8D] mb-2">
                        <div className="col-span-2">Item</div>
                        <div className="text-center">Quantity</div>
                        <div className="text-right">Amount</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-11 text-[#18181A] py-2">
                        <div className="col-span-2">Professional Services</div>
                        <div className="text-center">1</div>
                        <div className="text-right">{formatCurrency(displayReceipt.amount * 0.84)}</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-11 text-[#18181A] py-2">
                        <div className="col-span-2">VAT (19%)</div>
                        <div className="text-center">—</div>
                        <div className="text-right">{formatCurrency(displayReceipt.amount * 0.16)}</div>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="flex justify-end mb-8">
                      <div className="text-right">
                        <p className="text-11 text-[#8D8D8D]">Total</p>
                        <p className="text-20 font-bold text-[#18181A]">{formatCurrency(displayReceipt.amount)}</p>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="pt-4 border-t border-[#E8E8E8]">
                      <p className="text-11 font-medium text-[#18181A] mb-1">Payment method: Bank Transfer</p>
                      <p className="text-10 text-[#8D8D8D]">Thank you for your business!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Connected Toast - Bottom centered */}
              {isDisplayingMatchedReceipt && connectedToastPhase && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                  {connectedToastPhase === 'loading' ? (
                    <div className="flex items-center gap-3 bg-success-bg border border-success/20 rounded-xl shadow-md px-4 py-3 animate-fade-in">
                      <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center animate-scale-in">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-13 font-medium text-[#50942A]">Successfully connected</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setConnectedToastPhase(null)
                        moveToNext()
                      }}
                      className="flex items-center gap-2 bg-contrast-primary hover:bg-contrast-primary-hover text-white rounded-xl shadow-md px-5 py-3 transition-all animate-fade-in"
                    >
                      <span className="text-13 font-medium">Proceed to next</span>
                      <span className="text-12 opacity-70 ml-1">n</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : currentMatchedReceipt && showDocumentOverview ? (
            /* Matched state - Document linked successfully */
            <div className="flex-1 flex flex-col p-4">
              {/* Animated toast header - fades in/out */}
              {showLinkedToast && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#E8E8E8] animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-success-bg flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#50942A]" />
                  </div>
                  <div>
                    <p className="text-14 font-semibold text-[#18181A]">Document linked</p>
                    <p className="text-12 text-[#656565]">This transaction is matched to a receipt</p>
                  </div>
                </div>
              )}
              
              {/* Matched document card - clickable to view, with hover unlink */}
              <div 
                className="group p-4 bg-[#F0F0F0] rounded-lg mb-4 cursor-pointer hover:bg-[#E8E8E8] transition-colors relative"
                onClick={() => setShowDocumentOverview(false)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#E8E8E8]">
                    <FileText className="w-5 h-5 text-[#8D8D8D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-14 font-semibold text-[#18181A]">{currentMatchedReceipt.invoiceNumber}</p>
                    <p className="text-12 text-[#656565] mt-0.5">{currentMatchedReceipt.vendorName}</p>
                    <p className="text-12 text-[#8D8D8D] mt-0.5">{formatDate(currentMatchedReceipt.issueDate || currentMatchedReceipt.date)}</p>
                  </div>
                  <p className="text-14 font-semibold text-[#18181A]">{formatCurrency(currentMatchedReceipt.amount)}</p>
                  
                  {/* Hover unlink button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setMatchedReceipts(prev => {
                        const newMatches = { ...prev }
                        delete newMatches[currentTransaction.id]
                        return newMatches
                      })
                    }}
                    className="absolute right-2 top-2 w-6 h-6 rounded-full bg-white border border-[#E8E8E8] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#F13B3B] hover:text-[#F13B3B]"
                    title="Unlink document"
                  >
                    <Unlink className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Amount mismatch warning */}
              {Math.abs(currentTransaction.amount) !== currentMatchedReceipt.amount && (
                <div className="p-3 bg-[#FEF3C7] rounded-lg mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#92400E] flex-shrink-0" />
                  <p className="text-12 text-[#92400E]">
                    {formatCurrency(Math.abs(Math.abs(currentTransaction.amount) - currentMatchedReceipt.amount))} still not matched
                  </p>
                </div>
              )}
              
              {/* Action buttons - Add another document or upload */}
              <div className="space-y-2 mb-4">
                <button 
                  onClick={() => {
                    // Go back to document selection to add another
                    setMatchedReceipts(prev => {
                      const newMatches = { ...prev }
                      delete newMatches[currentTransaction.id]
                      return newMatches
                    })
                  }}
                  className="w-full p-3 text-left rounded-lg border border-[#E8E8E8] hover:border-[#BBBBBB] hover:bg-[#F0F0F0] transition-colors flex items-center gap-3"
                >
                  <Plus className="w-4 h-4 text-[#8D8D8D]" />
                  <span className="text-13 text-[#18181A]">Add another document</span>
                </button>
              </div>
              
              {/* Continue button */}
              <div className="mt-auto pt-4 border-t border-[#E8E8E8]">
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={() => {
                    setIsDocumentLinkingPhase(false)
                    setShowLinkedToast(false)
                    moveToNext()
                  }}
                >
                  Continue to next
                  <span className="text-12 opacity-70 ml-1">n</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            /* Document selection */
            <div className="flex-1 flex flex-col p-5">
              {/* Header - changes based on document linking phase */}
              {isDocumentLinkingPhase && (
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-14 font-semibold text-white">Link a document <span className="text-gray-400 font-normal">(recommended)</span></p>
                  </div>
                  <button
                    onClick={handleSkipDocumentLinking}
                    className="text-12 text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    Later <span className="text-10 text-gray-500">⌥L</span>
                  </button>
                </div>
              )}
              
              {/* Success toast */}
              {showMatchSuccessToast && (
                <div className="mb-4 p-3 bg-success-bg border border-success/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#50942A]" />
                    <div>
                      <p className="text-12 text-[#18181A] font-medium">Document matched!</p>
                      <p className="text-11 text-[#656565]">Moving to next transaction...</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUndoMatch}
                    className="text-12 text-[#656565] hover:text-[#18181A] flex items-center gap-1"
                  >
                    Undo <span className="text-10 text-[#8D8D8D]">⌥Z</span>
                  </button>
                </div>
              )}
              
              {/* Search input - at top */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  ref={documentSearchInputRef}
                  type="text"
                  value={receiptSearch}
                  onChange={(e) => setReceiptSearch(e.target.value)}
                  onKeyDown={(e) => {
                    // When search is empty, handle navigation keys for suggested documents
                    if (!receiptSearch.trim()) {
                      if (['1', '2', '3'].includes(e.key)) {
                        e.preventDefault()
                        const index = parseInt(e.key) - 1
                        if (suggestedReceipts[index]) {
                          setSelectedReceiptId(suggestedReceipts[index].id)
                        }
                        return
                      }
                      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        e.preventDefault()
                        const currentIndex = suggestedReceipts.findIndex(r => r.id === selectedReceiptId)
                        let newIndex = e.key === 'ArrowDown' 
                          ? (currentIndex + 1) % suggestedReceipts.length
                          : (currentIndex - 1 + suggestedReceipts.length) % suggestedReceipts.length
                        if (currentIndex < 0) newIndex = 0
                        setSelectedReceiptId(suggestedReceipts[newIndex]?.id)
                        return
                      }
                      if (e.key === 'Enter' && selectedReceiptId) {
                        e.preventDefault()
                        setPreviewingReceiptId(selectedReceiptId)
                        return
                      }
                      // All other keys: let them type into search
                      return
                    }
                    
                    // When search has content, handle search results navigation
                    const searchResults = mockReceipts
                      .filter(r => !r.matched && (
                        r.vendorName.toLowerCase().includes(receiptSearch.toLowerCase()) ||
                        r.invoiceNumber.toLowerCase().includes(receiptSearch.toLowerCase())
                      ))
                      .slice(0, 5)
                    
                    if (searchResults.length === 0) return
                    
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      const newIndex = Math.min(searchHighlightedIndex + 1, searchResults.length - 1)
                      setSearchHighlightedIndex(newIndex)
                      setSelectedReceiptId(searchResults[newIndex].id)
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      const newIndex = Math.max(searchHighlightedIndex - 1, 0)
                      setSearchHighlightedIndex(newIndex)
                      setSelectedReceiptId(searchResults[newIndex].id)
                    } else if (e.key === 'Tab' && !e.shiftKey) {
                      e.preventDefault()
                      const newIndex = (searchHighlightedIndex + 1) % searchResults.length
                      setSearchHighlightedIndex(newIndex)
                      setSelectedReceiptId(searchResults[newIndex].id)
                    } else if (e.key === 'Enter' && selectedReceiptId) {
                      e.preventDefault()
                      // Open preview (same as View button)
                      setPreviewingReceiptId(selectedReceiptId)
                      setReceiptSearch('')
                    }
                  }}
                  placeholder="Search all documents..."
                  className="w-full h-10 pl-10 pr-9 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-13 text-white placeholder:text-gray-500 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 focus:outline-none"
                />
                {/* Clear search button */}
                {receiptSearch && (
                  <button
                    onClick={() => setReceiptSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Receipt boxes - either search results or suggestions */}
              <div className="flex-1">
                {receiptSearch.trim() ? (
                  /* Search results with radio buttons */
                  <div className="space-y-2">
                    {(() => {
                      const searchResults = mockReceipts
                        .filter(r => !r.matched && (
                          r.vendorName.toLowerCase().includes(receiptSearch.toLowerCase()) ||
                          r.invoiceNumber.toLowerCase().includes(receiptSearch.toLowerCase())
                        ))
                        .slice(0, 5)
                      
                      if (searchResults.length === 0) {
                        return (
                          <div className="text-center py-6">
                            <Upload className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                            <p className="text-13 text-gray-400">No results found. Try uploading a new document.</p>
                          </div>
                        )
                      }
                      
                      return searchResults.map((receipt, index) => (
                        <button
                          key={receipt.id}
                          tabIndex={0}
                          onClick={() => {
                            setSelectedReceiptId(receipt.id)
                            setSearchHighlightedIndex(index)
                          }}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedReceiptId === receipt.id || searchHighlightedIndex === index
                              ? 'border border-[#6366F1] bg-[#6366F1]/10' 
                              : 'border border-[#3a3a3a] hover:border-[#4a4a4a] bg-[#2a2a2a]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Radio button */}
                            <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedReceiptId === receipt.id ? 'border-[#6366F1]' : 'border-[#4a4a4a]'
                            }`}>
                              {selectedReceiptId === receipt.id && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-14 font-semibold text-white">{receipt.invoiceNumber}</p>
                              <p className="text-12 text-gray-400 mt-1">{receipt.vendorName} · {formatDate(receipt.issueDate || receipt.date)}</p>
                            </div>
                            
                            {/* Amount */}
                            <p className="text-14 font-semibold text-white flex-shrink-0">{formatCurrency(receipt.amount)}</p>
                          </div>
                        </button>
                      ))
                    })()}
                  </div>
                ) : (
                  /* Suggested documents */
                  <>
                    {/* Section header - changes based on whether there's a top recommendation */}
                    {suggestedReceipts.length > 0 && suggestedReceipts[0]?.isTopRecommendation ? (
                      <div className="mb-3">
                        <button
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedReceiptId === suggestedReceipts[0].id 
                              ? 'border border-[#6366F1] bg-[#6366F1]/10' 
                              : 'border border-[#3a3a3a] hover:border-[#4a4a4a] bg-[#2a2a2a]'
                          }`}
                          onClick={() => setSelectedReceiptId(selectedReceiptId === suggestedReceipts[0].id ? null : suggestedReceipts[0].id)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 flex items-center justify-center rounded text-10 font-medium flex-shrink-0 bg-[#3a3a3a] text-gray-400">1</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-14 font-semibold text-white">{suggestedReceipts[0].vendorName}</p>
                                <span className="px-1.5 py-0.5 bg-[#6366F1]/20 text-[#A5B4FC] text-10 font-medium rounded flex items-center gap-1">
                                  ✨ Best recommendation
                                </span>
                              </div>
                              <p className="text-12 text-gray-400 mt-1">{formatCurrency(suggestedReceipts[0].amount)}</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <p className="text-14 font-semibold text-white">Suggested documents</p>
                        <p className="text-12 text-gray-400">Based on amount, date & counterparty</p>
                      </div>
                    )}
                    
                    {/* Other suggestions (if top recommendation shown, start from index 1) */}
                    <div className="space-y-2">
                      {suggestedReceipts.slice(suggestedReceipts[0]?.isTopRecommendation ? 1 : 0).map((receipt, index) => (
                        <button
                          key={receipt.id}
                          tabIndex={0}
                          onClick={() => setSelectedReceiptId(selectedReceiptId === receipt.id ? null : receipt.id)}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedReceiptId === receipt.id 
                              ? 'border border-[#6366F1] bg-[#6366F1]/10' 
                              : 'border border-[#3a3a3a] hover:border-[#4a4a4a] bg-[#2a2a2a]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Shortcut badge */}
                            <span className="w-6 h-6 flex items-center justify-center rounded text-10 font-medium flex-shrink-0 bg-[#3a3a3a] text-gray-400">
                              {suggestedReceipts[0]?.isTopRecommendation ? index + 2 : index + 1}
                            </span>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-14 font-semibold text-white">{receipt.invoiceNumber}</p>
                                {receipt.isPartialMatch && (
                                  <span className="px-1.5 py-0.5 border border-[#E6A817] text-[#E6A817] text-10 font-medium rounded">Partial</span>
                                )}
                              </div>
                              <p className="text-12 text-gray-400 mt-1">{receipt.vendorName} · {formatDate(receipt.issueDate || receipt.date)}</p>
                            </div>
                            
                            {/* Amount */}
                            <p className="text-14 font-semibold text-white flex-shrink-0">{formatCurrency(receipt.amount)}</p>
                          </div>
                        </button>
                      ))}
                      
                      {/* No matches */}
                      {suggestedReceipts.length === 0 && (
                        <div className="text-center py-6">
                          <Upload className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                          <p className="text-13 text-gray-400">No matching receipts found</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {/* Action buttons - View and Match */}
              {(selectedReceiptId || (suggestedReceipts.length > 0 && suggestedReceipts[0]?.isTopRecommendation)) && (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setPreviewingReceiptId(selectedReceiptId || suggestedReceipts[0]?.id)}
                    className="h-10 px-4 text-13 font-medium text-gray-300 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg hover:bg-[#3a3a3a] transition-colors flex items-center justify-center"
                  >
                    View <span className="text-10 opacity-70 ml-1">⌥V</span>
                  </button>
                  <button 
                    className="flex-1 h-10 px-4 text-14 font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#5558E3] transition-colors flex items-center justify-center"
                    onClick={() => {
                      if (!selectedReceiptId && suggestedReceipts[0]?.isTopRecommendation) {
                        setSelectedReceiptId(suggestedReceipts[0].id)
                      }
                      handleMatchReceipt()
                    }}
                  >
                    Match document <span className="text-12 opacity-80 ml-1">⌥M</span>
                  </button>
                </div>
              )}
              
              {/* Upload area - dark themed */}
              <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                <div className="border-2 border-dashed border-[#3a3a3a] rounded-xl p-6 text-center hover:border-[#6366F1] hover:bg-[#6366F1]/5 transition-colors cursor-pointer">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-14 font-medium text-white mb-1">Drag receipt here</p>
                  <p className="text-13 text-gray-500 mb-3">or</p>
                  <button className="px-4 py-2 text-13 font-medium text-white bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg hover:bg-[#3a3a3a] transition-colors inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Browse files
                  </button>
                </div>
                <p className="text-12 text-gray-500 text-center mt-3">Supports JPG, PNG, and PDF</p>
                
                {/* I don't have a receipt button */}
                <button
                  onClick={() => {
                    // Mark as no receipt - flags for tax advisor
                    console.log('Marked as no receipt - flagged for tax advisor')
                    moveToNext()
                  }}
                  className="w-full mt-4 py-2.5 px-3 text-13 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Unlink className="w-4 h-4" />
                  I don't have a receipt
                  <span className="text-10 text-gray-500 ml-1">⌥N</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  )
}

export default CategorizationFlow
