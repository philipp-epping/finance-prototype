import React from 'react'
import { CheckCircle, Upload, Plus } from 'lucide-react'
import { Button, Badge } from './ui'
import { accountTypes } from '../data/mockData'

const ConnectionSuccess = ({ accountData, onComplete, onAddAnother }) => {
  // Get account type label
  const getAccountTypeLabel = (value) => {
    const type = accountTypes.find(t => t.value === value)
    return type ? type.label : value
  }

  return (
    <div>
      {/* Success Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-[#F6FBF4] flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-[#50942A]" />
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center mb-6">
        <h3 className="text-14 font-medium text-[#18181A] mb-1">
          Bank account connected
        </h3>
        <p className="text-13 text-[#656565]">
          {accountData.bankName} has been successfully added to your accounts.
        </p>
      </div>

      {/* Account Summary Card */}
      <div className="bg-[#F0F0F0] rounded-md p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-black/10"
            style={{ backgroundColor: accountData.bankBgColor || '#F5F5F5' }}
          >
            <img 
              src={accountData.bankLogo} 
              alt={accountData.bankName}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentNode.innerHTML = `<span class="text-14 font-bold text-[#18181A]">${accountData.bankName.charAt(0)}</span>`
              }}
            />
          </div>
          <div className="flex-1">
            <p className="text-13 font-medium text-[#18181A]">
              {accountData.accountName}
            </p>
            <p className="text-12 text-[#8D8D8D]">
              {accountData.iban}
            </p>
          </div>
          <Badge variant={accountData.connectionType === 'automatic' ? 'primary' : 'neutral'}>
            {accountData.connectionType === 'automatic' ? 'Auto-sync' : 'Manual'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-10 text-[#656565] ml-[52px]">
          <span>Type: <span className="text-[#18181A]">{getAccountTypeLabel(accountData.accountType)}</span></span>
          <span>BIC: <span className="text-[#18181A]">{accountData.bic}</span></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Upload statement button - only for manual connections */}
        {accountData.connectionType === 'manual' && (
          <Button 
            variant="secondary" 
            className="w-full"
            icon={Upload}
            onClick={() => {
              // In a real app, this would open a file picker
              alert('File upload would open here')
            }}
          >
            Upload account statement
          </Button>
        )}

        {/* Add another bank link */}
        <button
          onClick={onAddAnother}
          className="w-full flex items-center justify-center gap-2 py-2 text-13 text-[#4D5FFF] hover:text-[#4555E3] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add another bank
        </button>
      </div>

      {/* Done button */}
      <div className="mt-4 pt-4 border-t border-[#E8E8E8]">
        <Button className="w-full" onClick={onComplete}>
          Done
        </Button>
      </div>
    </div>
  )
}

export default ConnectionSuccess
