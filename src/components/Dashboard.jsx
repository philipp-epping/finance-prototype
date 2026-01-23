import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle, ArrowRight, ArrowUpRight, Zap, Play } from 'lucide-react'
import { Button, Tabs } from './ui'
import { formatCurrency, sampleTransactions } from '../data/mockData'

const Dashboard = ({ 
  bankAccounts = [], 
  transactions = sampleTransactions,
  onNavigate 
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState('insights')
  
  // Items needing review (mock count)
  const itemsNeedingReview = 10
  
  const tabs = [
    { id: 'insights', label: 'Insights', badge: itemsNeedingReview > 0 ? itemsNeedingReview : null },
    { id: 'cash', label: 'Cash' },
    { id: 'cashflow', label: 'Cashflow' },
    { id: 'tax', label: 'Tax' },
    { id: 'receivables', label: 'Receivables' },
  ]
  
  // Month state - default to current month in format "YYYY-MM"
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  
  // Format month for display (German locale)
  const formatMonth = (monthStr) => {
    const date = new Date(monthStr + '-01')
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
  }
  
  // Navigate months
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
  
  // Get month name for AI input placeholder
  const currentMonthName = useMemo(() => {
    const date = new Date(selectedMonth + '-01')
    return date.toLocaleDateString('en-US', { month: 'long' })
  }, [selectedMonth])
  
  // Mock data for the dashboard
  const metrics = {
    netCashChange: { value: '+112.2k €', subtitle: 'vs last month', positive: true },
    runwayChange: { value: '+0.3 months', subtitle: 'Current runway: 3.8 months', positive: true },
    taxCoverage: { value: 'covered', subtitle: 'Next tax event: Mar 18', covered: true },
    freeCash: { value: '212.2k €', subtitle: 'after confirmed tax liabilities', positive: true },
  }
  
  const costSpikes = [
    { id: 1, icon: Play, name: 'YouTube Adspend', change: 48, amount: 32000.53 },
    { id: 2, icon: Play, name: 'Team Event', change: 28, amount: 32000.53 },
    { id: 3, icon: Play, name: 'Equipment', change: 18, amount: 32000.53 },
  ]
  
  const mainDebtors = [
    { id: 1, name: 'ABC Media', amount: 64000, color: '#F13B3B' },
    { id: 2, name: 'Perplexity', amount: 44000, color: '#FEA101' },
    { id: 3, name: 'PPC Masters', amount: 12000, color: '#FEA101' },
  ]

  // Metric Card Component
  const MetricCard = ({ title, value, subtitle, positive, covered }) => (
    <div className="bg-white rounded-xl border border-[#E8E8E8] p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-13 text-[#656565]">{title}</span>
        {(positive || covered) && (
          <div className="w-2 h-2 rounded-full bg-[#50942A]" />
        )}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-32 font-semibold text-[#18181A] tracking-tight leading-none">
          {value}
        </span>
        {covered && <span className="text-24">✅</span>}
      </div>
      <p className="text-12 text-[#8D8D8D]">{subtitle}</p>
    </div>
  )

  // Cost Spike Item Component
  const CostSpikeItem = ({ icon: Icon, name, change, amount }) => (
    <div className="flex items-center gap-3 p-3 bg-[#F0F0F0] rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-[#FFF8EA] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#FEA101]" />
      </div>
      <span className="text-14 text-[#18181A] flex-1">{name}</span>
      <div className="flex items-center gap-1 text-[#F13B3B]">
        <ArrowUpRight className="w-3.5 h-3.5" />
        <span className="text-13 font-medium">{change}%</span>
      </div>
      <span className="text-14 font-medium text-[#18181A] ml-4">
        {formatCurrency(amount)}
      </span>
    </div>
  )

  // Debtor Item Component
  const DebtorItem = ({ name, amount, color }) => (
    <div className="flex items-center gap-3 p-3 bg-[#F0F0F0] rounded-lg">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-12 font-semibold"
        style={{ backgroundColor: color }}
      >
        {name.charAt(0)}
      </div>
      <span className="text-14 text-[#18181A] flex-1">{name}</span>
      <span className="text-14 font-medium text-[#18181A]">
        {formatCurrency(amount)}
      </span>
    </div>
  )
  
  // Render Insights tab content
  const renderInsightsContent = () => (
    <div className="flex-1 overflow-auto p-6 pb-24 bg-[#F9F9F9]">
      <div className="max-w-5xl mx-auto">
        {/* Alert Banner */}
        <div className="flex items-center justify-between p-4 bg-[#FFF8EA] border border-[#FFE3B7] rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEA101] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-14 font-semibold text-[#18181A]">{itemsNeedingReview} items need review</p>
              <p className="text-13 text-[#656565]">Review to get accurate {currentMonthName} Metrics</p>
            </div>
          </div>
          <Button onClick={() => onNavigate?.('categorization')}>
            Start review
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          </div>
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard 
            title="Net Cash Change" 
            value={metrics.netCashChange.value}
            subtitle={metrics.netCashChange.subtitle}
            positive={metrics.netCashChange.positive}
          />
          <MetricCard 
            title="Runway Change" 
            value={metrics.runwayChange.value}
            subtitle={metrics.runwayChange.subtitle}
            positive={metrics.runwayChange.positive}
          />
          <MetricCard 
            title="Tax Coverage (Next 90 Days)" 
            value={metrics.taxCoverage.value}
            subtitle={metrics.taxCoverage.subtitle}
            covered={metrics.taxCoverage.covered}
          />
          <MetricCard 
            title="Free Cash (After Tax)" 
            value={metrics.freeCash.value}
            subtitle={metrics.freeCash.subtitle}
            positive={metrics.freeCash.positive}
          />
        </div>
        
        {/* Two Column Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Cost Spikes */}
          <div className="bg-white rounded-xl border border-[#E8E8E8] p-5">
        <div className="mb-4">
              <h3 className="text-14 font-semibold text-[#18181A]">Cost spikes this month</h3>
              <p className="text-12 text-[#8D8D8D]">vs avg past 3 months</p>
            </div>
            <div className="space-y-2 mb-4">
              {costSpikes.map(spike => (
                <CostSpikeItem key={spike.id} {...spike} />
              ))}
            </div>
            <p className="text-12 text-[#8D8D8D]">
              These cost spikes reduced this month's cash result by €34k (~30%).
            </p>
          </div>
          
          {/* Main Debtors */}
          <div className="bg-white rounded-xl border border-[#E8E8E8] p-5">
            <div className="mb-4">
              <h3 className="text-14 font-semibold text-[#18181A]">Main Debtors</h3>
              <p className="text-12 text-[#8D8D8D]">Overdue &gt;30 days</p>
            </div>
            <div className="space-y-2 mb-4">
              {mainDebtors.map(debtor => (
                <DebtorItem key={debtor.id} {...debtor} />
              ))}
            </div>
            <p className="text-12 text-[#8D8D8D]">
              Collecting these adds +0.6 months runway
            </p>
          </div>
          </div>
        </div>
        
      {/* AI Input Bar - Fixed floating at bottom */}
      <div className="fixed bottom-4 left-[272px] right-0 flex justify-center z-10 pointer-events-none">
        <div className="p-[2px] rounded-xl bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#4D5FFF] pointer-events-auto">
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg">
            <Zap className="w-4 h-4 text-[#4D5FFF]" />
            <input
              type="text"
              placeholder={`What else do you want to know about ${currentMonthName}?`}
              className="flex-1 text-14 text-[#18181A] placeholder:text-[#656565] bg-transparent outline-none min-w-[320px]"
            />
            <span className="text-12 text-[#8D8D8D]">⌥I</span>
          </div>
        </div>
      </div>
      </div>
    )
  
  // Render tab content
  const renderTabContent = () => {
    if (activeTab === 'insights') {
      return renderInsightsContent()
    }
    
      return (
      <div className="flex-1 flex items-center justify-center bg-[#F9F9F9]">
          <div className="text-center">
            <p className="text-16 font-medium text-[#18181A] mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </p>
            <p className="text-14 text-[#8D8D8D]">Coming soon</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-3 flex items-center justify-between">
          <h1 className="text-14 font-medium text-[#18181A]">Finances</h1>
          
          {/* Month Selector */}
          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousMonth}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F0F0F0] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#656565]" />
            </button>
            <div className="px-3 py-1.5 min-w-[140px] text-center">
              <span className="text-14 font-medium text-[#18181A] capitalize">
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
      
      {/* Tabs */}
      <div className="bg-white px-6 border-b border-[#E8E8E8]">
        <Tabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      
      {/* Content */}
      {renderTabContent()}
    </div>
  )
}

export default Dashboard
