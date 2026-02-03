import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Badge from './ui/Badge'
import Checkbox from './ui/Checkbox'
import { getMilestoneProgress } from '../data/clientPortalData'

const ClientMilestone = ({ milestone, onTaskToggle, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { completed, total } = getMilestoneProgress(milestone)

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'info'
      case 'upcoming':
      default:
        return 'neutral'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in_progress':
        return 'In Progress'
      case 'upcoming':
      default:
        return 'Upcoming'
    }
  }

  const handleTaskToggle = (task) => {
    if (task.assignee === 'client' && onTaskToggle) {
      // Toggle between 'active' and 'completed' status
      const newStatus = task.status === 'completed' ? 'active' : 'completed'
      onTaskToggle(milestone.id, task.id, newStatus)
    }
  }

  return (
    <div className="border border-[#E8E8E8] rounded-lg bg-white overflow-hidden">
      {/* Milestone Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors duration-[120ms]"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#8D8D8D]">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
          <span className="text-14 font-medium text-[#18181A]">{milestone.name}</span>
          <Badge variant={getStatusVariant(milestone.status)}>
            {getStatusLabel(milestone.status)}
          </Badge>
        </div>
        <span className="text-13 text-[#656565]">
          {completed}/{total} tasks
        </span>
      </button>

      {/* Task List */}
      {isExpanded && (
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
                variant={task.assignee === 'client' ? 'primary' : 'neutral'}
              >
                {task.assignee === 'client' ? 'You' : 'Agency'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClientMilestone
