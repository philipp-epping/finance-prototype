import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ArrowLeft, Receipt, Wallet, TrendingUp, PiggyBank, Shield } from 'lucide-react'
import { Button, Input, Dropdown } from './ui'
import { accountTypes } from '../data/mockData'
import { validateIban, generateBicFromIban, formatIban } from '../utils/iban'

// Icon mapping for account types
const iconMap = {
  Receipt: <Receipt className="w-4 h-4" />,
  Wallet: <Wallet className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  PiggyBank: <PiggyBank className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
}

const ManualEntryForm = ({ bank, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    iban: '',
    bic: '',
    accountName: '',
    accountType: '',
  })
  const [ibanError, setIbanError] = useState('')
  const submitButtonRef = useRef(null)

  // Map account types with icons for dropdown
  const accountTypesWithIcons = useMemo(() => 
    accountTypes.map(type => ({
      ...type,
      icon: iconMap[type.icon] || null,
    })), 
  [])

  // Auto-generate BIC when IBAN changes
  useEffect(() => {
    const cleanIban = formData.iban.replace(/\s/g, '')
    if (cleanIban.length >= 4) {
      const validation = validateIban(cleanIban)
      if (validation.valid) {
        const bic = generateBicFromIban(cleanIban)
        setFormData(prev => ({ ...prev, bic }))
        setIbanError('')
      }
    }
  }, [formData.iban])

  // Handle IBAN input with formatting
  const handleIbanChange = (e) => {
    const value = e.target.value
    const formatted = formatIban(value)
    setFormData(prev => ({ ...prev, iban: formatted }))
    
    // Validate on change
    const cleanIban = value.replace(/\s/g, '')
    if (cleanIban.length > 0) {
      const validation = validateIban(cleanIban)
      if (!validation.valid) {
        setIbanError(validation.error)
      } else {
        setIbanError('')
      }
    } else {
      setIbanError('')
    }
  }

  // Check if form is valid (accountName is optional)
  const isFormValid = () => {
    const cleanIban = formData.iban.replace(/\s/g, '')
    const validation = validateIban(cleanIban)
    return (
      validation.valid &&
      formData.bic.length > 0 &&
      formData.accountType.length > 0
    )
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Bank info header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E8E8E8]">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 hover:bg-[#F0F0F0] rounded-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#8D8D8D]" />
        </button>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-black/10"
          style={{ backgroundColor: bank.bgColor || '#F5F5F5' }}
        >
          <img 
            src={bank.logo} 
            alt={bank.name}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentNode.innerHTML = `<span class="text-14 font-bold text-[#18181A]">${bank.name.charAt(0)}</span>`
            }}
          />
        </div>
        <div>
          <p className="text-13 font-medium text-[#18181A]">{bank.name}</p>
          <p className="text-12 text-[#8D8D8D]">Manual connection</p>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <Input
          label="IBAN"
          placeholder="DE89 3704 0044 0532 0130 00"
          value={formData.iban}
          onChange={handleIbanChange}
          error={ibanError}
          helperText="Enter your International Bank Account Number"
          autoFocus
        />

        <Input
          label="BIC"
          placeholder="Auto-generated"
          value={formData.bic}
          onChange={(e) => setFormData(prev => ({ ...prev, bic: e.target.value }))}
          helperText="Bank Identifier Code (auto-filled based on IBAN)"
          tabIndex={-1}
        />

        <Dropdown
          label="Account type"
          placeholder="Select account type"
          value={formData.accountType}
          onChange={(value) => setFormData(prev => ({ ...prev, accountType: value }))}
          onSelect={() => submitButtonRef.current?.focus()}
          options={accountTypesWithIcons}
        />

        <Input
          label="Account name (optional)"
          placeholder="e.g., Business Main Account"
          value={formData.accountName}
          onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
          helperText="Give your account a recognizable name"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#E8E8E8]">
        <Button variant="secondary" type="button" onClick={onBack}>
          Back
        </Button>
        <Button ref={submitButtonRef} type="submit" disabled={!isFormValid()}>
          Connect account
        </Button>
      </div>
    </form>
  )
}

export default ManualEntryForm
