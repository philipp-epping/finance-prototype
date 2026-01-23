import React, { useState, useEffect, useMemo } from 'react'
import { Paperclip, Check, ArrowRight, Upload, X, Eye, Lock, ZoomIn, ZoomOut, Download } from 'lucide-react'
import { Button } from './ui'
import { formatCurrency, formatDate, getBankName } from '../data/mockData'

const ReceiptMatchingFlow = ({ transactions = [], onComplete }) => {
  // Filter to transactions without receipts (and not marked private)
  const transactionsNeedingReceipts = useMemo(() => 
    transactions.filter(t => !t.hasAttachment && !t.isPrivate),
    [transactions]
  )
  
  // Flow state: 'entry' | 'matching' | 'success'
  const [flowState, setFlowState] = useState('entry')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [skippedIds, setSkippedIds] = useState([])
  const [matchedTransactions, setMatchedTransactions] = useState({})
  const [privateTransactions, setPrivateTransactions] = useState([])
  
  // Current transaction state
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [zoom, setZoom] = useState(1)
  
  // Get current transaction
  const currentTransaction = transactionsNeedingReceipts[currentIndex]
  
  // Progress tracking
  const totalToMatch = transactionsNeedingReceipts.length
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (flowState !== 'matching') return
      
      const isMeta = e.metaKey || e.ctrlKey
      
      if (isMeta && e.key === 'p') {
        e.preventDefault()
        handleMarkPrivate()
      } else if (isMeta && e.key === 'l') {
        e.preventDefault()
        handleSkip()
      } else if (e.key === 'Escape') {
        if (uploadedFile) {
          setUploadedFile(null)
          setPreviewUrl(null)
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [flowState, uploadedFile])
  
  // Start the matching flow
  const handleStartMatching = () => {
    setFlowState('matching')
    setCurrentIndex(0)
  }
  
  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setUploadedFile(file)
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file))
      }
    }
  }
  
  // Handle file input
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file))
      }
    }
  }
  
  // Confirm receipt match
  const handleConfirmReceipt = () => {
    if (!currentTransaction || !uploadedFile) return
    
    setMatchedTransactions(prev => ({
      ...prev,
      [currentTransaction.id]: {
        file: uploadedFile,
        previewUrl
      }
    }))
    
    moveToNext()
  }
  
  // Mark as private (no receipt needed)
  const handleMarkPrivate = () => {
    if (!currentTransaction) return
    setPrivateTransactions(prev => [...prev, currentTransaction.id])
    moveToNext()
  }
  
  // Skip for later
  const handleSkip = () => {
    if (!currentTransaction) return
    setSkippedIds(prev => [...prev, currentTransaction.id])
    moveToNext()
  }
  
  // Move to next transaction
  const moveToNext = () => {
    setUploadedFile(null)
    setPreviewUrl(null)
    setZoom(1)
    
    if (currentIndex + 1 >= totalToMatch) {
      setFlowState('success')
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }
  
  // Get counterparty
  const getCounterparty = (t) => t.amount >= 0 ? t.sender : t.recipient
  
  // ============ ENTRY STATE ============
  if (flowState === 'entry') {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-[#E8E8E8]">
          <div className="px-6 py-3 flex items-center justify-between">
            <h1 className="text-14 font-medium text-[#18181A]">Receipt Matching</h1>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#FFF8E1] flex items-center justify-center">
              <Paperclip className="w-8 h-8 text-[#F59E0B]" />
            </div>
            
            {totalToMatch === 0 ? (
              <>
                <h2 className="text-20 font-semibold text-[#18181A] mb-2">All receipts attached</h2>
                <p className="text-14 text-[#656565] mb-8">
                  Every transaction has a receipt or is marked as private. You're all set!
                </p>
                <Button variant="secondary" onClick={() => onComplete?.()}>
                  Done
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-20 font-semibold text-[#18181A] mb-2">
                  {totalToMatch} transaction{totalToMatch !== 1 ? 's' : ''} need receipts
                </h2>
                <p className="text-14 text-[#656565] mb-8">
                  Attach receipts to help with AI categorization and tax preparation. You can also mark personal expenses as private.
                </p>
                
                <Button onClick={handleStartMatching} icon={ArrowRight}>
                  Start matching
                </Button>
                
                <p className="text-12 text-[#8D8D8D] mt-4">
                  Takes about {Math.ceil(totalToMatch * 0.3)} minute{totalToMatch > 3 ? 's' : ''}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // ============ SUCCESS STATE ============
  if (flowState === 'success') {
    const matchedCount = Object.keys(matchedTransactions).length
    const privateCount = privateTransactions.length
    const skippedCount = skippedIds.length
    
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-[#E8E8E8]">
          <div className="px-6 py-3 flex items-center justify-between">
            <h1 className="text-14 font-medium text-[#18181A]">Receipt Matching</h1>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E8F5E9] flex items-center justify-center">
              <Check className="w-8 h-8 text-[#50942A]" />
            </div>
            
            <h2 className="text-20 font-semibold text-[#18181A] mb-2">All set</h2>
            <p className="text-14 text-[#656565] mb-2">
              {matchedCount > 0 && `${matchedCount} receipt${matchedCount !== 1 ? 's' : ''} attached. `}
              {privateCount > 0 && `${privateCount} marked private. `}
              {skippedCount > 0 && `${skippedCount} skipped for later.`}
            </p>
            <p className="text-14 text-[#8D8D8D] mb-8">
              Receipts help the AI categorize transactions more accurately.
            </p>
            
            <Button variant="secondary" onClick={() => onComplete?.()}>
              Done
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  // ============ MATCHING STATE ============
  if (!currentTransaction) return null
  
  return (
    <div className="flex flex-col h-full bg-[#F9F9F9]">
      {/* Header with progress */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-3 flex items-center justify-between">
          <h1 className="text-14 font-medium text-[#18181A]">Receipt Matching</h1>
          <div className="flex items-center gap-3">
            <span className="text-13 text-[#8D8D8D]">
              {currentIndex + 1} of {totalToMatch}
            </span>
            <div className="w-24 h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#F59E0B] rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalToMatch) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Transaction Info */}
        <div className="w-[40%] min-w-[360px] flex flex-col p-6 overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full">
            {/* Transaction Card */}
            <div className="bg-white rounded-xl border border-[#E8E8E8] shadow-sm overflow-hidden mb-5">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-16 font-medium text-[#18181A] mb-1">
                      {getCounterparty(currentTransaction)}
                    </p>
                    <p className="text-13 text-[#8D8D8D]">
                      {formatDate(currentTransaction.date)} · {getBankName(currentTransaction.bankId)}
                    </p>
                  </div>
                  <p className={`text-18 font-semibold ${currentTransaction.amount >= 0 ? 'text-[#50942A]' : 'text-[#F13B3B]'}`}>
                    {currentTransaction.amount >= 0 ? '+' : ''}{formatCurrency(currentTransaction.amount)}
                  </p>
                </div>
                
                {currentTransaction.reference && (
                  <div className="bg-[#F0F0F0] rounded-md px-3 py-2">
                    <p className="text-12 text-[#8D8D8D] mb-0.5">Reference</p>
                    <p className="text-13 text-[#656565]">{currentTransaction.reference}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Instructions */}
            <div className="bg-[#F8F9FF] border border-[#E8EBFF] rounded-lg p-4 mb-5">
              <p className="text-13 text-[#656565]">
                <strong className="text-[#18181A]">Drag & drop</strong> a receipt on the right, or mark this as a private expense.
              </p>
            </div>
            
            {/* Actions */}
            <div className="space-y-3">
              {uploadedFile ? (
                <Button onClick={handleConfirmReceipt} className="w-full">
                  <Check className="w-4 h-4 mr-2" />
                  Confirm receipt
                </Button>
              ) : (
                <label className="w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="h-[36px] px-4 bg-[#4D5FFF] text-white rounded-sm text-14 font-medium flex items-center justify-center hover:bg-[#4555E3] transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload receipt
                  </div>
                </label>
              )}
              
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleMarkPrivate}
              >
                <Lock className="w-4 h-4 mr-2" />
                Mark as private
                <kbd className="ml-auto text-11 px-1.5 py-0.5 bg-[#F0F0F0] border border-[#E8E8E8] rounded">⌘P</kbd>
              </Button>
              
              <button
                onClick={handleSkip}
                className="w-full text-14 text-[#8D8D8D] hover:text-[#656565] transition-colors flex items-center justify-center gap-2 py-2"
              >
                Skip for later
                <kbd className="text-11 px-1.5 py-0.5 bg-[#F0F0F0] border border-[#E8E8E8] rounded">⌘L</kbd>
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Drop Zone / Preview */}
        <div className="flex-1 bg-[#1a1a1a] flex flex-col">
          {uploadedFile && previewUrl ? (
            <>
              {/* Preview Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-white/60" />
                  <span className="text-13 text-white/80 truncate max-w-[200px]">{uploadedFile.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                  >
                    <ZoomOut className="w-4 h-4 text-white/60" />
                  </button>
                  <span className="text-12 text-white/50 w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-white/60" />
                  </button>
                  <div className="w-px h-5 bg-white/10 mx-2" />
                  <button
                    onClick={() => {
                      setUploadedFile(null)
                      setPreviewUrl(null)
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>
              
              {/* Preview Image */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-6">
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="max-w-full max-h-full rounded-lg shadow-2xl transition-transform duration-200"
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
            </>
          ) : (
            /* Drop Zone */
            <div 
              className={`flex-1 flex items-center justify-center p-6 transition-colors ${
                isDragging ? 'bg-white/5' : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="w-full max-w-sm text-center">
                <div className={`border-2 border-dashed rounded-xl p-10 transition-all ${
                  isDragging 
                    ? 'border-white/60 bg-white/5' 
                    : 'border-white/20 hover:border-white/40'
                }`}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
                    <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-white/80' : 'text-white/40'}`} />
                  </div>
                  <p className="text-16 font-medium text-white/80 mb-2">
                    {isDragging ? 'Drop receipt here' : 'Drag receipt here'}
                  </p>
                  <p className="text-13 text-white/50">
                    or use the upload button on the left
                  </p>
                </div>
                <p className="text-12 text-white/30 mt-4">
                  Supports JPG, PNG, and PDF
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReceiptMatchingFlow
