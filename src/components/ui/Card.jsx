import React from 'react'

const Card = ({ title, subtitle, children, className = '', padding = true }) => {
  return (
    <div className={`bg-white border border-alpha-10 rounded-xl shadow-xs ${padding ? 'p-4' : ''} ${className}`}>
      {(title || subtitle) && (
        <div className={padding ? 'mb-4' : 'p-4 pb-0 mb-4'}>
          {title && <h3 className="text-14 font-medium text-[#18181A]">{title}</h3>}
          {subtitle && <p className="text-12 text-[#656565] mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
