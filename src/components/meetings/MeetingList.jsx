import React, { useState } from 'react'
import { formatMeetingDate } from '../../data/clientPortalData'

// Meeting list item component
const MeetingListItem = ({ meeting, isSelected, onClick }) => {
  const { month, day, time } = formatMeetingDate(meeting.date)
  
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors duration-[120ms] rounded-lg ${
        isSelected 
          ? 'bg-white shadow-xs' 
          : 'hover:bg-[#FAFAFA]'
      }`}
    >
      {/* Date badge */}
      <div className={`flex flex-col items-center justify-center min-w-[40px] py-1.5 px-2 rounded-lg border ${
        isSelected 
          ? 'bg-white border-[#E8E8E8]' 
          : 'bg-[#FAFAFA] border-transparent'
      }`}>
        <span className="text-10 font-medium text-[#DC2626] leading-none">{month}</span>
        <span className="text-14 font-semibold text-[#18181A] leading-tight">{day}</span>
      </div>
      
      {/* Meeting info */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-13 font-medium truncate ${
          isSelected ? 'text-[#18181A]' : 'text-[#656565]'
        }`}>
          {meeting.title}
        </h4>
        <p className="text-12 text-[#8D8D8D]">
          {meeting.participants.map(p => p.name).join(', ')} · {time}
        </p>
      </div>
    </button>
  )
}

const MeetingList = ({ meetings, selectedId, onSelect }) => {
  const [visibleCount, setVisibleCount] = useState(10)
  
  const visibleMeetings = meetings.slice(0, visibleCount)
  const hasMore = meetings.length > visibleCount
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10)
  }
  
  return (
    <div className="w-[280px] border-r border-[#E8E8E8] bg-[#FAFAFA] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#E8E8E8]">
        <h3 className="text-14 font-semibold text-[#18181A]">
          Meetings
        </h3>
      </div>
      
      {/* Meeting list */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {visibleMeetings.map(meeting => (
            <MeetingListItem
              key={meeting.id}
              meeting={meeting}
              isSelected={meeting.id === selectedId}
              onClick={() => onSelect(meeting.id)}
            />
          ))}
        </div>
        
        {/* Load more button */}
        {hasMore && (
          <button
            onClick={handleLoadMore}
            className="w-full mt-3 py-2 text-12 text-[#656565] hover:text-[#18181A] transition-colors"
          >
            Load more meetings
          </button>
        )}
      </div>
    </div>
  )
}

export default MeetingList
