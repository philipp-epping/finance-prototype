import React, { useState } from 'react'
import { Calendar, Video, ChevronDown, ChevronRight } from 'lucide-react'
import { clientMeetings, formatMeetingTime, formatMeetingDate } from '../data/clientPortalData'
import MeetingList from './meetings/MeetingList'
import MeetingDetail from './meetings/MeetingDetail'

// Calendar badge component matching Figma design
const CalendarBadge = ({ date }) => {
  const { month, day } = formatMeetingDate(date)
  
  return (
    <div className="flex flex-col items-center justify-center w-11 h-11 bg-white border border-[#E8E8E8] rounded-lg shadow-xs">
      <span className="text-10 font-medium text-[#DC2626] leading-none">{month}</span>
      <span className="text-16 font-semibold text-[#18181A] leading-tight">{day}</span>
    </div>
  )
}

// Avatar stack component
const AvatarStack = ({ participants, max = 2 }) => {
  const visible = participants.slice(0, max)
  const remaining = participants.length - max
  
  return (
    <div className="flex -space-x-2">
      {visible.map((participant, idx) => (
        <div
          key={participant.id}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] border-2 border-white flex items-center justify-center"
          title={participant.name}
        >
          <span className="text-10 font-medium text-[#4338CA]">
            {participant.name.charAt(0)}
          </span>
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full bg-[#F0F0F0] border-2 border-white flex items-center justify-center">
          <span className="text-10 font-medium text-[#656565]">+{remaining}</span>
        </div>
      )}
    </div>
  )
}

const ClientMeetings = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedMeetingId, setSelectedMeetingId] = useState(
    clientMeetings.past.length > 0 ? clientMeetings.past[0].id : null
  )
  
  const upcomingMeeting = clientMeetings.upcoming
  const pastMeetings = clientMeetings.past
  const hasUpcoming = upcomingMeeting !== null
  const relativeTime = hasUpcoming ? formatMeetingTime(upcomingMeeting.date) : null
  
  const selectedMeeting = pastMeetings.find(m => m.id === selectedMeetingId) || pastMeetings[0]

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
      {/* Header - Always visible, toggles expansion */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors duration-[120ms]"
      >
        <div className="flex items-center gap-4">
          {hasUpcoming ? (
            <>
              <CalendarBadge date={upcomingMeeting.date} />
              <div className="text-left">
                <h3 className="text-14 font-medium text-[#18181A] line-clamp-1">
                  {upcomingMeeting.title}
                </h3>
                <p className="text-12 text-[#F97316] font-medium">
                  {relativeTime}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-11 h-11 rounded-lg bg-[#F0F0F0] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#656565]" />
              </div>
              <div className="text-left">
                <h3 className="text-14 font-medium text-[#18181A]">Meetings</h3>
                <p className="text-12 text-[#656565]">
                  No upcoming meetings
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {hasUpcoming && (
            <>
              <AvatarStack participants={upcomingMeeting.participants} />
              <a
                href={upcomingMeeting.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#4D5FFF] text-white text-12 font-medium rounded-lg hover:bg-[#3D4FEF] transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                Join Meeting
              </a>
            </>
          )}
          <span className="text-[#8D8D8D]">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </span>
        </div>
      </button>

      {/* Expanded content - Inline within the card */}
      {isExpanded && (
        <div className="flex border-t border-[#E8E8E8] max-h-[600px]">
          {/* Left sidebar - Meeting list */}
          <MeetingList 
            meetings={pastMeetings}
            selectedId={selectedMeetingId}
            onSelect={setSelectedMeetingId}
          />
          
          {/* Right panel - Meeting detail */}
          <MeetingDetail 
            meeting={selectedMeeting}
          />
        </div>
      )}
    </div>
  )
}

export default ClientMeetings
