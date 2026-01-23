import React, { useState } from 'react'
import { X, Shield } from 'lucide-react'
import { Button } from './ui'
import BankSearchStep from './BankSearchStep'
import ManualEntryForm from './ManualEntryForm'
import ConnectionSuccess from './ConnectionSuccess'

const BankConnectionModal = ({ isOpen, onClose, onAddAccount }) => {
  const [step, setStep] = useState('search') // 'search' | 'confirm' | 'manual' | 'connecting' | 'success'
  const [selectedBank, setSelectedBank] = useState(null)
  const [accountData, setAccountData] = useState(null)

  // Reset modal state when closing
  const handleClose = () => {
    setStep('search')
    setSelectedBank(null)
    setAccountData(null)
    onClose()
  }

  // Handle bank selection from search
  const handleSelectBank = (bank) => {
    setSelectedBank(bank)
    
    if (bank.connectionType === 'automatic') {
      // Show confirmation step before connecting
      setStep('confirm')
    } else {
      // Manual connection required
      setStep('manual')
    }
  }

  // Handle proceeding from confirmation to actual connection
  const handleProceedToConnect = () => {
    if (!selectedBank) return
    
    // Simulate automatic connection
    setStep('connecting')
    setTimeout(() => {
      setAccountData({
        bankId: selectedBank.id,
        bankName: selectedBank.name,
        bankLogo: selectedBank.logo,
        bankBgColor: selectedBank.bgColor,
        connectionType: 'automatic',
        iban: 'DE89 3704 0044 0532 0130 00', // Mock IBAN
        bic: 'COBADEFFXXX',
        accountName: `${selectedBank.name} Business`,
        accountType: 'operative',
        balance: Math.floor(Math.random() * 50000) + 1000, // Mock balance
        lastSynced: new Date().toISOString(),
      })
      setStep('success')
    }, 2000)
  }

  // Handle manual form submission
  const handleManualSubmit = (formData) => {
    setAccountData({
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      bankLogo: selectedBank.logo,
      bankBgColor: selectedBank.bgColor,
      connectionType: 'manual',
      balance: 0, // Manual accounts start with 0, user can upload statement
      lastSynced: new Date().toISOString(),
      ...formData,
    })
    setStep('success')
  }

  // Handle completing the connection
  const handleComplete = () => {
    if (accountData) {
      onAddAccount(accountData)
    }
    handleClose()
  }

  // Handle adding another bank
  const handleAddAnother = () => {
    if (accountData) {
      onAddAccount(accountData)
    }
    setStep('search')
    setSelectedBank(null)
    setAccountData(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-md border border-[#E8E8E8] w-full max-w-lg mx-4">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-[#E8E8E8]">
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-16 font-semibold text-[#18181A]">
              {step === 'search' && 'Connect your bank'}
              {step === 'confirm' && 'Confirm connection'}
              {step === 'manual' && 'Enter account details'}
              {step === 'connecting' && 'Connecting securely...'}
              {step === 'success' && 'Account connected'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-[#F0F0F0] rounded-sm transition-colors"
            >
              <X className="w-4 h-4 text-[#8D8D8D]" />
            </button>
          </div>
          {(step === 'search' || step === 'confirm') && (
            <div className="flex items-center gap-1.5 text-13 text-[#656565]">
              <Shield className="w-3.5 h-3.5 text-[#8D8D8D]" />
              <span>Secure, read-only access. We can never move your money.</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {step === 'search' && (
            <BankSearchStep onSelectBank={handleSelectBank} />
          )}

          {step === 'confirm' && selectedBank && (
            <div className="text-center py-4">
              {/* Bank logo and name */}
              <div className="flex justify-center mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden border border-black/10"
                  style={{ backgroundColor: selectedBank.bgColor || '#F5F5F5' }}
                >
                  <img 
                    src={selectedBank.logo} 
                    alt={selectedBank.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentNode.innerHTML = `<span class="text-20 font-bold text-[#18181A]">${selectedBank.name.charAt(0)}</span>`
                    }}
                  />
                </div>
              </div>
              <h3 className="text-14 font-medium text-[#18181A] mb-1">
                {selectedBank.name}
              </h3>
              <p className="text-13 text-[#656565] mb-6 max-w-xs mx-auto">
                You'll be securely redirected to {selectedBank.name} to log in. This grants read-only access to your account.
              </p>
              <Button onClick={handleProceedToConnect} className="w-full mb-3">
                Continue to {selectedBank.name}
              </Button>
              <button 
                onClick={() => setStep('search')} 
                className="text-13 text-[#656565] hover:text-[#18181A] transition-colors"
              >
                Choose a different bank
              </button>
            </div>
          )}

          {step === 'manual' && selectedBank && (
            <ManualEntryForm 
              bank={selectedBank}
              onSubmit={handleManualSubmit}
              onBack={() => setStep('search')}
            />
          )}

          {step === 'connecting' && (
            <div className="py-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#F7F9FF] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#4D5FFF] border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-13 text-[#656565]">
                Securely connecting to {selectedBank?.name}...
              </p>
              <p className="text-12 text-[#8D8D8D] mt-1">
                This usually takes about 30 seconds
              </p>
            </div>
          )}

          {step === 'success' && accountData && (
            <ConnectionSuccess
              accountData={accountData}
              onComplete={handleComplete}
              onAddAnother={handleAddAnother}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BankConnectionModal
