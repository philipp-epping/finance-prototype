import React from 'react'
import { Calendar } from 'lucide-react'

const ClientMeetings = () => {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0F0F0] flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#656565]" />
          </div>
          <div>
            <h3 className="text-14 font-medium text-[#18181A]">Meetings</h3>
            <p className="text-12 text-[#656565]">No upcoming meetings</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientMeetings
