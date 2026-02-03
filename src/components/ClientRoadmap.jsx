import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Map } from 'lucide-react'
import ClientMilestone from './ClientMilestone'
import { getRoadmapSummary } from '../data/clientPortalData'

const ClientRoadmap = ({ project, onTaskToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const summary = getRoadmapSummary(project)

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors duration-[120ms]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0F0F0] flex items-center justify-center">
            <Map className="w-4 h-4 text-[#656565]" />
          </div>
          <div className="text-left">
            <h3 className="text-14 font-medium text-[#18181A]">Roadmap</h3>
            <p className="text-12 text-[#656565]">
              {summary.completed} of {summary.total} milestones completed
              {summary.inProgress > 0 && ` • ${summary.inProgress} in progress`}
            </p>
          </div>
        </div>
        <span className="text-[#8D8D8D]">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </span>
      </button>

      {/* Milestones - Expandable */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-3">
          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4D5FFF] rounded-full transition-all duration-300"
                style={{ width: `${(summary.completed / summary.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Milestone list */}
          {project.roadmap.map((milestone, index) => (
            <ClientMilestone
              key={milestone.id}
              milestone={milestone}
              onTaskToggle={onTaskToggle}
              defaultExpanded={milestone.status === 'in_progress'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ClientRoadmap
