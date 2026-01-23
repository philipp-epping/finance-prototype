import React, { useState, useEffect } from 'react'
import { X, Zap, FileEdit, RefreshCw, Upload, CheckCircle2, ArrowRight, Circle, Copy, Check, AlertTriangle } from 'lucide-react'
import { Button } from './ui'
import { 
  accountTypes, 
  formatCurrency, 
  formatLastSyncedFull,
  getMonthsStatus,
  getLastTransactionDate
} from '../data/mockData'

// Copyable field component
const CopyableField = ({ label, value }) => {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = async () => {
    const cleanValue = value.replace(/\s/g, '')
    await navigator.clipboard.writeText(cleanValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex justify-between items-center">
      <span className="text-13 text-[#8D8D8D]">{label}</span>
      <button
        onClick={handleCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-1.5 text-13 text-[#18181A] font-mono hover:text-[#4D5FFF] transition-colors group"
      >
        <span>{value}</span>
        <span className={`transition-opacity ${isHovered || copied ? 'opacity-100' : 'opacity-0'}`}>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#50942A]" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[#8D8D8D] group-hover:text-[#4D5FFF]" />
          )}
        </span>
      </button>
    </div>
  )
}

const AccountDetailPanel = ({ 
  account, 
  isOpen, 
  onClose, 
  selectedMonth,
  onSync,
  onMarkComplete,
  onUndoComplete,
  onUpload,
  onViewTransactions,
  transactions = []
}) => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [confirmingMonth, setConfirmingMonth] = useState(null) // Which month is being confirmed
  
  // Reset confirmation state when account changes
  useEffect(() => {
    setConfirmingMonth(null)
  }, [account?.id])
  
  if (!isOpen || !account) return null
  
  const isAutomatic = account.connectionType === 'automatic'
  
  // Get all months status (last 3 months)
  const monthsStatus = getMonthsStatus(account, 3)
  const hasIncompleteMonths = monthsStatus.some(m => !m.isComplete)
  const incompleteCount = monthsStatus.filter(m => !m.isComplete).length
  
  // Get last transaction date
  const lastTransactionDate = getLastTransactionDate(transactions, account)
  
  // Get account type label
  const getAccountTypeLabel = (value) => {
    const type = accountTypes.find(t => t.value === value)
    return type ? type.label : value
  }
  
  // Handle sync action
  const handleSync = async () => {
    setIsSyncing(true)
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate sync
    setIsSyncing(false)
    onSync?.(account.id)
  }
  
  // Handle mark as complete - no toast, just update
  const handleMarkComplete = (month) => {
    onMarkComplete?.(account.id, month)
    setConfirmingMonth(null)
  }
  
  // Format last transaction date
  const formatTransactionDate = (dateStr) => {
    if (!dateStr) return 'No transactions'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-[400px] bg-white border-l border-[#E8E8E8] shadow-lg z-50 flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8E8E8] flex items-start gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-black/10 flex-shrink-0"
            style={{ backgroundColor: account.bankBgColor || '#F5F5F5' }}
          >
            <img 
              src={account.bankLogo} 
              alt={account.bankName}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentNode.innerHTML = `<span class="text-16 font-bold text-[#18181A]">${account.bankName?.charAt(0) || 'B'}</span>`
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-16 font-semibold text-[#18181A] truncate">
              {account.bankName}
            </h2>
            <p className="text-13 text-[#656565] truncate">
              {account.accountName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-12 text-[#8D8D8D] bg-[#F0F0F0] px-2 py-0.5 rounded">
                {getAccountTypeLabel(account.accountType)}
              </span>
              <div className="flex items-center gap-1 text-12 text-[#8D8D8D]">
                {isAutomatic ? (
                  <>
                    <Zap className="w-3 h-3 text-[#50942A]" />
                    Auto-sync
                  </>
                ) : (
                  <>
                    <FileEdit className="w-3 h-3" />
                    Manual
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F0F0F0] rounded-sm transition-colors"
          >
            <X className="w-4 h-4 text-[#8D8D8D]" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {/* Warning Banner - Only show when there are incomplete months */}
          {hasIncompleteMonths && (
            <div className="mb-5 bg-[#FFF8E1] border border-[#FFE082] rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-14 font-semibold text-[#18181A]">
                    This account is not up to date
                  </p>
                  <p className="text-13 text-[#656565]">
                    {incompleteCount === 1 
                      ? '1 month is missing transactions' 
                      : `${incompleteCount} months are missing transactions`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Account Details with copyable IBAN/BIC */}
          <div className="mb-5">
            <h3 className="text-12 font-medium text-[#8D8D8D] uppercase tracking-wide mb-3">
              Account Details
            </h3>
            <div className="bg-[#F0F0F0] rounded-lg p-4">
              <div className="space-y-3">
                <CopyableField label="IBAN" value={account.iban} />
                <CopyableField label="BIC" value={account.bic} />
                <div className="flex justify-between">
                  <span className="text-13 text-[#8D8D8D]">Balance</span>
                  <span className="text-13 text-[#18181A] font-semibold">{formatCurrency(account.balance || 0)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sync Data Section */}
          <div className="mb-5">
            <h3 className="text-12 font-medium text-[#8D8D8D] uppercase tracking-wide mb-3">
              Sync Data
            </h3>
            <div className="bg-[#F0F0F0] rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-13 text-[#8D8D8D]">Last synced</span>
                  <span className="text-13 text-[#18181A]">{formatLastSyncedFull(account.lastSynced)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-13 text-[#8D8D8D]">Last transaction</span>
                  <span className="text-13 text-[#18181A]">{formatTransactionDate(lastTransactionDate)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Monthly Status Section */}
          <div className="mb-5">
            <h3 className="text-12 font-medium text-[#8D8D8D] uppercase tracking-wide mb-3">
              Monthly Status
            </h3>
            <div className="space-y-2">
              {monthsStatus.map(m => (
                <div 
                  key={m.month} 
                  className={`rounded-lg p-4 transition-colors duration-300 ${
                    m.isComplete 
                      ? 'bg-[#F0F0F0]' 
                      : 'bg-[#FFF8E1] border border-[#FFE082]'
                  }`}
                >
                  {/* Month header row */}
                  <div className="flex items-center justify-between">
                    <span className="text-14 font-medium text-[#18181A]">{m.label}</span>
                    
                    {/* Status indicator */}
                    {m.isComplete ? (
                      m.isSynced ? (
                        // Auto-synced - no undo option
                        <div className="flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 text-[#8D8D8D]" />
                          <span className="text-12 text-[#8D8D8D]">Synced</span>
                        </div>
                      ) : (
                        // Manually completed - show Undo on hover over the badge only
                        <button
                          onClick={() => onUndoComplete?.(account.id, m.month)}
                          className="group flex items-center gap-1.5 rounded px-1.5 py-0.5 -mr-1.5 hover:bg-[#E8E8E8] transition-colors"
                        >
                          {/* Normal state - Complete */}
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#50942A] group-hover:hidden" />
                          <span className="text-12 text-[#50942A] group-hover:hidden">Complete</span>
                          {/* Hover state - Undo */}
                          <span className="text-12 text-[#8D8D8D] hidden group-hover:block">Undo</span>
                        </button>
                      )
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Circle className="w-2 h-2 text-[#D97706] fill-[#D97706]" />
                        <span className="text-12 text-[#D97706] font-medium">Incomplete</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Subtitle for manually completed months */}
                  {m.isComplete && m.isManuallyComplete && (
                    <p className="text-12 text-[#8D8D8D] mt-1">Marked manually</p>
                  )}
                  
                  {/* Actions for incomplete months */}
                  {!m.isComplete && (
                    <div className="mt-3">
                      {confirmingMonth === m.month ? (
                        // Confirmation state
                        <div className="bg-white rounded-lg p-3 border border-[#E8E8E8]">
                          <p className="text-13 text-[#656565] mb-3">
                            Confirm that all transactions for {m.label} are uploaded?
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => setConfirmingMonth(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleMarkComplete(m.month)}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Action buttons
                        <div className="flex items-center gap-3">
                          {isAutomatic ? (
                            <button
                              onClick={handleSync}
                              disabled={isSyncing}
                              className="text-13 font-medium text-[#4D5FFF] hover:text-[#4555E3] transition-colors disabled:opacity-50"
                            >
                              {isSyncing ? 'Syncing...' : 'Sync now'}
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => onUpload?.(account.id)}
                                className="text-13 font-medium text-[#4D5FFF] hover:text-[#4555E3] transition-colors flex items-center gap-1"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                Upload
                              </button>
                              <span className="text-[#BBBBBB]">·</span>
                              <button
                                onClick={() => setConfirmingMonth(m.month)}
                                className="text-13 text-[#656565] hover:text-[#18181A] transition-colors"
                              >
                                Mark complete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Sync action for auto accounts */}
          {isAutomatic && (
            <div className="mb-5">
              <Button 
                variant="secondary"
                className="w-full"
                icon={RefreshCw}
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? 'Syncing...' : 'Sync now'}
              </Button>
            </div>
          )}
        </div>
        
        {/* Bottom link - Fixed at bottom */}
        <div className="border-t border-[#E8E8E8] px-5 py-4 bg-white">
          <button
            onClick={() => onViewTransactions?.(account)}
            className="flex items-center gap-1 text-13 font-medium text-[#4D5FFF] hover:text-[#4555E3] transition-colors"
          >
            View all transactions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
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

export default AccountDetailPanel
