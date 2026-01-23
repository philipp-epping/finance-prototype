import React, { useState, useMemo } from 'react'
import { ArrowLeft, ArrowLeftRight, Paperclip, Download, Upload, Sparkles, Search } from 'lucide-react'
import { Table, Badge, Button } from './ui'
import { getBankName, formatCurrency, formatDate, banks } from '../data/mockData'
import MonthPicker from './MonthPicker'
import DateRangePicker from './DateRangePicker'
import UploadDocumentsModal from './UploadDocumentsModal'
import AdvancedFilterPanel from './AdvancedFilterPanel'

const TransactionsTable = ({ account, transactions, onBack, bankAccounts = [] }) => {
  // Filter state
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dateRangeStart, setDateRangeStart] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [dateRangeEnd, setDateRangeEnd] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth() + 1, 0)
  })
  const [searchQuery, setSearchQuery] = useState('')
  
  // Unified filter state
  const [filters, setFilters] = useState({
    receiptStatus: [], // ['has-receipt', 'no-receipt', 'private']
    categorization: [], // ['ai', 'manual', 'uncategorized']
    banks: [], // bank IDs
    categories: [], // category names
  })
  
  // Modal state
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  
  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set())
  
  // Clear selection helper
  const clearSelection = () => setSelectedIds(new Set())

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date)
      
      // Date filter
      if (transactionDate < dateRangeStart || transactionDate > dateRangeEnd) {
        return false
      }
      
      // Bank filter
      if (filters.banks.length > 0 && !filters.banks.includes(t.bankId)) {
        return false
      }
      
      // Categorization filter
      if (filters.categorization.length > 0) {
        const isAICategorized = t.category && t.categorizedBy === 'ai'
        const isManual = t.category && t.categorizedBy === 'manual'
        const isUncategorized = !t.category
        
        const matchesFilter = 
          (filters.categorization.includes('ai') && isAICategorized) ||
          (filters.categorization.includes('manual') && isManual) ||
          (filters.categorization.includes('uncategorized') && isUncategorized)
        
        if (!matchesFilter) return false
      }
      
      // Receipt status filter
      if (filters.receiptStatus.length > 0) {
        const hasReceipt = t.hasAttachment
        const isPrivate = t.isPrivate
        
        const matchesFilter = 
          (filters.receiptStatus.includes('has-receipt') && hasReceipt) ||
          (filters.receiptStatus.includes('no-receipt') && !hasReceipt) ||
          (filters.receiptStatus.includes('private') && isPrivate)
        
        if (!matchesFilter) return false
      }
      
      // Category (expense category) filter
      if (filters.categories.length > 0 && !filters.categories.includes(t.category)) {
        return false
      }
      
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const counterparty = t.amount >= 0 ? t.sender : t.recipient
        const matchesCounterparty = counterparty?.toLowerCase().includes(query)
        const matchesReference = t.reference?.toLowerCase().includes(query)
        const matchesCategory = t.category?.toLowerCase().includes(query)
        const matchesAmount = Math.abs(t.amount).toString().includes(query) || 
                              formatCurrency(t.amount).toLowerCase().includes(query)
        if (!matchesCounterparty && !matchesReference && !matchesCategory && !matchesAmount) {
          return false
        }
      }
      
      return true
    })
  }, [transactions, dateRangeStart, dateRangeEnd, filters, searchQuery])

  // Count uncategorized
  const uncategorizedCount = useMemo(() => {
    return filteredTransactions.filter(t => !t.category).length
  }, [filteredTransactions])

  // Handle month change from MonthPicker
  const handleMonthChange = (date) => {
    setSelectedDate(date)
    setDateRangeStart(new Date(date.getFullYear(), date.getMonth(), 1))
    setDateRangeEnd(new Date(date.getFullYear(), date.getMonth() + 1, 0))
  }

  // Handle date range apply
  const handleDateRangeApply = (start, end) => {
    setDateRangeStart(start)
    setDateRangeEnd(end)
    setSelectedDate(start)
  }

  // Export transactions as CSV
  const handleExport = () => {
    const headers = ['Date', 'Counterparty', 'Reference', 'Amount', 'Category', 'Bank']
    const rows = filteredTransactions.map(t => [
      t.date,
      t.amount >= 0 ? t.sender : t.recipient,
      t.reference || '',
      t.amount,
      t.category || 'Uncategorized',
      getBankName(t.bankId)
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${dateRangeStart.toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Bank filter options for FilterDropdown
  const bankFilterOptions = bankAccounts.map(acc => ({ value: acc.bankId, label: acc.bankName }))

  // Category (expense) filter options - unique categories from transactions
  const expenseCategoryOptions = useMemo(() => {
    const categories = [...new Set(transactions.filter(t => t.category).map(t => t.category))]
    return categories.map(cat => ({ value: cat, label: cat }))
  }, [transactions])
  
  // Get active filters as array for displaying pills
  const activeFilters = useMemo(() => {
    const result = []
    
    if (filters.receiptStatus.length > 0) {
      const labels = {
        'has-receipt': 'Has Receipt',
        'no-receipt': 'No Receipt',
        'private': 'Private'
      }
      result.push({
        id: 'receiptStatus',
        label: 'Receipt',
        values: filters.receiptStatus.map(v => labels[v] || v)
      })
    }
    
    if (filters.categorization.length > 0) {
      const labels = {
        'ai': 'AI',
        'manual': 'Manual',
        'uncategorized': 'Uncategorized'
      }
      result.push({
        id: 'categorization',
        label: 'Categorization',
        values: filters.categorization.map(v => labels[v] || v)
      })
    }
    
    if (filters.banks.length > 0) {
      result.push({
        id: 'banks',
        label: 'Bank',
        values: filters.banks.map(bankId => {
          const bank = bankAccounts.find(b => b.bankId === bankId)
          return bank?.bankName || bankId
        })
      })
    }
    
    if (filters.categories.length > 0) {
      result.push({
        id: 'categories',
        label: 'Category',
        values: filters.categories
      })
    }
    
    return result
  }, [filters, bankAccounts])
  
  // Remove a specific filter
  const removeFilter = (filterId) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: []
    }))
  }
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      receiptStatus: [],
      categorization: [],
      banks: [],
      categories: [],
    })
  }
  
  // State for filter panel
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  // Table columns configuration
  const columns = [
    {
      header: 'Date',
      width: '100px',
      accessor: (row) => (
        <span className="text-13 text-[#656565]">
          {formatDate(row.date)}
        </span>
      ),
    },
    {
      header: 'Counterparty',
      accessor: (row) => (
        <span className="text-13 text-[#18181A]">
          {row.amount >= 0 ? row.sender : row.recipient}
        </span>
      ),
    },
    {
      header: 'Reference',
      accessor: (row) => (
        <span className="text-13 text-[#656565] truncate">
          {row.reference || '—'}
        </span>
      ),
    },
    {
      header: 'Amount',
      width: '120px',
      accessor: (row) => (
        <span className={`text-13 font-medium ${
          row.amount >= 0 ? 'text-[#50942A]' : 'text-[#F13B3B]'
        }`}>
          {row.amount >= 0 ? '+' : ''}{formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: 'Category',
      width: '140px',
      accessor: (row) => (
        row.category ? (
          <Badge variant="neutral">
            {row.category}
          </Badge>
        ) : (
          <span className="text-12 text-[#BBBBBB] italic">
            Uncategorized
          </span>
        )
      ),
    },
    {
      header: '',
      width: '40px',
      accessor: (row) => (
        row.hasAttachment ? (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              console.log('View attachment for', row.id)
            }}
            className="p-1 hover:bg-[#F0F0F0] rounded transition-colors"
          >
            <Paperclip className="w-4 h-4 text-[#8D8D8D]" />
          </button>
        ) : null
      ),
    },
    {
      header: 'Bank',
      width: '100px',
      accessor: (row) => (
        <span className="text-13 text-[#8D8D8D]">
          {getBankName(row.bankId)}
        </span>
      ),
    },
  ]

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const netBalance = totalIncome + totalExpenses

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            {account && onBack && (
              <button
                onClick={onBack}
                className="p-1.5 hover:bg-[#F0F0F0] rounded-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#8D8D8D]" />
              </button>
            )}
            {account ? (
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-xl border border-alpha-10 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: account.bankBgColor || '#F5F5F5' }}
                >
                  <img 
                    src={account.bankLogo} 
                    alt={account.bankName}
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentNode.innerHTML = `<span class="text-14 font-bold text-[#18181A]">${account.bankName?.charAt(0) || 'B'}</span>`
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-14 font-medium text-[#18181A]">{account.accountName}</h1>
                </div>
              </div>
            ) : (
              <h1 className="text-14 font-medium text-[#18181A]">All Transactions</h1>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              icon={Upload}
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload
            </Button>
          {uncategorizedCount > 0 && (
            <Button 
              size="sm" 
              icon={Sparkles}
              onClick={() => console.log('Start categorizing')}
            >
              Review now ({uncategorizedCount})
            </Button>
          )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-white">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-4">
            <p className="text-12 text-[#8D8D8D] mb-1">Total Income</p>
            <p className="text-16 font-semibold text-[#50942A]">
              +{formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-4">
            <p className="text-12 text-[#8D8D8D] mb-1">Total Expenses</p>
            <p className="text-16 font-semibold text-[#F13B3B]">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-4">
            <p className="text-12 text-[#8D8D8D] mb-1">Net Balance</p>
            <p className={`text-16 font-semibold ${netBalance >= 0 ? 'text-[#50942A]' : 'text-[#F13B3B]'}`}>
              {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-4">
          {/* Left: Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8D8D] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full h-9 pl-9 pr-3 bg-white border border-[#D9D9D9] rounded-sm text-14 text-[#18181A] placeholder:text-[#8D8D8D] hover:border-[#BBBBBB] focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring focus:outline-none transition-all duration-[120ms]"
            />
          </div>

          {/* Right: Filters */}
          <div className="flex items-center gap-2">
            {/* Clear all button when filters are active */}
            {activeFilters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-12 text-[#8D8D8D] hover:text-[#656565] transition-colors"
              >
                Clear all
              </button>
            )}
            
            {/* Filter Panel */}
            <AdvancedFilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              bankOptions={bankFilterOptions}
              categoryOptions={expenseCategoryOptions}
              isOpen={filterPanelOpen}
              onOpenChange={setFilterPanelOpen}
            />

            {/* Divider */}
            <div className="w-px h-5 bg-[#E8E8E8] mx-1" />

            {/* Month Picker */}
            <MonthPicker 
              selectedDate={selectedDate}
              onChange={handleMonthChange}
              onOpenDateRange={() => setIsDateRangeOpen(true)}
            />

            {/* Export Button */}
            <button 
              onClick={handleExport}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-[#D9D9D9] bg-white hover:bg-[#F0F0F0] transition-colors"
              title="Export CSV"
            >
              <Download className="w-4 h-4 text-[#656565]" />
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mb-3">
          <h2 className="text-14 font-medium text-[#18181A]">
            Transactions ({filteredTransactions.length})
          </h2>
        </div>
        <Table 
          columns={columns}
          data={filteredTransactions}
          selectable={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          rowIdAccessor={(row) => row.id}
        />
      </div>
      
      {/* Floating Selection Bar - appears at bottom when rows are selected */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-lg shadow-md border border-alpha-10">
            {/* Selection count */}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border-2 border-dashed border-[#8D8D8D] flex items-center justify-center">
                <span className="text-10 font-medium text-[#8D8D8D]">{selectedIds.size}</span>
              </div>
              <span className="text-13 font-medium text-[#18181A]">
                {selectedIds.size} transaction{selectedIds.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            {/* Divider */}
            <div className="w-px h-5 bg-[#E8E8E8]" />
            
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => console.log('Edit:', Array.from(selectedIds))}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" onClick={() => console.log('Categorize:', Array.from(selectedIds))}>
                Categorize
              </Button>
              <Button variant="secondary" size="sm" onClick={() => console.log('Export:', Array.from(selectedIds))}>
                Export
              </Button>
            </div>
            
            {/* Close button */}
            <button 
              onClick={clearSelection}
              className="ml-1 p-1.5 text-[#8D8D8D] hover:text-[#656565] hover:bg-[#F0F0F0] rounded transition-colors"
              title="Clear selection"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4L10 10M10 4L4 10" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Date Range Picker Modal */}
      <DateRangePicker
        isOpen={isDateRangeOpen}
        onClose={() => setIsDateRangeOpen(false)}
        startDate={dateRangeStart}
        endDate={dateRangeEnd}
        onApply={handleDateRangeApply}
      />

      {/* Upload Documents Modal */}
      <UploadDocumentsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  )
}

export default TransactionsTable
