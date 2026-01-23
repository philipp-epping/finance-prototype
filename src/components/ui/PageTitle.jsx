import React from 'react'

const PageTitle = ({ 
  title, 
  subtitle,
  children,
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between border-b border-[#E8E8E8] pb-4 ${className}`}>
      <div>
        <h1 className="text-14 font-medium text-[#18181A]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-13 text-[#656565] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Action slot */}
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}

export default PageTitle
