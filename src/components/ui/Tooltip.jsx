import React, { useState, useRef, useEffect } from 'react'

const Tooltip = ({ 
  children, 
  content, 
  shortcut,
  position = 'top',
  delay = 200,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const timeoutRef = useRef(null)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      
      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.left - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.right + 8
          break
        default:
          break
      }

      // Keep tooltip within viewport
      left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8))
      top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8))

      setCoords({ top, left })
    }
  }, [isVisible, position])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!content) {
    return children
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`inline-block ${className}`}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] px-2 py-1.5 bg-[#18181A] text-white text-12 font-medium rounded-sm shadow-sm flex items-center gap-2 whitespace-nowrap"
          style={{ top: coords.top, left: coords.left }}
        >
          <span>{content}</span>
          {shortcut && (
            <span className="text-[#8D8D8D]">{shortcut}</span>
          )}
        </div>
      )}
    </>
  )
}

export default Tooltip
