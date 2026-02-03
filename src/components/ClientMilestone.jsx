import React, { useState } from 'react'
import { ChevronDown, ChevronRight, MessageSquareWarning } from 'lucide-react'
import Badge from './ui/Badge'
import Checkbox from './ui/Checkbox'
import { getMilestoneProgress } from '../data/clientPortalData'

// Segmented Progress Bar Component
const SegmentedProgressBar = ({ completed, total, color = 'green' }) => {
  const colorClass = color === 'green' ? 'bg-[#50942A]' : 'bg-[#4D5FFF]'
  
  return (
    <div className="flex gap-0.5 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div 
          key={i}
          className={`h-2 flex-1 rounded-sm transition-colors ${
            i < completed ? colorClass : 'bg-[#E8E8E8]'
          }`}
        />
      ))}
    </div>
  )
}

// Mini Progress Indicator for header (compact circular style)
const MiniProgressIndicator = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0
  const circumference = 2 * Math.PI * 8 // radius = 8
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="flex items-center gap-1.5">
      <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90">
        {/* Background circle */}
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="#E8E8E8"
          strokeWidth="2"
        />
        {/* Progress circle */}
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="#4D5FFF"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-12 text-[#656565]">{completed} of {total}</span>
    </div>
  )
}

// Warning Callout Component
const BlockingWarningCallout = () => (
  <div className="mx-4 mb-3 p-3 border border-[#F5DCC3] bg-[#FEF9F3] rounded-lg">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
        <MessageSquareWarning className="w-4 h-4 text-[#D97706]" />
      </div>
      <div>
        <p className="text-13 font-medium text-[#92400E]">Your Input needed</p>
        <p className="text-12 text-[#B45309]">Progress is blocked by a task on your side</p>
      </div>
    </div>
  </div>
)

const ClientMilestone = ({ milestone, onTaskToggle, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { completed, total } = getMilestoneProgress(milestone)

  // Check if milestone is blocked by a client task
  // Tasks are sequential by default - find the first uncompleted task that is NOT marked as nonBlocking
  const firstBlockingUncompletedTask = milestone.tasks.find(
    task => task.status !== 'completed' && !task.nonBlocking
  )
  
  // Show warning only if the first blocking uncompleted task is assigned to the client
  const isBlockedByClient = firstBlockingUncompletedTask && 
    firstBlockingUncompletedTask.assignee === 'client'

  const handleTaskToggle = (task) => {
    if (task.assignee === 'client' && onTaskToggle) {
      // Toggle between 'active' and 'completed' status
      const newStatus = task.status === 'completed' ? 'active' : 'completed'
      onTaskToggle(milestone.id, task.id, newStatus)
    }
  }

  const isCompleted = milestone.status === 'completed'

  return (
    <div className="border border-[#E8E8E8] rounded-lg bg-white overflow-hidden">
      {/* Milestone Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors duration-[120ms]"
      >
        {/* Left side: Chevron + Name */}
        <div className="flex items-center gap-3">
          <span className="text-[#8D8D8D]">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
          <span className="text-14 font-medium text-[#18181A]">{milestone.name}</span>
        </div>
        
        {/* Right side: Duration + Progress OR Completed badge */}
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <Badge variant="success">Completed</Badge>
          ) : (
            <>
              {milestone.estimatedDuration && (
                <span className="text-12 text-[#8D8D8D] border border-[#E8E8E8] rounded px-2 py-0.5">
                  ~{milestone.estimatedDuration}
                </span>
              )}
              <MiniProgressIndicator completed={completed} total={total} />
            </>
          )}
        </div>
      </button>

      {/* Warning Callout - visible when has blocking task (collapsed OR expanded) */}
      {isBlockedByClient && !isCompleted && (
        <BlockingWarningCallout />
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Progress Section (not for completed milestones) */}
          {!isCompleted && (
            <div className="px-4 pb-3">
              <div className="text-13 mb-2">
                <span className="text-[#656565]">Progress</span>
              </div>
              <SegmentedProgressBar completed={completed} total={total} color="green" />
            </div>
          )}

          {/* Task List */}
          <div className="border-t border-[#E8E8E8]">
            {milestone.tasks.map((task, index) => (
              <div
                key={task.id}
                className={`px-4 py-2.5 flex items-center justify-between ${
                  index !== milestone.tasks.length - 1 ? 'border-b border-[#F0F0F0]' : ''
                } ${task.assignee === 'agency' ? 'bg-[#FAFAFA]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onChange={() => handleTaskToggle(task)}
                    disabled={task.assignee === 'agency'}
                    completedVariant={task.assignee === 'client' ? 'grey' : undefined}
                  />
                  <span
                    className={`text-13 ${
                      task.status === 'completed'
                        ? 'text-[#8D8D8D] line-through'
                        : 'text-[#18181A]'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <Badge
                  variant={task.assignee === 'client' && task.status !== 'completed' ? 'primary' : 'neutral'}
                >
                  {task.assignee === 'client' ? 'You' : 'Agency'}
                </Badge>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ClientMilestone
