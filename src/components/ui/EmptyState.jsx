import React from 'react'

const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center max-w-[420px] mx-auto py-12 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-lg bg-[#F0F0F0] flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-[#8D8D8D]" />
        </div>
      )}
      <h3 className="text-14 font-medium text-[#18181A] mb-1">{title}</h3>
      <p className="text-13 text-[#656565] mb-4">{description}</p>
      {action && action}
    </div>
  )
}

export default EmptyState
