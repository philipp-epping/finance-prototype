import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Sidebar, BankConnectionModal, BankAccountsTable, TransactionsTable, Dashboard, AccountDetailPanel, CategorizationFlow, ReceiptMatchingFlow, UploadDocumentsModal, DocumentsPage } from '../components'
import { Button, EmptyState } from '../components/ui'
import { sampleTransactions, accountNeedsAttention, sampleDocuments } from '../data/mockData'

function FinancePrototype() {
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      bankId: 'deutsche-bank',
      bankName: 'Deutsche Bank',
      bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Deutsche_Bank_logo_without_wordmark.svg',
      bankBgColor: '#E8F0FE',
      connectionType: 'automatic',
      iban: 'DE89 3704 0044 0532 0130 00',
      bic: 'DEUTDEDB',
      accountName: 'Business Main',
      accountType: 'operative',
      balance: 45230.50,
      lastSynced: new Date().toISOString(),
      isActive: true,
    },
    {
      id: 2,
      bankId: 'sparkasse-berlin',
      bankName: 'Sparkasse',
      bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sparkasse.svg/512px-Sparkasse.svg.png',
      bankBgColor: '#FFF5F5',
      connectionType: 'manual',
      iban: 'DE12 1005 0000 0190 0987 65',
      bic: 'BELADEBE',
      accountName: 'Tax Reserve',
      accountType: 'tax',
      balance: 12500.00,
      lastSynced: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      monthlyStatus: {},
    },
    {
      id: 3,
      bankId: 'commerzbank',
      bankName: 'Commerzbank',
      bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Commerzbank_2017.svg/512px-Commerzbank_2017.svg.png',
      bankBgColor: '#FFF9E6',
      connectionType: 'automatic',
      iban: 'DE45 5004 0000 0123 4567 89',
      bic: 'COBADEFF',
      accountName: 'Savings',
      accountType: 'savings',
      balance: 28750.00,
      lastSynced: null,
      isActive: true,
      monthlyStatus: {},
    },
    {
      id: 4,
      bankId: 'n26',
      bankName: 'N26',
      bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/N26_logo.svg/512px-N26_logo.svg.png',
      bankBgColor: '#E8F5E9',
      connectionType: 'manual',
      iban: 'DE27 1001 1001 2620 1234 56',
      bic: 'NTSBDEB1',
      accountName: 'Freelance Income',
      accountType: 'operative',
      balance: 8320.00,
      lastSynced: null,
      isActive: true,
      monthlyStatus: {},
    },
  ])
  const [selectedNav, setSelectedNav] = useState('dashboard')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [showDeactivated, setShowDeactivated] = useState(false)
  const [detailPanelAccountId, setDetailPanelAccountId] = useState(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  
  const detailPanelAccount = bankAccounts.find(acc => acc.id === detailPanelAccountId) || null
  
  const [selectedMonth] = useState(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return year + '-' + month
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setIsNavVisible(prev => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAddBankAccount = (account) => {
    setBankAccounts(prev => [...prev, { ...account, id: prev.length + 1 }])
  }

  const handleToggleAccountActive = (accountId) => {
    setBankAccounts(prev => prev.map(acc =>
      acc.id === accountId ? { ...acc, isActive: !acc.isActive } : acc
    ))
  }

  const handleDeleteAccount = (accountId) => {
    const account = bankAccounts.find(acc => acc.id === accountId)
    if (account && !account.isActive) {
      setBankAccounts(prev => prev.filter(acc => acc.id !== accountId))
    }
  }

  const handleSyncAccount = (accountId) => {
    setBankAccounts(prev => prev.map(acc =>
      acc.id === accountId ? { ...acc, lastSynced: new Date().toISOString() } : acc
    ))
  }

  const handleMarkMonthComplete = (accountId, month) => {
    setBankAccounts(prev => prev.map(acc =>
      acc.id === accountId 
        ? { ...acc, monthlyStatus: { ...acc.monthlyStatus, [month]: 'complete' } } 
        : acc
    ))
  }

  const handleUndoMonthComplete = (accountId, month) => {
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id !== accountId) return acc
      const newMonthlyStatus = { ...acc.monthlyStatus }
      delete newMonthlyStatus[month]
      return { ...acc, monthlyStatus: newMonthlyStatus }
    }))
  }

  const handleOpenAccountPanel = (account) => {
    setDetailPanelAccountId(account.id)
  }

  const handleCloseAccountPanel = () => {
    setDetailPanelAccountId(null)
  }

  const activeAccounts = bankAccounts.filter(acc => acc.isActive !== false)
  const deactivatedAccounts = bankAccounts.filter(acc => acc.isActive === false)

  const handleViewTransactions = (account) => {
    setSelectedAccount(account)
    setSelectedNav('transactions')
  }

  const handleNavChange = (nav) => {
    setSelectedNav(nav)
    if (nav !== 'transactions') {
      setSelectedAccount(null)
    }
  }

  const getTransactionsForAccount = () => {
    if (!selectedAccount) return sampleTransactions
    return sampleTransactions.filter(t => t.bankId === selectedAccount.bankId)
  }

  const renderContent = () => {
    switch (selectedNav) {
      case 'dashboard':
        return <Dashboard bankAccounts={bankAccounts} transactions={sampleTransactions} onNavigate={handleNavChange} />
      case 'accounts':
        return renderAccountsContent()
      case 'transactions':
        return <TransactionsTable account={selectedAccount} transactions={getTransactionsForAccount()} bankAccounts={bankAccounts} onBack={() => { setSelectedAccount(null); setSelectedNav('accounts') }} />
      case 'categorization':
      case 'review':
        return <CategorizationFlow transactions={sampleTransactions} onComplete={() => handleNavChange('dashboard')} />
      case 'receipts':
        return <ReceiptMatchingFlow onBack={() => handleNavChange('dashboard')} />
      case 'documents':
        return <DocumentsPage />
      default:
        return <Dashboard bankAccounts={bankAccounts} transactions={sampleTransactions} onNavigate={handleNavChange} />
    }
  }

  const renderAccountsContent = () => {
    const deactivatedCount = deactivatedAccounts.length
    const deactivatedText = showDeactivated 
      ? '- Hide ' + deactivatedCount + ' deactivated account' + (deactivatedCount > 1 ? 's' : '')
      : '+ ' + deactivatedCount + ' deactivated account' + (deactivatedCount > 1 ? 's' : '')
    
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b border-[#E8E8E8]">
          <div className="px-3 py-2.5 flex items-center justify-between">
            <div className="px-1">
              <h1 className="text-14 font-medium text-[#18181A]">Cash Accounts</h1>
            </div>
            <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
              {bankAccounts.length === 0 ? 'Connect account' : 'Add account'}
            </Button>
          </div>
        </div>

        {bankAccounts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-white">
            <EmptyState
              title="No cash accounts connected yet"
              description="Connect your first cash account to start tracking your transactions."
              action={<Button onClick={() => setIsModalOpen(true)}>Connect your first account</Button>}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6 bg-white">
            <BankAccountsTable 
              accounts={showDeactivated ? bankAccounts : activeAccounts}
              onViewTransactions={handleViewTransactions}
              onToggleActive={handleToggleAccountActive}
              onDelete={handleDeleteAccount}
              onAccountClick={handleOpenAccountPanel}
              selectedMonth={selectedMonth}
            />
            
            {deactivatedAccounts.length > 0 && (
              <button
                onClick={() => setShowDeactivated(!showDeactivated)}
                className="mt-4 text-13 text-[#8D8D8D] hover:text-[#656565] transition-colors"
              >
                {deactivatedText}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  const uncategorizedCount = sampleTransactions.filter(t => !t.category || t.category === 'uncategorized').length
  const unmatchedReceiptsCount = 3
  const unmatchedDocumentsCount = sampleDocuments.filter(d => d.status === 'unmatched').length
  const accountsNeedingAttentionCount = bankAccounts.filter(acc => accountNeedsAttention(acc, selectedMonth)).length

  return (
    <div className="flex h-screen bg-[#F9F9F9]">
      <Sidebar 
        selectedNav={selectedNav}
        onNavChange={handleNavChange}
        accountsNeedingAttention={accountsNeedingAttentionCount}
        isCollapsed={!isNavVisible}
        onToggleNav={() => setIsNavVisible(!isNavVisible)}
        uncategorizedCount={uncategorizedCount}
        unmatchedReceiptsCount={unmatchedReceiptsCount}
        unmatchedDocumentsCount={unmatchedDocumentsCount}
        backLink="/"
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      {detailPanelAccount && (
        <AccountDetailPanel
          account={detailPanelAccount}
          isOpen={true}
          onClose={handleCloseAccountPanel}
          onSync={handleSyncAccount}
          onMarkComplete={handleMarkMonthComplete}
          onUndoComplete={handleUndoMonthComplete}
          onViewTransactions={handleViewTransactions}
          selectedMonth={selectedMonth}
        />
      )}

      <BankConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddBankAccount}
      />

      <UploadDocumentsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  )
}

export default FinancePrototype
