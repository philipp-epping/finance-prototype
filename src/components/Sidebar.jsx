import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowRightLeft, 
  PanelLeftClose, 
  PanelLeft,
  FileCheck,
  ChevronDown,
  CircleDollarSign,
  Search,
  FileText,
  HelpCircle,
  X
} from 'lucide-react'
import Tooltip from './ui/Tooltip'

const Sidebar = ({ 
  selectedNav, 
  onNavChange, 
  accountsNeedingAttention = 0,
  isCollapsed = false, 
  onToggleNav,
  uncategorizedCount = 0,
  unmatchedReceiptsCount = 0,
  unmatchedDocumentsCount = 0
}) => {
  const [financesExpanded, setFinancesExpanded] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(true)
  
  const totalReviewItems = uncategorizedCount + unmatchedReceiptsCount

  // Collapsed sidebar view
  if (isCollapsed) {
    return (
      <aside className="w-14 bg-[#FAFAFA] border-r border-[#E8E8E8] flex flex-col flex-shrink-0 transition-all duration-200">
        {/* Header with Company Icon and Toggle */}
        <div className="p-2 flex flex-col items-center gap-2">
          <div className="w-8 h-8 bg-[#4D5FFF] rounded-sm flex items-center justify-center">
            <span className="text-12 font-semibold text-white">L</span>
          </div>
          <Tooltip content="Expand sidebar" shortcut="⌘B" position="right">
            <button
              onClick={onToggleNav}
              className="w-8 h-8 flex items-center justify-center rounded-sm text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565] transition-colors duration-[120ms]"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center py-2 space-y-1">
          <Tooltip content="Dashboard" position="right">
            <button
              onClick={() => onNavChange('dashboard')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-[120ms] ${
                selectedNav === 'dashboard'
                  ? 'bg-[#F0F0F0] text-[#18181A]'
                  : 'text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Cash Accounts" position="right">
            <button
              onClick={() => onNavChange('accounts')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-[120ms] ${
                selectedNav === 'accounts'
                  ? 'bg-[#F0F0F0] text-[#18181A]'
                  : 'text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Review Queue" position="right">
            <button
              onClick={() => onNavChange('review')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-[120ms] relative ${
                selectedNav === 'review'
                  ? 'bg-[#F0F0F0] text-[#18181A]'
                  : 'text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565]'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              {totalReviewItems > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F13B3B]" />
              )}
            </button>
          </Tooltip>
          <Tooltip content="Transactions" position="right">
            <button
              onClick={() => onNavChange('transactions')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-[120ms] ${
                selectedNav === 'transactions'
                  ? 'bg-[#F0F0F0] text-[#18181A]'
                  : 'text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565]'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Documents" position="right">
            <button
              onClick={() => onNavChange('documents')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-[120ms] relative ${
                selectedNav === 'documents'
                  ? 'bg-[#F0F0F0] text-[#18181A]'
                  : 'text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565]'
              }`}
            >
              <FileText className="w-4 h-4" />
              {unmatchedDocumentsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FEA101]" />
              )}
            </button>
          </Tooltip>
        </nav>

        {/* Bottom - Get Help */}
        <div className="p-2 flex justify-center">
          <Tooltip content="Get Help" position="right">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565] transition-colors duration-[120ms]">
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </aside>
    )
  }

  // Expanded sidebar view - 272px from Figma
  return (
    <aside className="w-[272px] bg-[#FAFAFA] border-r border-[#E8E8E8] flex flex-col flex-shrink-0 transition-all duration-200">
      {/* Company Header / Org Switch */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 bg-[#4D5FFF] rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-12 font-semibold text-white">L</span>
            </div>
            <span className="text-14 font-medium text-[#18181A] truncate">Lifetime</span>
            <ChevronDown className="w-4 h-4 text-[#8D8D8D] flex-shrink-0" />
          </div>
          <Tooltip content="Collapse sidebar" shortcut="⌘B" position="bottom">
            <button
              onClick={onToggleNav}
              className="w-6 h-6 flex items-center justify-center rounded-sm text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565] transition-colors duration-[120ms]"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
        
        {/* Jump to... Search Button */}
        <button className="w-full mt-2 px-3 py-2 bg-white rounded-lg shadow-xs flex items-center justify-between text-14 text-[#656565] hover:bg-[#F9F9F9] transition-colors">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#8D8D8D]" />
            <span>Jump to...</span>
          </div>
          <span className="px-1.5 py-0.5 bg-white border border-[#E8E8E8] rounded-sm text-12 text-[#8D8D8D]">⌘K</span>
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {/* Finances Section - Expandable */}
        <div>
          <button
            onClick={() => setFinancesExpanded(!financesExpanded)}
            className={`w-full h-9 px-3 rounded-lg flex items-center justify-between text-14 transition-colors duration-[120ms] ${
              ['dashboard', 'accounts', 'transactions', 'review', 'documents'].includes(selectedNav)
                ? 'text-[#18181A]'
                : 'text-[#3D3D3F] hover:bg-[#F0F0F0]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <CircleDollarSign className="w-4 h-4" />
              Finances
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${financesExpanded ? '' : '-rotate-90'}`} />
          </button>
          
          {/* Sub-items */}
          {financesExpanded && (
            <div className="ml-3 mt-0.5 border-l border-[#E8E8E8]">
              {/* Dashboard */}
              <button
                onClick={() => onNavChange('dashboard')}
                className={`w-full h-8 pl-5 pr-3 rounded-lg flex items-center text-14 transition-colors duration-[120ms] ${
                  selectedNav === 'dashboard'
                    ? 'bg-[#F0F0F0] text-[#18181A] font-medium'
                    : 'text-[#3D3D3F] hover:bg-[#F0F0F0]'
                }`}
              >
                Dashboard
              </button>
              
              {/* Cash Accounts */}
              <button
                onClick={() => onNavChange('accounts')}
                className={`w-full h-8 pl-5 pr-3 rounded-lg flex items-center justify-between text-14 transition-colors duration-[120ms] mt-0.5 ${
                  selectedNav === 'accounts'
                    ? 'bg-[#F0F0F0] text-[#18181A] font-medium'
                    : 'text-[#3D3D3F] hover:bg-[#F0F0F0]'
                }`}
              >
                <span>Cash Accounts</span>
                {accountsNeedingAttention > 0 && (
                  <span className="text-10 bg-[#FFF7F6] text-[#F13B3B] px-1.5 py-0.5 rounded-full font-medium">
                    {accountsNeedingAttention}
                  </span>
                )}
              </button>
              
              {/* Transactions */}
              <button
                onClick={() => onNavChange('transactions')}
                className={`w-full h-8 pl-5 pr-3 rounded-lg flex items-center text-14 transition-colors duration-[120ms] mt-0.5 ${
                  selectedNav === 'transactions'
                    ? 'bg-[#F0F0F0] text-[#18181A] font-medium'
                    : 'text-[#3D3D3F] hover:bg-[#F0F0F0]'
                }`}
              >
                Transactions
              </button>
              
              {/* Documents */}
              <button
                onClick={() => onNavChange('documents')}
                className={`w-full h-8 pl-5 pr-3 rounded-lg flex items-center justify-between text-14 transition-colors duration-[120ms] mt-0.5 ${
                  selectedNav === 'documents'
                    ? 'bg-[#F0F0F0] text-[#18181A] font-medium'
                    : 'text-[#3D3D3F] hover:bg-[#F0F0F0]'
                }`}
              >
                <span>Documents</span>
                {unmatchedDocumentsCount > 0 && (
                  <span className="text-10 bg-[#FFF8EA] text-[#4D361A] px-1.5 py-0.5 rounded-full font-medium">
                    {unmatchedDocumentsCount}
                  </span>
                )}
              </button>
              
              {/* Review Queue */}
              <button
                onClick={() => onNavChange('review')}
                className={`w-full h-8 pl-5 pr-3 rounded-lg flex items-center justify-between text-14 transition-colors duration-[120ms] mt-0.5 ${
                  selectedNav === 'review'
                    ? 'bg-[#F0F0F0] text-[#18181A] font-medium'
                    : 'text-[#3D3D3F] hover:bg-[#F0F0F0]'
                }`}
              >
                <span>Review Queue</span>
                {totalReviewItems > 0 && (
                  <span className="text-10 bg-[#FFF7F6] text-[#F13B3B] px-1.5 py-0.5 rounded-full font-medium">
                    {totalReviewItems}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Onboarding Card */}
      {showOnboarding && (
        <div className="px-3 py-2">
          <div className="bg-white rounded-xl shadow-xs p-4 relative">
            <button 
              onClick={() => setShowOnboarding(false)}
              className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-sm text-[#8D8D8D] hover:bg-[#F0F0F0] hover:text-[#656565] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F7F9FF] flex items-center justify-center flex-shrink-0">
                <CircleDollarSign className="w-4 h-4 text-[#4D5FFF]" />
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-13 font-medium text-[#18181A] mb-1">Connect your bank</p>
                <p className="text-12 text-[#8D8D8D] leading-relaxed">Link your accounts to automatically import transactions</p>
              </div>
            </div>
            <button 
              onClick={() => onNavChange('accounts')}
              className="w-full mt-3 h-8 bg-[#4D5FFF] text-white text-13 font-medium rounded-lg hover:bg-[#4555E3] transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      )}

      {/* Bottom Section - Get Help */}
      <div className="px-3 py-2 mt-auto">
        <button className="w-full h-9 px-3 rounded-lg flex items-center gap-2.5 text-14 text-[#3D3D3F] hover:bg-[#F0F0F0] transition-colors duration-[120ms]">
          <HelpCircle className="w-4 h-4" />
          Get Help
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
