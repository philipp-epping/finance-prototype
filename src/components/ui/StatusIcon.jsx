import React from 'react'

const StatusIcon = ({ 
  status = 'backlog', 
  color = 'grey',
  size = 'md',
  className = '' 
}) => {
  // Size mapping
  const sizes = {
    sm: 12,
    md: 16,
    lg: 20,
  }
  const iconSize = sizes[size] || sizes.md

  // Color mapping from Figma Design System
  const colors = {
    green: '#50942A',
    red: '#F13B3B',
    orange: '#FEA101',
    purple: '#7C3AED',
    blue: '#4D5FFF',
    grey: '#8D8D8D',
  }
  const fillColor = colors[color] || colors.grey

  // Status determines the fill level
  // backlog = empty circle, todo = 1/4 filled, inProgress = 1/2 filled, done = full circle
  const renderIcon = () => {
    const strokeWidth = 1.5
    const radius = (iconSize - strokeWidth) / 2
    const center = iconSize / 2

    switch (status) {
      case 'backlog':
        // Empty circle (just stroke)
        return (
          <svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`} fill="none">
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              stroke={fillColor} 
              strokeWidth={strokeWidth}
              strokeDasharray="2 2"
            />
          </svg>
        )

      case 'todo':
        // 1/4 filled circle
        return (
          <svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`} fill="none">
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              stroke={fillColor} 
              strokeWidth={strokeWidth}
            />
            <path 
              d={`M${center},${center} L${center},${strokeWidth/2} A${radius},${radius} 0 0,1 ${iconSize - strokeWidth/2},${center} Z`}
              fill={fillColor}
            />
          </svg>
        )

      case 'inProgress':
        // 1/2 filled circle
        return (
          <svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`} fill="none">
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              stroke={fillColor} 
              strokeWidth={strokeWidth}
            />
            <path 
              d={`M${center},${strokeWidth/2} A${radius},${radius} 0 0,1 ${center},${iconSize - strokeWidth/2} L${center},${center} Z`}
              fill={fillColor}
            />
          </svg>
        )

      case 'done':
        // Fully filled circle
        return (
          <svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`} fill="none">
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              fill={fillColor}
            />
          </svg>
        )

      default:
        return (
          <svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`} fill="none">
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              stroke={fillColor} 
              strokeWidth={strokeWidth}
            />
          </svg>
        )
    }
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {renderIcon()}
    </div>
  )
}

export default StatusIcon
