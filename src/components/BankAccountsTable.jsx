import React, { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Zap, FileEdit, ExternalLink, MoreHorizontal, Eye, Pencil, Link, PowerOff, Trash2, Copy, Check, Upload, AlertCircle, CheckCircle2, AlertTriangle, XCircle, Unplug } from 'lucide-react'
import { Table, Badge } from './ui'
import { accountTypes, maskIban, formatCurrency, getAccountCoverageStatus, COVERAGE_STATUS, getDaysSinceLastSync, accountNeedsAttention } from '../data/mockData'

// Copyable IBAN Component
const CopyableIban = ({ iban }) => {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = async (e) => {
    e.stopPropagation()
    const cleanIban = iban.replace(/\s/g, '')
    await navigator.clipboard.writeText(cleanIban)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-1.5 text-13 text-[#656565] font-mono hover:text-[#18181A] transition-colors group whitespace-nowrap"
    >
      <span className="whitespace-nowrap">{maskIban(iban)}</span>
      <span className={`transition-opacity ${isHovered || copied ? 'opacity-100' : 'opacity-0'}`}>
        {copied ? (
          <Check className="w-3.5 h-3.5 text-[#50942A]" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-[#8D8D8D] group-hover:text-[#656565]" />
        )}
      </span>
    </button>
  )
}

// Status Badge Component with accessible icons and contextual text
const StatusBadge = ({ account, targetMonth }) => {
  const coverage = getAccountCoverageStatus(account, targetMonth)
  
  // Get short month + year format (e.g., "Jan '26")
  const date = new Date(targetMonth + '-01')
  const shortMonth = date.toLocaleDateString('en-US', { month: 'short' })
  const shortYear = String(date.getFullYear()).slice(-2)
  const shortDate = `${shortMonth} ${shortYear}`
  
  // Map status to icon, color, and display text
  const getStatusDisplay = () => {
    switch (coverage.status) {
      case COVERAGE_STATUS.COMPLETE:
        return {
          Icon: CheckCircle2,
          colorClass: 'text-[#50942A]',
          text: shortDate
        }
      case COVERAGE_STATUS.INCOMPLETE:
        return {
          Icon: AlertTriangle,
          colorClass: 'text-[#FEA101]',
          text: 'Incomplete'
        }
      case COVERAGE_STATUS.MISSING:
        return {
          Icon: XCircle,
          colorClass: 'text-[#F13B3B]',
          text: 'No data'
        }
      case COVERAGE_STATUS.DISCONNECTED:
        return {
          Icon: Unplug,
          colorClass: 'text-[#8D8D8D]',
          text: 'Disconnected'
        }
      default:
        return {
          Icon: XCircle,
          colorClass: 'text-[#F13B3B]',
          text: coverage.label
        }
    }
  }
  
  const { Icon, colorClass, text } = getStatusDisplay()
  
  return (
    <span className="inline-flex items-center gap-1.5 text-13 text-[#656565] whitespace-nowrap">
      <Icon className={`w-4 h-4 ${colorClass}`} />
      <span>{text}</span>
    </span>
  )
}

// Context Menu Component
const ContextMenu = ({ row, onViewTransactions, onToggleActive, onDelete, coverageStatus }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const isDeactivated = row.isActive === false

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = (e) => {
    e.stopPropagation()
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 208,
      })
    }
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { icon: Eye, label: 'Show transactions', onClick: () => onViewTransactions(row) },
    { icon: Pencil, label: 'Edit account', onClick: () => console.log('Edit', row) },
    ...(coverageStatus?.status === COVERAGE_STATUS.DISCONNECTED && row.connectionType === 'automatic' ? [
      { icon: Link, label: 'Reconnect account', onClick: () => console.log('Reconnect', row) }
    ] : []),
    { divider: true },
    { 
      icon: PowerOff, 
      label: isDeactivated ? 'Reactivate account' : 'Deactivate account', 
      onClick: () => onToggleActive?.(row.id) 
    },
    ...(isDeactivated ? [{ 
      icon: Trash2, 
      label: 'Delete account', 
      onClick: () => onDelete?.(row.id), 
      danger: true,
    }] : []),
  ]

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="p-1.5 rounded hover:bg-[#F0F0F0] transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-[#8D8D8D]" />
      </button>
      
      {isOpen && createPortal(
        <div 
          ref={menuRef}
          className="fixed w-52 bg-white border border-[#E8E8E8] rounded-lg shadow-md py-1.5 z-[1000]"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          {menuItems.map((item, idx) => 
            item.divider ? (
              <div key={idx} className="border-t border-[#E8E8E8] my-1" />
            ) : (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  item.onClick()
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-13 text-left transition-colors hover:bg-[#F0F0F0] ${
                  item.danger ? 'text-[#F13B3B]' : 'text-[#18181A]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          )}
        </div>,
        document.body
      )}
    </>
  )
}

// Section Header Component
const SectionHeader = ({ title, count, variant = 'default' }) => (
  <div className={`flex items-center gap-2 px-4 py-3 ${variant === 'attention' ? 'bg-[#FFF8EA]' : 'bg-[#F0F0F0]'} border-b border-[#E8E8E8]`}>
    {variant === 'attention' && <AlertCircle className="w-4 h-4 text-[#FEA101]" />}
    <span className={`text-13 font-semibold ${variant === 'attention' ? 'text-[#4D361A]' : 'text-[#656565]'}`}>
      {title}
    </span>
    <span className={`text-12 ${variant === 'attention' ? 'text-[#E99D3C]' : 'text-[#8D8D8D]'}`}>
      ({count})
    </span>
  </div>
)

const BankAccountsTable = ({ accounts, onViewTransactions, onToggleActive, onDelete, onAccountClick, selectedMonth, onUploadData, onReconnect }) => {
  // Get current month in YYYY-MM format as default
  const currentMonth = selectedMonth || (() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })()

  // Get account type label
  const getAccountTypeLabel = (value) => {
    const type = accountTypes.find(t => t.value === value)
    return type ? type.label : value
  }

  // Split and sort accounts
  const { needsAttentionAccounts, healthyAccounts } = useMemo(() => {
    const needsAttention = []
    const healthy = []
    
    accounts.forEach(account => {
      // Skip inactive accounts - put them at the end of healthy
      if (account.isActive === false) {
        healthy.push(account)
        return
      }
      
      if (accountNeedsAttention(account, currentMonth)) {
        needsAttention.push(account)
      } else {
        healthy.push(account)
      }
    })
    
    // Sort needs attention by oldest incomplete first (most days since sync)
    needsAttention.sort((a, b) => getDaysSinceLastSync(b) - getDaysSinceLastSync(a))
    
    return {
      needsAttentionAccounts: needsAttention,
      healthyAccounts: healthy
    }
  }, [accounts, currentMonth])

  // Get action button based on coverage status
  const getActionButton = (row, coverageStatus) => {
    if (row.isActive === false) {
      return (
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onViewTransactions(row)
          }}
          className="flex items-center gap-1.5 text-13 font-medium text-[#8D8D8D] hover:text-[#656565] transition-colors whitespace-nowrap"
        >
          View transactions
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      )
    }
    
    if (coverageStatus.status === COVERAGE_STATUS.DISCONNECTED) {
      return (
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onReconnect?.(row) || console.log('Reconnect', row)
          }}
          className="flex items-center gap-1.5 text-13 font-medium text-[#4D5FFF] hover:text-[#4555E3] transition-colors whitespace-nowrap"
        >
          Reconnect
          <Link className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      )
    }
    
    if (coverageStatus.status === COVERAGE_STATUS.INCOMPLETE || coverageStatus.status === COVERAGE_STATUS.MISSING) {
      return (
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onUploadData?.(row) || console.log('Upload data', row)
          }}
          className="flex items-center gap-1.5 text-13 font-medium text-[#4D5FFF] hover:text-[#4555E3] transition-colors whitespace-nowrap"
        >
          Upload data
          <Upload className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      )
    }
    
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation()
          onViewTransactions(row)
        }}
        className="flex items-center gap-1.5 text-13 font-medium text-[#4D5FFF] hover:text-[#4555E3] transition-colors whitespace-nowrap"
      >
        View transactions
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
      </button>
    )
  }

  // Table columns configuration
  const getColumns = () => [
    {
      header: 'Account',
      width: '240px',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div 
            className={`w-[18px] h-[18px] rounded border border-alpha-10 flex items-center justify-center overflow-hidden ${row.isActive === false ? 'opacity-50' : ''}`}
            style={{ backgroundColor: row.bankBgColor || '#F5F5F5' }}
          >
            <img 
              src={row.bankLogo} 
              alt={row.bankName}
              className="w-3 h-3 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentNode.innerHTML = `<span class="text-[8px] font-bold text-[#18181A]">${row.bankName?.charAt(0) || 'B'}</span>`
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className={`text-13 font-medium ${row.isActive === false ? 'text-[#8D8D8D]' : 'text-[#656565]'}`}>
              {row.bankName}
            </span>
            <span className={`text-12 ${row.isActive === false ? 'text-[#BBBBBB]' : 'text-[#8D8D8D]'}`}>
              {row.accountName}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'IBAN',
      width: '180px',
      accessor: (row) => <CopyableIban iban={row.iban} />,
    },
    {
      header: 'Balance',
      width: '120px',
      accessor: (row) => (
        <span className="text-13 font-medium text-[#18181A]">
          {formatCurrency(row.balance || 0)}
        </span>
      ),
    },
    {
      header: 'Type',
      width: '100px',
      accessor: (row) => (
        <span className="text-13 text-[#656565]">
          {getAccountTypeLabel(row.accountType)}
        </span>
      ),
    },
    {
      header: 'Connection',
      width: '100px',
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          {row.connectionType === 'automatic' ? (
            <>
              <Zap className="w-3.5 h-3.5 text-[#50942A]" />
              <span className="text-13 text-[#50942A]">Auto</span>
            </>
          ) : (
            <>
              <FileEdit className="w-3.5 h-3.5 text-[#8D8D8D]" />
              <span className="text-13 text-[#8D8D8D]">Manual</span>
            </>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      width: '170px',
      accessor: (row) => <StatusBadge account={row} targetMonth={currentMonth} />,
    },
    {
      header: '',
      width: '200px',
      accessor: (row) => {
        const coverageStatus = getAccountCoverageStatus(row, currentMonth)
        return (
          <div className="flex items-center justify-end gap-2">
            {getActionButton(row, coverageStatus)}
            <ContextMenu 
              row={row} 
              onViewTransactions={onViewTransactions}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
              coverageStatus={coverageStatus}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Needs Attention Section */}
      {needsAttentionAccounts.length > 0 && (
        <div className="mb-4">
          <SectionHeader 
            title="Needs Attention" 
            count={needsAttentionAccounts.length} 
            variant="attention"
          />
          <div className="overflow-x-auto">
            <Table 
              columns={getColumns()}
              data={needsAttentionAccounts}
              onRowClick={onAccountClick || onViewTransactions}
            />
          </div>
        </div>
      )}
      
      {/* Healthy Accounts Section */}
      {healthyAccounts.length > 0 && (
        <div>
          <SectionHeader 
            title="Healthy Accounts" 
            count={healthyAccounts.length}
          />
          <div className="overflow-x-auto">
            <Table 
              columns={getColumns()}
              data={healthyAccounts}
              onRowClick={onAccountClick || onViewTransactions}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default BankAccountsTable
