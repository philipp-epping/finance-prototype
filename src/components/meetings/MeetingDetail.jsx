import React, { useState } from 'react'
import { FileText, Video, AlignLeft, Phone } from 'lucide-react'
import { formatMeetingDate } from '../../data/clientPortalData'
import MeetingVideoPlayer from './MeetingVideoPlayer'
import MeetingTranscript from './MeetingTranscript'

// Tab definitions
const TABS = [
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'recording', label: 'Recording', icon: Video },
  { id: 'transcript', label: 'Transcript', icon: AlignLeft }
]

// Notes tab content
const NotesTab = ({ meeting }) => {
  const notes = meeting.notes
  const hasContent = notes?.content && notes.content.length > 0
  const quickActions = notes?.quickActions || []
  const isConnected = notes?.connected || false
  
  return (
    <div className="space-y-4">
      {/* Connection status */}
      {isConnected && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-12 text-[#656565]">Connected</span>
        </div>
      )}
      
      {/* Notes content or placeholder */}
      <div className="min-h-[120px]">
        {hasContent ? (
          <div className="text-14 text-[#656565] whitespace-pre-wrap">
            {notes.content}
          </div>
        ) : (
          <p className="text-14 text-[#8D8D8D] italic">
            Add notes here
          </p>
        )}
      </div>
      
      {/* Quick action buttons */}
      {quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {quickActions.map(action => (
            <button
              key={action.id}
              className="flex items-center gap-2 px-3 py-2 bg-[#F5F5F5] hover:bg-[#EBEBEB] border border-[#E8E8E8] rounded-lg text-13 text-[#656565] transition-colors"
            >
              {action.icon === 'file-text' && <FileText className="w-4 h-4" />}
              {action.icon === 'phone' && <Phone className="w-4 h-4" />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Recording tab content
const RecordingTab = ({ meeting }) => {
  const hasRecording = meeting.hasRecording && meeting.recordingUrl
  const hasSummary = meeting.summary && meeting.summary.length > 0
  
  return (
    <div className="space-y-6">
      {/* Video player or placeholder */}
      {hasRecording ? (
        <MeetingVideoPlayer 
          url={meeting.recordingUrl}
          thumbnail={meeting.recordingThumbnail}
        />
      ) : (
        <div className="aspect-video bg-[#F5F5F5] rounded-xl flex flex-col items-center justify-center border border-[#E8E8E8]">
          <Video className="w-10 h-10 text-[#8D8D8D] mb-2" />
          <p className="text-14 text-[#656565]">
            {meeting.hasRecording ? 'Recording not shared' : 'No recording available'}
          </p>
        </div>
      )}
      
      {/* Meeting summary */}
      <div className="space-y-2">
        <h4 className="text-14 font-semibold text-[#18181A]">Meeting Summary</h4>
        <p className="text-14 text-[#656565]">
          {hasSummary ? meeting.summary : 'No summary available for this meeting.'}
        </p>
      </div>
    </div>
  )
}

// Transcript tab content
const TranscriptTab = ({ meeting }) => {
  const transcript = meeting.transcript || []
  const hasTranscript = transcript.length > 0
  
  if (!hasTranscript) {
    return (
      <div className="py-8 text-center">
        <AlignLeft className="w-10 h-10 text-[#8D8D8D] mx-auto mb-2" />
        <p className="text-14 text-[#656565]">
          No transcript available for this meeting.
        </p>
      </div>
    )
  }
  
  return (
    <MeetingTranscript transcript={transcript} />
  )
}

const MeetingDetail = ({ meeting }) => {
  const [activeTab, setActiveTab] = useState('notes')
  
  if (!meeting) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-14 text-[#656565]">Select a meeting to view details</p>
      </div>
    )
  }
  
  const { month, day, time } = formatMeetingDate(meeting.date)
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E8E8E8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Date badge */}
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-white border border-[#E8E8E8] rounded-lg shadow-xs">
              <span className="text-10 font-medium text-[#DC2626] leading-none">{month}</span>
              <span className="text-16 font-semibold text-[#18181A] leading-tight">{day}</span>
            </div>
            
            {/* Meeting info */}
            <div>
              <h2 className="text-16 font-semibold text-[#18181A]">
                {meeting.title}
              </h2>
              <p className="text-13 text-[#656565]">
                {time}
              </p>
            </div>
          </div>
          
          {/* Avatars */}
          <div className="flex -space-x-2">
            {meeting.participants.map((participant, idx) => (
              <div
                key={participant.id}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] border-2 border-white flex items-center justify-center"
                title={participant.name}
              >
                <span className="text-11 font-medium text-[#4338CA]">
                  {participant.name.charAt(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-6 mt-4 -mb-px">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 pb-3 text-13 font-medium transition-colors ${
                  isActive 
                    ? 'text-[#18181A]' 
                    : 'text-[#656565] hover:text-[#18181A]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#18181A]" />
                )}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'notes' && <NotesTab meeting={meeting} />}
        {activeTab === 'recording' && <RecordingTab meeting={meeting} />}
        {activeTab === 'transcript' && <TranscriptTab meeting={meeting} />}
      </div>
    </div>
  )
}

export default MeetingDetail
