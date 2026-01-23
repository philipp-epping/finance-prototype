// Mock Banks - some support automatic connection, others require manual setup
// Includes real bank logos, regional branches for Sparkasse/Volksbank, and BIC codes
export const banks = [
  // National banks
  { 
    id: 'deutsche-bank', 
    name: 'Deutsche Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Deutsche_Bank_logo_without_wordmark.svg',
    bgColor: '#E8F0FE',
    location: null,
    bic: 'DEUTDEDB',
    connectionType: 'automatic' 
  },
  { 
    id: 'n26', 
    name: 'N26', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/N26_logo.svg/512px-N26_logo.svg.png',
    bgColor: '#E6F7F0',
    location: null,
    bic: 'NTSBDEB1',
    connectionType: 'automatic' 
  },
  { 
    id: 'commerzbank', 
    name: 'Commerzbank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Commerzbank_Logo_2009.svg/512px-Commerzbank_Logo_2009.svg.png',
    bgColor: '#FFF9E6',
    location: null,
    bic: 'COBADEFF',
    connectionType: 'automatic' 
  },
  { 
    id: 'ing', 
    name: 'ING', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/ING_Group_N.V._Logo.svg/512px-ING_Group_N.V._Logo.svg.png',
    bgColor: '#FFF0E6',
    location: null,
    bic: 'INGDDEFF',
    connectionType: 'automatic' 
  },
  { 
    id: 'dkb', 
    name: 'DKB', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/DKB_Logo.svg/512px-DKB_Logo.svg.png',
    bgColor: '#E8F0FE',
    location: null,
    bic: 'BYLADEM1001',
    connectionType: 'automatic' 
  },
  { 
    id: 'postbank', 
    name: 'Postbank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Postbank_Logo.svg/512px-Postbank_Logo.svg.png',
    bgColor: '#FFFDE7',
    location: null,
    bic: 'PBNKDEFF',
    connectionType: 'manual' 
  },
  { 
    id: 'consorsbank', 
    name: 'Consorsbank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Consorsbank_Logo_2014.svg/512px-Consorsbank_Logo_2014.svg.png',
    bgColor: '#F0F4FF',
    location: null,
    bic: 'CSDBDE71',
    connectionType: 'automatic' 
  },
  { 
    id: 'gls-bank', 
    name: 'GLS Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/GLS_Gemeinschaftsbank_logo.svg/512px-GLS_Gemeinschaftsbank_logo.svg.png',
    bgColor: '#E8F5E9',
    location: null,
    bic: 'GENODEM1GLS',
    connectionType: 'manual' 
  },
  
  // Sparkasse regional branches
  { 
    id: 'sparkasse-muenchen', 
    name: 'Sparkasse', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sparkasse.svg/512px-Sparkasse.svg.png',
    bgColor: '#FFF5F5',
    location: 'München',
    bic: 'SSKMDEMMXXX',
    connectionType: 'manual' 
  },
  { 
    id: 'sparkasse-berlin', 
    name: 'Sparkasse', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sparkasse.svg/512px-Sparkasse.svg.png',
    bgColor: '#FFF5F5',
    location: 'Berlin',
    bic: 'BELADEBE',
    connectionType: 'manual' 
  },
  { 
    id: 'sparkasse-koeln-bonn', 
    name: 'Sparkasse', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sparkasse.svg/512px-Sparkasse.svg.png',
    bgColor: '#FFF5F5',
    location: 'Köln/Bonn',
    bic: 'COLSDE33',
    connectionType: 'manual' 
  },
  { 
    id: 'sparkasse-hamburg', 
    name: 'Sparkasse', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sparkasse.svg/512px-Sparkasse.svg.png',
    bgColor: '#FFF5F5',
    location: 'Hamburg',
    bic: 'HASPDEHHXXX',
    connectionType: 'manual' 
  },
  { 
    id: 'sparkasse-paderborn', 
    name: 'Sparkasse', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sparkasse.svg/512px-Sparkasse.svg.png',
    bgColor: '#FFF5F5',
    location: 'Paderborn-Detmold',
    bic: 'WELODEM1PDB',
    connectionType: 'manual' 
  },
  { 
    id: 'sparkasse-frankfurt', 
    name: 'Frankfurter Sparkasse', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sparkasse.svg/512px-Sparkasse.svg.png',
    bgColor: '#FFF5F5',
    location: 'Frankfurt',
    bic: 'HELADEF1822',
    connectionType: 'automatic' 
  },
  
  // Volksbank regional branches
  { 
    id: 'volksbank-muenchen', 
    name: 'Volksbank Raiffeisenbank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Raiffeisen_Volksbanken_Logo.svg/512px-Raiffeisen_Volksbanken_Logo.svg.png',
    bgColor: '#F0F4FF',
    location: 'München',
    bic: 'GENODEF1M01',
    connectionType: 'manual' 
  },
  { 
    id: 'volksbank-stuttgart', 
    name: 'Volksbank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Raiffeisen_Volksbanken_Logo.svg/512px-Raiffeisen_Volksbanken_Logo.svg.png',
    bgColor: '#F0F4FF',
    location: 'Stuttgart',
    bic: 'VOBADESS',
    connectionType: 'manual' 
  },
  { 
    id: 'volksbank-koeln-bonn', 
    name: 'Volksbank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Raiffeisen_Volksbanken_Logo.svg/512px-Raiffeisen_Volksbanken_Logo.svg.png',
    bgColor: '#F0F4FF',
    location: 'Köln/Bonn',
    bic: 'GENODED1CVB',
    connectionType: 'manual' 
  },
  { 
    id: 'volksbank-hannover', 
    name: 'Hannoversche Volksbank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Raiffeisen_Volksbanken_Logo.svg/512px-Raiffeisen_Volksbanken_Logo.svg.png',
    bgColor: '#F0F4FF',
    location: 'Hannover',
    bic: 'VOHADE2H',
    connectionType: 'manual' 
  },
]

// Account types for selection
export const accountTypes = [
  { value: 'operative', label: 'Operative', icon: 'Wallet', description: 'Day-to-day business transactions and expenses' },
  { value: 'tax', label: 'Tax', icon: 'Receipt', description: 'Tax reserve for VAT, income tax, and other obligations' },
  { value: 'profit', label: 'Profit', icon: 'TrendingUp', description: 'Retained earnings and profit distributions' },
  { value: 'investment', label: 'Investment', icon: 'PiggyBank', description: 'Long-term investments and growth capital' },
  { value: 'emergency', label: 'Emergency', icon: 'Shield', description: 'Emergency fund for unexpected expenses' },
]

// Expense categories for transactions
export const expenseCategories = [
  'Salary',
  'Office Supplies',
  'Software',
  'Travel',
  'Marketing',
  'Utilities',
  'Insurance',
  'Professional Services',
  'Equipment',
  'Meals & Entertainment',
  'Rent',
  'Transfer',
]

// Full category list with metadata for categorization flow
// Hierarchical structure based on expense categorization mind map
export const allCategories = [
  // OPEX > Marketing
  { id: 'ad-spend-meta', label: 'Meta Ads', icon: '📱', path: ['OPEX', 'Marketing', 'Ad Spend', 'Meta'] },
  { id: 'ad-spend-youtube', label: 'YouTube Ads', icon: '▶️', path: ['OPEX', 'Marketing', 'Ad Spend', 'YouTube'] },
  { id: 'ad-spend-linkedin', label: 'LinkedIn Ads', icon: '💼', path: ['OPEX', 'Marketing', 'Ad Spend', 'LinkedIn'] },
  { id: 'ad-spend-google', label: 'Google Ads', icon: '🔍', path: ['OPEX', 'Marketing', 'Ad Spend', 'Google'] },
  { id: 'ad-spend-tiktok', label: 'TikTok Ads', icon: '🎵', path: ['OPEX', 'Marketing', 'Ad Spend', 'TikTok'] },
  { id: 'ad-spend-influencer', label: 'Influencer Spend', icon: '⭐', path: ['OPEX', 'Marketing', 'Ad Spend', 'Influencer Spend'] },
  { id: 'ad-spend-sponsorships', label: 'Sponsorships', icon: '🤝', path: ['OPEX', 'Marketing', 'Ad Spend', 'Sponsorships'] },
  { id: 'ad-spend-other', label: 'Other Ads', icon: '📢', path: ['OPEX', 'Marketing', 'Ad Spend', 'Other'] },
  { id: 'marketing-creative', label: 'Creative Production', icon: '🎨', path: ['OPEX', 'Marketing', 'Creative Production'] },
  { id: 'marketing-events', label: 'Events & Exhibitions', icon: '🎪', path: ['OPEX', 'Marketing', 'Events & Exhibitions'] },
  { id: 'marketing-external', label: 'External Agency', icon: '🏢', path: ['OPEX', 'Marketing', 'External Service Provider'] },
  { id: 'marketing-internal', label: 'Internal Team Payroll', icon: '👥', path: ['OPEX', 'Marketing', 'Internal Team Payroll'] },
  { id: 'marketing-referral', label: 'Referral Commissions', icon: '💸', path: ['OPEX', 'Marketing', 'Referral Commissions'] },
  { id: 'marketing-software-tracking', label: 'Payroll & Tracking', icon: '📊', path: ['OPEX', 'Marketing', 'Software', 'Payroll & Tracking'] },
  { id: 'marketing-software-other', label: 'Marketing Software', icon: '💻', path: ['OPEX', 'Marketing', 'Software', 'Other'] },
  { id: 'marketing-legal', label: 'Legal & IP Penalties', icon: '⚖️', path: ['OPEX', 'Marketing', 'Legal Tender Penalties'] },
  
  // OPEX > Sales
  { id: 'sales-salaries-closer', label: 'Closer Salaries', icon: '🎯', path: ['OPEX', 'Sales', 'Salaries', 'Closer'] },
  { id: 'sales-salaries-management', label: 'Sales Management', icon: '👔', path: ['OPEX', 'Sales', 'Salaries', 'Management'] },
  { id: 'sales-salaries-assistants', label: 'Sales Assistants', icon: '📋', path: ['OPEX', 'Sales', 'Salaries', 'Sales Assistants'] },
  { id: 'sales-salaries-appointment', label: 'Appointment Setter', icon: '📅', path: ['OPEX', 'Sales', 'Salaries', 'Appointment Setter'] },
  { id: 'sales-software', label: 'Sales Software & Tools', icon: '🔧', path: ['OPEX', 'Sales', 'Software & Tools'] },
  { id: 'sales-hardware', label: 'Sales Hardware', icon: '🖥️', path: ['OPEX', 'Sales', 'Hardware'] },
  { id: 'sales-coaching', label: 'Sales Coaching', icon: '🎓', path: ['OPEX', 'Sales', 'Sales Coaching'] },
  
  // OPEX > General & Admin
  { id: 'professional-accounting', label: 'Accounting & Tax', icon: '📊', path: ['OPEX', 'General & Admin', 'Professional Services', 'Accounting & Tax'] },
  { id: 'professional-legal', label: 'Legal Services', icon: '⚖️', path: ['OPEX', 'General & Admin', 'Professional Services', 'Legal'] },
  { id: 'professional-coaching', label: 'Coaching & Mentoring', icon: '🎯', path: ['OPEX', 'General & Admin', 'Professional Services', 'Coaching & Mentoring'] },
  { id: 'overhead-rent', label: 'Rent', icon: '🏢', path: ['OPEX', 'General & Admin', 'Overhead', 'Rent'] },
  { id: 'overhead-insurance', label: 'Insurance', icon: '🛡️', path: ['OPEX', 'General & Admin', 'Overhead', 'Insurance'] },
  { id: 'overhead-cleaning', label: 'Cleaning', icon: '🧹', path: ['OPEX', 'General & Admin', 'Overhead', 'Cleaning'] },
  { id: 'overhead-office-supplies', label: 'Office Supplies', icon: '📎', path: ['OPEX', 'General & Admin', 'Overhead', 'Office Supplies'] },
  { id: 'overhead-equipment', label: 'Equipment', icon: '🖥️', path: ['OPEX', 'General & Admin', 'Overhead', 'Equipment'] },
  { id: 'overhead-other', label: 'Other Overhead', icon: '📦', path: ['OPEX', 'General & Admin', 'Overhead', 'Other'] },
  { id: 'admin-payroll-costs', label: 'Employer Payroll Costs', icon: '💰', path: ['OPEX', 'General & Admin', 'Employer Payroll Costs'] },
  { id: 'admin-software', label: 'General Software & Tools', icon: '💻', path: ['OPEX', 'General & Admin', 'Software & Tools'] },
  { id: 'admin-team-payroll', label: 'Team Payroll', icon: '👥', path: ['OPEX', 'General & Admin', 'Team Payroll'] },
  { id: 'admin-travel', label: 'Travel', icon: '✈️', path: ['OPEX', 'General & Admin', 'Travel'] },
  { id: 'admin-teamevents', label: 'Team Events', icon: '🎉', path: ['OPEX', 'General & Admin', 'Teamevents'] },
  { id: 'admin-banking', label: 'Banking & FX Fees', icon: '🏦', path: ['OPEX', 'General & Admin', 'Banking & FX Fees'] },
  { id: 'admin-misc', label: 'Misc Team Spend', icon: '📋', path: ['OPEX', 'General & Admin', 'Misc Team Spend'] },
  
  // OPEX > Delivery Labor
  { id: 'delivery-labor-manager', label: 'Account Manager', icon: '👤', path: ['OPEX', 'Delivery Labor', 'Account Manager'] },
  { id: 'delivery-labor-engineers', label: 'Systems Engineers', icon: '⚙️', path: ['OPEX', 'Delivery Labor', 'Digital Systems Engineers'] },
  
  // Cost of Goods Sold (Fulfillment)
  { id: 'cogs-delivery-contractors', label: 'Delivery Contractors', icon: '👷', path: ['COGS', 'Delivery Contractors'] },
  { id: 'cogs-delivery-software', label: 'Delivery Software', icon: '💻', path: ['COGS', 'Delivery Software'] },
  { id: 'cogs-payment-processing', label: 'Payment Processing', icon: '💳', path: ['COGS', 'Payment Processing Fees'] },
  { id: 'cogs-client-support', label: 'Client Support', icon: '🎧', path: ['COGS', 'Client Support'] },
  
  // Owner Benefits
  { id: 'owner-restaurants', label: 'Restaurants', icon: '🍽️', path: ['Owner Benefits', 'Restaurants'] },
  { id: 'owner-car', label: 'Car (Private)', icon: '🚗', path: ['Owner Benefits', 'Car (Private)'] },
  { id: 'owner-vehicle', label: 'Vehicle', icon: '🚙', path: ['Owner Benefits', 'Vehicle'] },
  { id: 'owner-housing', label: 'Housing', icon: '🏠', path: ['Owner Benefits', 'Housing'] },
  { id: 'owner-tech', label: 'Tech Devices (Private)', icon: '📱', path: ['Owner Benefits', 'Tech Devices (Private)'] },
  { id: 'owner-lifestyle', label: 'Lifestyle & Shopping', icon: '🛍️', path: ['Owner Benefits', 'Lifestyle & Shopping'] },
  { id: 'owner-misc', label: 'Misc Personal Expenses', icon: '💳', path: ['Owner Benefits', 'Misc Personal Expenses'] },
  
  // Private Expense (Non-Business)
  { id: 'private-expense', label: 'Private Expense', icon: '🏠', path: ['Private Expense'] },
  
  // Loans
  { id: 'loan-repayment', label: 'Loan Repayment', icon: '💰', path: ['Loans', 'Loan Repayment'] },
  { id: 'loan-shareholder', label: 'Shareholder Loan Payout', icon: '📤', path: ['Loans', 'Shareholder Loan Payout'] },
  { id: 'loan-third-party', label: 'Third Party Loan Payout', icon: '🏦', path: ['Loans', 'Third Party Loan Payout'] },
  
  // Refund
  { id: 'refund', label: 'Refund', icon: '↩️', path: ['Refund'] },
  
  // Barrier Payments (Income & Dividend)
  { id: 'barrier-management-fees', label: 'Management Fees', icon: '💼', path: ['Barrier Payments', 'Management Fees'] },
  { id: 'barrier-dividends', label: 'Dividends', icon: '💵', path: ['Barrier Payments', 'Dividends'] },
  { id: 'barrier-loan', label: 'Loan', icon: '🏦', path: ['Barrier Payments', 'Loan'] },
  
  // Tax
  { id: 'tax-income', label: 'Income Tax', icon: '📋', path: ['Tax', 'Einkommensteuer'] },
  { id: 'tax-trade', label: 'Trade Tax', icon: '🏭', path: ['Tax', 'Gewerbesteuer'] },
  { id: 'tax-corporate', label: 'Corporate Tax', icon: '🏢', path: ['Tax', 'Körperschaftsteuer'] },
  { id: 'tax-solidarity', label: 'Solidarity Surcharge', icon: '🤝', path: ['Tax', 'Einkommensteuerumlage'] },
  { id: 'tax-vat', label: 'VAT', icon: '📊', path: ['Tax', 'Umsatzsteuer'] },
  { id: 'tax-withholding', label: 'Withholding Tax', icon: '✂️', path: ['Tax', 'Quellensteuer'] },
  
  // Transfer (internal)
  { id: 'transfer', label: 'Internal Transfer', icon: '↔️', path: ['Transfer'] },
  
  // Other/Uncategorized
  { id: 'other', label: 'Other', icon: '📦', path: ['Other'] },
]

// Helper to format category breadcrumb - shows path WITHOUT the final element (which is the category label)
export const formatCategoryBreadcrumb = (category) => {
  if (!category?.path || category.path.length <= 1) return ''
  
  // Show all path elements EXCEPT the last one (which is the category name itself)
  const pathWithoutLast = category.path.slice(0, -1)
  const separator = ' › '
  
  return pathWithoutLast.join(separator)
}

// Get full breadcrumb path for tooltip (including the category name)
export const getFullCategoryPath = (category) => {
  if (!category?.path) return category?.label || ''
  return category.path.join(' › ')
}

// AI category suggestions with confidence levels
export const getAICategorySuggestions = (transaction) => {
  // This simulates AI suggestions based on transaction data
  const suggestions = []
  const reference = (transaction.reference || '').toLowerCase()
  const counterparty = (transaction.amount >= 0 ? transaction.sender : transaction.recipient || '').toLowerCase()
  
  // Simple keyword matching for demo purposes
  if (reference.includes('subscription') || reference.includes('monthly') || counterparty.includes('figma') || counterparty.includes('notion')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'admin-software'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'marketing-software-other'), confidence: 'Possible match' })
  } else if (reference.includes('cloud') || counterparty.includes('google cloud') || counterparty.includes('aws')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'cogs-delivery-software'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'admin-software'), confidence: 'Possible match' })
  } else if (reference.includes('recruiter') || counterparty.includes('linkedin')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'ad-spend-linkedin'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'admin-software'), confidence: 'Possible match' })
  } else if (reference.includes('mobile') || counterparty.includes('telekom') || counterparty.includes('vodafone')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'overhead-other'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'admin-software'), confidence: 'Possible match' })
  } else if (reference.includes('vat') || reference.includes('tax')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'tax-vat'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'transfer'), confidence: 'Needs review' })
  } else if (counterparty.includes('wework') || reference.includes('coworking') || reference.includes('rent')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'overhead-rent'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'overhead-other'), confidence: 'Possible match' })
  } else if (counterparty.includes('allianz') || reference.includes('insurance') || reference.includes('liability')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'overhead-insurance'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'overhead-other'), confidence: 'Possible match' })
  } else if (counterparty.includes('restaurant') || reference.includes('lunch') || reference.includes('dinner')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'owner-restaurants'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'admin-teamevents'), confidence: 'Possible match' })
  } else if (counterparty.includes('apple') || reference.includes('macbook') || reference.includes('iphone')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'overhead-equipment'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'owner-tech'), confidence: 'Possible match' })
  } else if (counterparty.includes('bahn') || reference.includes('travel') || reference.includes('flight')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'admin-travel'), confidence: 'High confidence' })
    suggestions.push({ category: allCategories.find(c => c.id === 'owner-misc'), confidence: 'Possible match' })
  } else if (reference.includes('consulting') || reference.includes('invoice')) {
    suggestions.push({ category: allCategories.find(c => c.id === 'professional-accounting'), confidence: 'Needs review' })
    suggestions.push({ category: allCategories.find(c => c.id === 'marketing-external'), confidence: 'Possible match' })
  } else {
    // Default suggestions for unknown transactions
    suggestions.push({ category: allCategories.find(c => c.id === 'professional-accounting'), confidence: 'Needs review' })
    suggestions.push({ category: allCategories.find(c => c.id === 'other'), confidence: 'Needs review' })
  }
  
  // Add a third suggestion
  if (suggestions.length < 3) {
    suggestions.push({ category: allCategories.find(c => c.id === 'other'), confidence: 'Needs review' })
  }
  
  return suggestions.slice(0, 3)
}

// Default tax rates
export const taxRates = [
  { value: 0, label: '0%' },
  { value: 7, label: '7%' },
  { value: 19, label: '19%' },
]

// Mock receipts/documents for receipt matching
export const mockReceipts = [
  {
    id: 'r1',
    vendorName: 'Meta Platforms Ireland Limited',
    invoiceNumber: 'INV-LAA7QRBUM2',
    reference: 'LAA7QRBUM2',
    amount: 12.50,
    grossAmount: 800.00,
    issueDate: '2023-07-25',
    date: '2023-07-29',
    type: 'invoice',
    matched: false,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
  },
  {
    id: 'r2',
    vendorName: 'PREDICT PA GmbH',
    invoiceNumber: 'INV-RE0362',
    reference: 'RE0362',
    amount: 7140.00,
    grossAmount: 16660.00,
    issueDate: '2025-09-01',
    date: '2025-09-04',
    type: 'invoice',
    matched: false,
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop',
  },
  {
    id: 'r3',
    vendorName: 'Blue Island Kayak',
    invoiceNumber: 'REC-02/2024',
    reference: '02/2024',
    amount: 400.00,
    issueDate: '2024-05-25',
    date: '2024-05-27',
    type: 'receipt',
    matched: false,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
  },
  {
    id: 'r4',
    vendorName: 'Google Cloud Platform',
    invoiceNumber: 'INV-2025-12-001',
    reference: 'INV-2025-12-001',
    amount: 312.47,
    issueDate: '2025-12-28',
    date: '2025-12-31',
    type: 'invoice',
    matched: false,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
  },
  {
    id: 'r5',
    vendorName: 'LinkedIn Corporation',
    invoiceNumber: 'INV-LI-79992024',
    reference: 'LI-79992024',
    amount: 79.99,
    issueDate: '2026-01-05',
    date: '2026-01-07',
    type: 'invoice',
    matched: false,
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop',
  },
  {
    id: 'r6',
    vendorName: 'Telekom Deutschland GmbH',
    invoiceNumber: 'INV-TM-2026-01-4829',
    reference: 'TM-2026-01-4829',
    amount: 59.99,
    issueDate: '2026-01-01',
    date: '2026-01-03',
    type: 'invoice',
    matched: false,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
  },
  {
    id: 'r7',
    vendorName: 'Client Solutions Ltd',
    invoiceNumber: 'INV-CS-Q4-2025',
    reference: 'CS-Q4-2025',
    amount: 8750.00,
    issueDate: '2026-01-08',
    date: '2026-01-10',
    type: 'invoice',
    matched: false,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
  },
  {
    id: 'r8',
    vendorName: 'WeWork Deutschland',
    invoiceNumber: 'INV-WW-JAN-2026',
    reference: 'WW-JAN-2026',
    amount: 850.00,
    issueDate: '2026-01-01',
    date: '2026-01-02',
    type: 'invoice',
    matched: true,
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop',
  },
  {
    id: 'r9',
    vendorName: 'Tax Reserve Transfer',
    invoiceNumber: 'REC-VAT-Q4-2025',
    reference: 'VAT-Q4-2025',
    amount: 2500.00,
    issueDate: '2025-12-26',
    date: '2025-12-28',
    type: 'receipt',
    matched: false,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
  },
  {
    id: 'r10',
    vendorName: 'Client Solutions Ltd',
    invoiceNumber: 'INV-CS-Q3-2025',
    reference: 'CS-Q3-2025',
    amount: 4375.00,
    issueDate: '2026-01-05',
    date: '2026-01-08',
    type: 'invoice',
    matched: false,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
  },
]

// Get AI-matched receipts for a transaction with match details
export const getMatchingReceipts = (transaction) => {
  if (!transaction) return []
  
  const counterparty = (transaction.amount >= 0 ? transaction.sender : transaction.recipient || '').toLowerCase()
  const reference = (transaction.reference || '').toLowerCase()
  const amount = Math.abs(transaction.amount)
  const transDate = new Date(transaction.date)
  
  const scored = mockReceipts
    .filter(r => !r.matched)
    .map(receipt => {
      let score = 0
      const matchReasons = []
      const vendorLower = receipt.vendorName.toLowerCase()
      const refLower = receipt.reference.toLowerCase()
      
      // Exact amount match
      const amountDiff = Math.abs(receipt.amount - amount)
      const amountDiffPercent = amount > 0 ? amountDiff / amount : 1
      if (amountDiffPercent < 0.01) {
        score += 50
        matchReasons.push({ type: 'exact_amount', label: 'Exact amount' })
      } else if (amountDiffPercent < 0.05) {
        score += 35
        matchReasons.push({ type: 'close_amount', label: `Amount differs €${amountDiff.toFixed(2)}` })
      } else if (amountDiffPercent < 0.2) {
        score += 15
        matchReasons.push({ type: 'amount_differs', label: `Amount differs €${amountDiff.toFixed(2)}` })
      }
      
      // Vendor/counterparty match
      const vendorWords = vendorLower.split(/\s+/)
      const counterpartyWords = counterparty.split(/\s+/)
      const hasVendorMatch = vendorLower.includes(counterparty) || 
        counterparty.includes(vendorWords[0]) ||
        counterpartyWords.some(w => w.length > 2 && vendorWords.some(v => v.includes(w)))
      
      if (hasVendorMatch) {
        score += 40
        matchReasons.push({ type: 'same_counterparty', label: 'Same counterparty' })
      }
      
      // Reference match
      if (refLower.includes(reference) || reference.includes(refLower)) {
        score += 25
        matchReasons.push({ type: 'reference_match', label: 'Reference match' })
      }
      
      // Date proximity
      const receiptDate = new Date(receipt.issueDate || receipt.date)
      const daysDiff = Math.round((transDate - receiptDate) / (1000 * 60 * 60 * 24))
      if (Math.abs(daysDiff) <= 7) {
        score += 20
        if (daysDiff >= 0) {
          matchReasons.push({ type: 'date_close', label: daysDiff === 0 ? 'Same day' : `Issued ${daysDiff}d before` })
        } else {
          matchReasons.push({ type: 'date_close', label: `Issued ${Math.abs(daysDiff)}d after` })
        }
      } else if (Math.abs(daysDiff) <= 30) {
        score += 8
      }
      
      // Calculate if this is a partial match (receipt covers part of transaction)
      const isPartialMatch = receipt.amount < amount * 0.9 && receipt.amount > amount * 0.1
      const coveragePercent = Math.round((receipt.amount / amount) * 100)
      
      return { 
        ...receipt, 
        score, 
        matchReasons,
        confidence: Math.min(100, score),
        isPartialMatch,
        coveragePercent,
        amountDiff,
        daysDiff
      }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
  
  return scored
}

// Get best match and other matches separated
export const getBestMatch = (transaction) => {
  const allMatches = getMatchingReceipts(transaction)
  
  if (allMatches.length === 0) {
    return { bestMatch: null, otherMatches: [], partialMatches: [] }
  }
  
  // Best match must have confidence > 80 and be significantly ahead of second
  const [first, second, ...rest] = allMatches
  const hasClearBest = first.confidence >= 80 && (!second || first.confidence - second.confidence >= 15)
  
  if (hasClearBest && !first.isPartialMatch) {
    const partialMatches = allMatches.filter(m => m.isPartialMatch).slice(0, 2)
    const otherMatches = [second, ...rest].filter(m => m && !m.isPartialMatch).slice(0, 3)
    return { bestMatch: first, otherMatches, partialMatches }
  }
  
  // No clear best match
  const partialMatches = allMatches.filter(m => m.isPartialMatch).slice(0, 2)
  const otherMatches = allMatches.filter(m => !m.isPartialMatch).slice(0, 4)
  return { bestMatch: null, otherMatches, partialMatches }
}

// Sample transactions data
export const sampleTransactions = [
  {
    id: 1,
    date: '2026-01-15',
    sender: 'Acme Corp',
    recipient: 'Your Company GmbH',
    amount: 12500.00,
    category: 'Salary',
    categorizedBy: 'ai', // 'ai' | 'manual' | null
    bankId: 'deutsche-bank',
    reference: 'Invoice #2026-001 Payment',
    hasAttachment: true,
    isPrivate: false,
  },
  {
    id: 2,
    date: '2026-01-14',
    sender: 'Your Company GmbH',
    recipient: 'Amazon Business',
    amount: -245.99,
    category: 'Office Supplies',
    categorizedBy: 'manual',
    bankId: 'deutsche-bank',
    reference: 'Order #304-2847593-2948573',
    hasAttachment: true,
    isPrivate: false,
  },
  {
    id: 3,
    date: '2026-01-13',
    sender: 'Your Company GmbH',
    recipient: 'Figma Inc.',
    amount: -45.00,
    category: 'Software',
    categorizedBy: 'ai',
    bankId: 'n26',
    reference: 'Monthly subscription',
    hasAttachment: false,
    isPrivate: false,
  },
  {
    id: 4,
    date: '2026-01-12',
    sender: 'Client Solutions Ltd',
    recipient: 'Your Company GmbH',
    amount: 8750.00,
    category: null, // Uncategorized
    categorizedBy: null,
    bankId: 'deutsche-bank',
    reference: 'Consulting Q4/2025',
    hasAttachment: false,
    isPrivate: false,
  },
  {
    id: 5,
    date: '2026-01-11',
    sender: 'Your Company GmbH',
    recipient: 'Deutsche Bahn',
    amount: -189.00,
    category: 'Travel',
    categorizedBy: 'manual',
    bankId: 'n26',
    reference: 'BahnCard Business',
    hasAttachment: true,
    isPrivate: false,
  },
  {
    id: 6,
    date: '2026-01-10',
    sender: 'Your Company GmbH',
    recipient: 'Google Cloud',
    amount: -312.47,
    category: null, // Uncategorized
    categorizedBy: null,
    bankId: 'deutsche-bank',
    reference: 'Cloud services Dec 2025',
    hasAttachment: false,
    isPrivate: false,
  },
  {
    id: 7,
    date: '2026-01-09',
    sender: 'Innovation Partners AG',
    recipient: 'Your Company GmbH',
    amount: 5000.00,
    category: 'Professional Services',
    categorizedBy: 'ai',
    bankId: 'deutsche-bank',
    reference: 'Workshop facilitation',
    hasAttachment: true,
    isPrivate: false,
  },
  {
    id: 8,
    date: '2026-01-08',
    sender: 'Your Company GmbH',
    recipient: 'WeWork',
    amount: -850.00,
    category: 'Rent',
    categorizedBy: 'ai',
    bankId: 'n26',
    reference: 'Coworking Jan 2026',
    hasAttachment: true,
    isPrivate: false,
  },
  {
    id: 9,
    date: '2026-01-07',
    sender: 'Your Company GmbH',
    recipient: 'LinkedIn',
    amount: -79.99,
    category: null, // Uncategorized
    categorizedBy: null,
    bankId: 'deutsche-bank',
    reference: 'Recruiter Lite monthly',
    hasAttachment: false,
    isPrivate: false,
  },
  {
    id: 10,
    date: '2026-01-06',
    sender: 'Your Company GmbH',
    recipient: 'Allianz Versicherung',
    amount: -420.00,
    category: 'Insurance',
    categorizedBy: 'manual',
    bankId: 'n26',
    reference: 'Business liability Q1',
    hasAttachment: true,
    isPrivate: false,
  },
  {
    id: 11,
    date: '2026-01-05',
    sender: 'TechStart GmbH',
    recipient: 'Your Company GmbH',
    amount: 3200.00,
    category: 'Professional Services',
    categorizedBy: 'ai',
    bankId: 'deutsche-bank',
    reference: 'Design sprint payment',
    hasAttachment: false,
    isPrivate: false,
  },
  {
    id: 12,
    date: '2026-01-04',
    sender: 'Your Company GmbH',
    recipient: 'Apple',
    amount: -1499.00,
    category: 'Equipment',
    categorizedBy: 'manual',
    bankId: 'deutsche-bank',
    reference: 'MacBook Pro repair',
    hasAttachment: true,
    isPrivate: false,
  },
  {
    id: 13,
    date: '2026-01-03',
    sender: 'Your Company GmbH',
    recipient: 'Telekom',
    amount: -59.99,
    category: null, // Uncategorized
    categorizedBy: null,
    bankId: 'n26',
    reference: 'Business mobile Jan',
    hasAttachment: false,
    isPrivate: false,
  },
  {
    id: 14,
    date: '2026-01-02',
    sender: 'Your Company GmbH',
    recipient: 'Restaurant Schnitzelhaus',
    amount: -124.50,
    category: 'Meals & Entertainment',
    categorizedBy: 'ai',
    bankId: 'n26',
    reference: 'Team lunch',
    hasAttachment: true,
    isPrivate: true, // Example private transaction
  },
  {
    id: 15,
    date: '2026-01-01',
    sender: 'Your Company GmbH',
    recipient: 'Tax Account',
    amount: -2500.00,
    category: null, // Uncategorized
    categorizedBy: null,
    bankId: 'deutsche-bank',
    reference: 'Q4 VAT reserve',
    hasAttachment: false,
    isPrivate: false,
  },
]

// Helper to get bank name by ID
export const getBankName = (bankId) => {
  const bank = banks.find(b => b.id === bankId)
  return bank ? bank.name : bankId
}

// Helper to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

// Helper to format date
export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

// Helper to mask IBAN (show first 4 and last 4 characters)
export const maskIban = (iban) => {
  if (!iban || iban.length < 10) return iban
  const clean = iban.replace(/\s/g, '')
  return `${clean.slice(0, 4)} •••• ${clean.slice(-4)}`
}

// Helper to format relative time (e.g., "Just now", "2 hours ago", "Yesterday")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Never'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSeconds < 60) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return formatDate(dateString)
}

// Monthly summary data for cash flow chart (12 months)
export const monthlySummary = [
  { month: '2025-02', label: 'Feb', inflow: 18500, outflow: 22100, balance: 24800 },
  { month: '2025-03', label: 'Mar', inflow: 28400, outflow: 19200, balance: 34000 },
  { month: '2025-04', label: 'Apr', inflow: 31200, outflow: 24800, balance: 40400 },
  { month: '2025-05', label: 'May', inflow: 26800, outflow: 21500, balance: 45700 },
  { month: '2025-06', label: 'Jun', inflow: 35600, outflow: 28900, balance: 52400 },
  { month: '2025-07', label: 'Jul', inflow: 29100, outflow: 26400, balance: 55100 },
  { month: '2025-08', label: 'Aug', inflow: 32700, outflow: 27800, balance: 60000 },
  { month: '2025-09', label: 'Sep', inflow: 24500, outflow: 22100, balance: 62400 },
  { month: '2025-10', label: 'Oct', inflow: 38200, outflow: 31500, balance: 69100 },
  { month: '2025-11', label: 'Nov', inflow: 33400, outflow: 28700, balance: 73800 },
  { month: '2025-12', label: 'Dec', inflow: 29800, outflow: 35200, balance: 68400 },
  { month: '2026-01', label: 'Jan', inflow: 29450, outflow: 18036, balance: 79814 },
]

// Get monthly data for a specific range (6 months ending at selectedMonth)
export const getMonthlyDataForRange = (selectedMonth, monthsToShow = 6) => {
  const selectedIndex = monthlySummary.findIndex(m => m.month === selectedMonth)
  if (selectedIndex === -1) {
    // If month not found, return last 6 months
    return monthlySummary.slice(-monthsToShow)
  }
  const startIndex = Math.max(0, selectedIndex - monthsToShow + 1)
  return monthlySummary.slice(startIndex, selectedIndex + 1)
}

// Format large currency values (e.g., €635k)
export const formatCurrencyCompact = (amount) => {
  const absAmount = Math.abs(amount)
  if (absAmount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`
  }
  if (absAmount >= 1000) {
    return `€${Math.round(amount / 1000)}k`
  }
  return formatCurrency(amount)
}

// Get end of month date
export const getEndOfMonth = (monthStr) => {
  const [year, month] = monthStr.split('-').map(Number)
  // Create date for first day of next month, then subtract 1 day
  return new Date(year, month, 0, 23, 59, 59, 999)
}

// Sync status types
export const SYNC_STATUS = {
  SYNCED: 'synced',
  OUTDATED: 'outdated',
  MISSING: 'missing',
  COMPLETE: 'complete', // Manually marked as complete
}

// Calculate sync status for an account given a target month
export const getAccountSyncStatus = (account, targetMonth) => {
  if (!account.lastSynced) {
    return { status: SYNC_STATUS.MISSING, label: 'Missing data', color: 'red' }
  }
  
  // Check if manually marked complete for this month
  if (account.monthlyStatus?.[targetMonth] === 'complete') {
    return { status: SYNC_STATUS.COMPLETE, label: 'Complete', color: 'green' }
  }
  
  const lastSyncedDate = new Date(account.lastSynced)
  const monthEnd = getEndOfMonth(targetMonth)
  const now = new Date()
  
  // For current month, compare against now; for past months, compare against month end
  const targetDate = monthEnd > now ? now : monthEnd
  
  // Calculate days difference
  const diffMs = targetDate - lastSyncedDate
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 0) {
    return { status: SYNC_STATUS.SYNCED, label: 'Synced', color: 'green' }
  } else if (diffDays <= 7) {
    return { status: SYNC_STATUS.OUTDATED, label: 'Outdated', color: 'orange' }
  } else {
    return { status: SYNC_STATUS.MISSING, label: 'Missing data', color: 'red' }
  }
}

// Format last synced date for display in detail panel
export const formatLastSyncedFull = (dateString) => {
  if (!dateString) return 'Never synced'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get list of incomplete months for an account (last N months)
export const getIncompleteMonths = (account, monthsToCheck = 3) => {
  const incomplete = []
  const now = new Date()
  
  for (let i = 0; i < monthsToCheck; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const status = getAccountSyncStatus(account, monthStr)
    
    if (status.status !== SYNC_STATUS.SYNCED && status.status !== SYNC_STATUS.COMPLETE) {
      incomplete.push({
        month: monthStr,
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        status: status.status
      })
    }
  }
  
  return incomplete
}

// Get all months status for an account (last N months) - includes complete months
export const getMonthsStatus = (account, monthsToCheck = 3) => {
  const months = []
  const now = new Date()
  
  for (let i = 0; i < monthsToCheck; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const status = getAccountSyncStatus(account, monthStr)
    
    months.push({
      month: monthStr,
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      status: status.status,
      isComplete: status.status === SYNC_STATUS.SYNCED || status.status === SYNC_STATUS.COMPLETE,
      isManuallyComplete: status.status === SYNC_STATUS.COMPLETE,
      isSynced: status.status === SYNC_STATUS.SYNCED
    })
  }
  
  return months
}

// Get the last transaction date for an account from transactions
export const getLastTransactionDate = (transactions, account) => {
  const accountTransactions = transactions.filter(t => 
    t.bankId === account.bankId || t.bankId === account.id
  )
  
  if (accountTransactions.length === 0) return null
  
  // Sort by date descending and get the first one
  const sorted = [...accountTransactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )
  
  return sorted[0]?.date || null
}

// Get the previous completed month (if today is Feb, returns January info)
export const getPreviousMonth = () => {
  const now = new Date()
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return {
    month: `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`,
    label: prevMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
}

// Check which accounts need attention for a given month
export const getAccountsNeedingAttention = (accounts, targetMonth) => {
  return accounts.filter(account => {
    if (!account.isActive) return false
    const status = getAccountSyncStatus(account, targetMonth)
    return status.status !== SYNC_STATUS.SYNCED && status.status !== SYNC_STATUS.COMPLETE
  })
}

// Coverage status types for bank accounts
export const COVERAGE_STATUS = {
  COMPLETE: 'complete',
  INCOMPLETE: 'incomplete',
  MISSING: 'missing',
  DISCONNECTED: 'disconnected',
}

// Format month string to readable label
export const formatMonthLabel = (monthStr) => {
  const date = new Date(monthStr + '-01')
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// Get coverage status for an account given a target month
export const getAccountCoverageStatus = (account, targetMonth) => {
  // Check if account is inactive
  if (account.isActive === false) {
    return { 
      status: COVERAGE_STATUS.DISCONNECTED, 
      label: 'Inactive', 
      color: 'gray',
      needsAttention: false,
      monthLabel: formatMonthLabel(targetMonth)
    }
  }
  
  // Check if account is disconnected (no lastSynced and automatic connection)
  if (!account.lastSynced && account.connectionType === 'automatic') {
    return { 
      status: COVERAGE_STATUS.DISCONNECTED, 
      label: 'Disconnected', 
      color: 'red',
      needsAttention: true,
      monthLabel: formatMonthLabel(targetMonth)
    }
  }
  
  // Check if manually marked complete for this month
  if (account.monthlyStatus?.[targetMonth] === 'complete') {
    return { 
      status: COVERAGE_STATUS.COMPLETE, 
      label: 'Complete', 
      color: 'green',
      needsAttention: false,
      monthLabel: formatMonthLabel(targetMonth)
    }
  }
  
  // No transactions at all
  if (!account.lastSynced) {
    return { 
      status: COVERAGE_STATUS.MISSING, 
      label: 'Missing data', 
      color: 'red',
      needsAttention: true,
      monthLabel: formatMonthLabel(targetMonth)
    }
  }
  
  const lastSyncedDate = new Date(account.lastSynced)
  const monthEnd = getEndOfMonth(targetMonth)
  const now = new Date()
  
  // For current month, compare against now; for past months, compare against month end
  const targetDate = monthEnd > now ? now : monthEnd
  
  // Calculate days difference
  const diffMs = targetDate - lastSyncedDate
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 0) {
    return { 
      status: COVERAGE_STATUS.COMPLETE, 
      label: 'Complete', 
      color: 'green',
      needsAttention: false,
      monthLabel: formatMonthLabel(targetMonth)
    }
  } else if (diffDays <= 7) {
    return { 
      status: COVERAGE_STATUS.INCOMPLETE, 
      label: 'Incomplete', 
      color: 'orange',
      needsAttention: true,
      monthLabel: formatMonthLabel(targetMonth)
    }
  } else {
    return { 
      status: COVERAGE_STATUS.MISSING, 
      label: 'Missing data', 
      color: 'red',
      needsAttention: true,
      monthLabel: formatMonthLabel(targetMonth)
    }
  }
}

// Check if an account needs attention
export const accountNeedsAttention = (account, targetMonth) => {
  if (account.isActive === false) return false
  const coverage = getAccountCoverageStatus(account, targetMonth)
  return coverage.needsAttention
}

// Get days since last sync for sorting
export const getDaysSinceLastSync = (account) => {
  if (!account.lastSynced) return Infinity
  const lastSyncedDate = new Date(account.lastSynced)
  const now = new Date()
  const diffMs = now - lastSyncedDate
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

// Sample Documents (receipts, invoices)
// Types: 'outgoing' (invoices to customers), 'incoming' (receipts/bills from vendors), 'tax' (tax documents)
export const sampleDocuments = [
  {
    id: 'doc-1',
    fileName: 'receipt-amazon-jan.pdf',
    uploadDate: '2026-01-20',
    documentDate: '2026-01-15',
    vendor: 'Amazon Business',
    amount: -149.99,
    type: 'incoming',
    status: 'matched',
    matchedTransactionId: 'txn-3',
    isArchived: false,
  },
  {
    id: 'doc-2',
    fileName: 'invoice-client-project.pdf',
    uploadDate: '2026-01-19',
    documentDate: '2026-01-01',
    vendor: 'Client Solutions Ltd',
    amount: 2500.00,
    type: 'outgoing',
    status: 'matched',
    matchedTransactionId: 'txn-5',
    isArchived: false,
  },
  {
    id: 'doc-3',
    fileName: 'receipt-office-supplies.jpg',
    uploadDate: '2026-01-18',
    documentDate: '2026-01-12',
    vendor: 'Staples',
    amount: -87.50,
    type: 'incoming',
    status: 'unmatched',
    matchedTransactionId: null,
    isArchived: false,
  },
  {
    id: 'doc-4',
    fileName: 'vat-return-q4-2025.pdf',
    uploadDate: '2026-01-17',
    documentDate: '2025-12-31',
    vendor: 'Tax Authority',
    amount: -1234.56,
    type: 'tax',
    status: 'matched',
    matchedTransactionId: 'txn-8',
    isArchived: false,
  },
  {
    id: 'doc-5',
    fileName: 'receipt-uber.png',
    uploadDate: '2026-01-16',
    documentDate: '2026-01-10',
    vendor: 'Uber',
    amount: -23.40,
    type: 'incoming',
    status: 'unmatched',
    matchedTransactionId: null,
    isArchived: false,
  },
  {
    id: 'doc-6',
    fileName: 'invoice-consulting-dec.pdf',
    uploadDate: '2026-01-15',
    documentDate: '2025-12-15',
    vendor: 'Acme Corp',
    amount: 4500.00,
    type: 'outgoing',
    status: 'matched',
    matchedTransactionId: null,
    isArchived: false,
  },
  {
    id: 'doc-7',
    fileName: 'receipt-restaurant.jpg',
    uploadDate: '2025-11-14',
    documentDate: '2025-11-08',
    vendor: 'Restaurant Milano',
    amount: -45.80,
    type: 'incoming',
    status: 'unmatched',
    matchedTransactionId: null,
    isArchived: false,
  },
  {
    id: 'doc-8',
    fileName: 'income-tax-prepayment.pdf',
    uploadDate: '2026-01-10',
    documentDate: '2026-01-01',
    vendor: 'Tax Authority',
    amount: -850.00,
    type: 'tax',
    status: 'matched',
    matchedTransactionId: 'txn-12',
    isArchived: false,
  },
  {
    id: 'doc-9',
    fileName: 'old-receipt-hotel.jpg',
    uploadDate: '2025-10-05',
    documentDate: '2025-09-20',
    vendor: 'Marriott Hotels',
    amount: -189.00,
    type: 'incoming',
    status: 'unmatched',
    matchedTransactionId: null,
    isArchived: false,
  },
  {
    id: 'doc-10',
    fileName: 'archived-invoice.pdf',
    uploadDate: '2025-08-01',
    documentDate: '2025-07-15',
    vendor: 'Old Client Inc',
    amount: 1200.00,
    type: 'outgoing',
    status: 'matched',
    matchedTransactionId: null,
    isArchived: true,
  },
]
