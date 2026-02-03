import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

// Transcript paragraph component matching Figma design
const TranscriptParagraph = ({ entry, onTimestampClick }) => {
  return (
    <div className="space-y-1">
      {/* Speaker and timestamp row */}
      <div className="flex items-center gap-2 text-13">
        <span className="font-medium text-[#656565]">{entry.speaker}</span>
        <span className="text-[#8D8D8D]">·</span>
        <button 
          onClick={() => onTimestampClick?.(entry.seconds)}
          className="font-medium text-[#4D5FFF] hover:text-[#3D4FEF] transition-colors"
        >
          {entry.timestamp}
        </button>
      </div>
      
      {/* Transcript text */}
      <p className="text-14 text-[#656565] leading-relaxed">
        {entry.text}
      </p>
    </div>
  )
}

const MeetingTranscript = ({ transcript, onTimestampClick }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  
  if (!transcript || transcript.length === 0) {
    return null
  }
  
  return (
    <div className="space-y-4">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-14 font-medium text-[#656565] hover:text-[#18181A] transition-colors"
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        {isExpanded ? 'Hide transcript' : 'Show transcript'}
      </button>
      
      {/* Transcript content */}
      {isExpanded && (
        <div className="space-y-5">
          {transcript.map(entry => (
            <TranscriptParagraph 
              key={entry.id}
              entry={entry}
              onTimestampClick={onTimestampClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MeetingTranscript
