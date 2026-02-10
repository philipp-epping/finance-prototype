import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const explorations = [
  {
    id: 'finance-prototype',
    title: 'Finance Prototype',
    description: 'Financial dashboard with cash accounts, transactions, and document management.',
    path: '/finance-prototype',
  },
  {
    id: 'client-portal',
    title: 'Client Portal',
    description: 'Client and agency portal views.',
    path: '/client-portal',
  },
  {
    id: 'sales-rep-training',
    title: 'Sales Rep Training and Onboarding',
    description: 'Sales representative training and onboarding workflows.',
    path: '/sales-rep-training',
  },
]

function ExplorationsPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-[#18181A] mb-2">Explorations</h1>
        <p className="text-[#656565] mb-8">Select an exploration to view.</p>
        
        <div className="space-y-3">
          {explorations.map((exploration) => (
            <Link
              key={exploration.id}
              to={exploration.path}
              className="block bg-white border border-[#E8E8E8] rounded-lg p-4 hover:border-[#C4C4C4] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-medium text-[#18181A] mb-1">
                    {exploration.title}
                  </h2>
                  <p className="text-[13px] text-[#8D8D8D]">
                    {exploration.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8D8D8D] group-hover:text-[#18181A] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExplorationsPage
