import React, { useState } from 'react'
import { X, FileSpreadsheet, Receipt, Upload, Check } from 'lucide-react'
import { Button } from './ui'

const UploadDocumentsModal = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState(null) // 'csv' | 'receipts'
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  if (!isOpen) return null

  const documentTypes = [
    {
      id: 'csv',
      icon: FileSpreadsheet,
      title: 'Bank statement (CSV)',
      description: 'Upload transaction data from your bank',
    },
    {
      id: 'receipts',
      icon: Receipt,
      title: 'Receipts & Invoices',
      description: 'Upload receipts, invoices, and other documents',
    },
  ]

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleUpload = () => {
    // Placeholder - would actually upload files here
    console.log('Uploading files:', uploadedFiles)
    alert(`${uploadedFiles.length} file(s) would be uploaded here`)
    handleClose()
  }

  const handleClose = () => {
    setSelectedType(null)
    setUploadedFiles([])
    onClose()
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-md border border-[#E8E8E8] w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
          <h2 className="text-16 font-semibold text-[#18181A]">Upload documents</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-[#F0F0F0] rounded-sm transition-colors"
          >
            <X className="w-4 h-4 text-[#8D8D8D]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {!selectedType ? (
            // Type Selection
            <div className="space-y-3">
              <p className="text-13 text-[#656565] mb-4">
                What would you like to upload?
              </p>
              {documentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="w-full flex items-start gap-4 p-4 rounded-lg border border-[#E8E8E8] hover:border-[#4D5FFF] hover:bg-[#F7F9FF] transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F0F0F0] flex items-center justify-center group-hover:bg-contrast-primary-subtle-bg">
                    <type.icon className="w-5 h-5 text-[#656565] group-hover:text-[#4D5FFF]" />
                  </div>
                  <div>
                    <p className="text-14 font-medium text-[#18181A]">{type.title}</p>
                    <p className="text-13 text-[#8D8D8D]">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // File Upload Area
            <div>
              <button
                onClick={() => setSelectedType(null)}
                className="text-13 text-[#656565] hover:text-[#18181A] mb-4"
              >
                ← Back to selection
              </button>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-[#4D5FFF] bg-[#F7F9FF]'
                    : 'border-[#E8E8E8] hover:border-[#BBBBBB]'
                }`}
              >
                <Upload className={`w-8 h-8 mx-auto mb-3 ${
                  isDragging ? 'text-[#4D5FFF]' : 'text-[#8D8D8D]'
                }`} />
                <p className="text-14 text-[#18181A] mb-1">
                  Drag and drop files here
                </p>
                <p className="text-13 text-[#8D8D8D] mb-3">
                  or
                </p>
                <label className="inline-block">
                  <input
                    type="file"
                    multiple
                    accept={selectedType === 'csv' ? '.csv' : '.pdf,.jpg,.jpeg,.png'}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="text-13 font-medium text-[#4D5FFF] hover:text-[#4555E3] cursor-pointer">
                    Browse files
                  </span>
                </label>
                <p className="text-12 text-[#BBBBBB] mt-2">
                  {selectedType === 'csv' 
                    ? 'Accepts CSV files' 
                    : 'Accepts PDF, JPG, PNG files'}
                </p>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-12 font-medium text-[#656565]">
                    {uploadedFiles.length} file(s) selected
                  </p>
                  {uploadedFiles.map((file, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-2 bg-[#F0F0F0] rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#50942A]" />
                        <span className="text-13 text-[#18181A] truncate max-w-[300px]">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(idx)}
                        className="text-12 text-[#8D8D8D] hover:text-[#F13B3B]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedType && (
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-[#E8E8E8]">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploadedFiles.length === 0}>
              Upload {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadDocumentsModal
