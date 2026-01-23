import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Search, Zap, FileEdit } from 'lucide-react'
import { banks } from '../data/mockData'

const BankSearchStep = ({ onSelectBank }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  // Auto-focus the search input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Filter banks based on search query (matches name, location, and BIC)
  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return banks
    const query = searchQuery.toLowerCase()
    return banks.filter(bank => 
      bank.name.toLowerCase().includes(query) ||
      (bank.location && bank.location.toLowerCase().includes(query)) ||
      (bank.bic && bank.bic.toLowerCase().includes(query))
    )
  }, [searchQuery])

  // Reset selection to first item when filtered results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredBanks])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (filteredBanks.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredBanks.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onSelectBank(filteredBanks[selectedIndex])
    }
  }

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8D8D]" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search your bank..."
          autoFocus
          className="w-full h-[36px] pl-9 pr-3 bg-white border border-[#E8E8E8] rounded-sm text-14 text-[#18181A] placeholder:text-[#8D8D8D] focus:outline-none focus:border-[#4D5FFF] focus:ring-3 focus:ring-focus-ring transition-all"
        />
      </div>

      {/* Bank List */}
      <div className="max-h-[320px] overflow-y-auto -mx-5 px-5">
        {filteredBanks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-13 text-[#656565]">No banks found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredBanks.map((bank, index) => (
              <button
                key={bank.id}
                onClick={() => onSelectBank(bank)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left group ${
                  index === selectedIndex ? 'bg-[#F0F0F0]' : 'hover:bg-[#F0F0F0]'
                }`}
              >
                {/* Bank Logo - App icon style with colored background */}
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-black/10"
                  style={{ backgroundColor: bank.bgColor || '#F5F5F5' }}
                >
                  <img 
                    src={bank.logo} 
                    alt={bank.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentNode.innerHTML = `<span class="text-14 font-bold text-white">${bank.name.charAt(0)}</span>`
                    }}
                  />
                </div>

                {/* Bank Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-13 font-medium text-[#18181A]">
                      {bank.name}
                      {bank.location && (
                        <span className="text-[#656565] font-normal"> {bank.location}</span>
                      )}
                    </p>
                    {bank.bic && (
                      <span className="text-10 text-gray-400 font-normal">
                        {bank.bic}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {bank.connectionType === 'automatic' ? (
                      <>
                        <Zap className="w-3 h-3 text-[#50942A]" />
                        <span className="text-12 text-[#50942A]">Connect in ~30 seconds</span>
                      </>
                    ) : (
                      <>
                        <FileEdit className="w-3 h-3 text-[#8D8D8D]" />
                        <span className="text-12 text-[#8D8D8D]">Add account details manually</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Chevron */}
                <svg 
                  className={`w-4 h-4 text-[#8D8D8D] transition-opacity flex-shrink-0 ${
                    index === selectedIndex ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BankSearchStep
