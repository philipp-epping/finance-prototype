// Simple IBAN validation and BIC generation helpers (mock implementation)

// Basic IBAN format validation
export const validateIban = (iban) => {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase()
  
  // Check minimum length
  if (cleanIban.length < 15 || cleanIban.length > 34) {
    return { valid: false, error: 'IBAN must be between 15 and 34 characters' }
  }
  
  // Check country code (first 2 letters)
  const countryCode = cleanIban.slice(0, 2)
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return { valid: false, error: 'Invalid country code' }
  }
  
  // Check check digits (positions 3-4 should be numbers)
  const checkDigits = cleanIban.slice(2, 4)
  if (!/^\d{2}$/.test(checkDigits)) {
    return { valid: false, error: 'Invalid check digits' }
  }
  
  // For German IBANs, check length (22 characters)
  if (countryCode === 'DE' && cleanIban.length !== 22) {
    return { valid: false, error: 'German IBAN must be exactly 22 characters' }
  }
  
  return { valid: true, cleanIban }
}

// Mock BIC generation based on country code
// In reality, BIC is determined by the bank identifier in the IBAN
export const generateBicFromIban = (iban) => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase()
  const countryCode = cleanIban.slice(0, 2)
  
  // Mock BIC codes for different countries
  const mockBics = {
    'DE': 'DEUTDEFF', // Deutsche Bank Germany
    'AT': 'BKAUATWW', // Austria
    'CH': 'UBSWCHZH', // Switzerland
    'NL': 'INGBNL2A', // Netherlands
    'FR': 'BNPAFRPP', // France
    'GB': 'BABORBB1', // UK
    'IT': 'BCITITMM', // Italy
    'ES': 'CAIXESBB', // Spain
  }
  
  return mockBics[countryCode] || 'DEUTDEFF'
}

// Format IBAN with spaces every 4 characters
export const formatIban = (iban) => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase()
  return cleanIban.replace(/(.{4})/g, '$1 ').trim()
}
