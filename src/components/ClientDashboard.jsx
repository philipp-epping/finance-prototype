import React, { useState, useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import ClientTasksSection from './ClientTasksSection'
import ClientRoadmap from './ClientRoadmap'
import ClientMeetings from './ClientMeetings'
import { clientProject, isTaskOverdue } from '../data/clientPortalData'

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('my-tasks')
  const [statusView, setStatusView] = useState('active')
  const [project, setProject] = useState(clientProject)

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    let overdueTasks = 0
    let blockedMilestones = 0
    let totalClientTasks = 0

    project.roadmap.forEach(milestone => {
      let milestoneBlocked = false
      
      milestone.tasks.forEach(task => {
        if (task.assignee === 'client' && task.status === 'active') {
          totalClientTasks++
          
          if (isTaskOverdue(task)) {
            overdueTasks++
          }
          
          if (task.blocksMilestone && task.status !== 'completed') {
            milestoneBlocked = true
          }
        }
      })
      
      if (milestoneBlocked) {
        blockedMilestones++
      }
    })

    return { overdueTasks, blockedMilestones, totalClientTasks }
  }, [project])

  // Handle task status change - updates the project state
  const handleTaskToggle = (milestoneId, taskId, newStatus) => {
    setProject(prev => ({
      ...prev,
      roadmap: prev.roadmap.map(milestone => {
        if (milestone.id !== milestoneId) return milestone
        return {
          ...milestone,
          tasks: milestone.tasks.map(task => {
            if (task.id !== taskId) return task
            return { ...task, status: newStatus }
          })
        }
      })
    }))
  }

  // Handle marking a task as needing attention (with optional message from modal)
  const handleMarkNeedsAttention = (milestoneId, taskId, message = '') => {
    setProject(prev => ({
      ...prev,
      roadmap: prev.roadmap.map(milestone => {
        if (milestone.id !== milestoneId) return milestone
        return {
          ...milestone,
          tasks: milestone.tasks.map(task => {
            if (task.id !== taskId) return task
            // Set needsAttention to true and store the help message
            return { 
              ...task, 
              needsAttention: true,
              helpMessage: message 
            }
          })
        }
      })
    }))
  }

  // Handle adding a new task
  const handleAddTask = (taskData) => {
    const newTaskId = `t-${Date.now()}`
    const milestoneId = taskData.milestoneId || project.roadmap[0]?.id // Default to first milestone if not specified
    
    setProject(prev => ({
      ...prev,
      roadmap: prev.roadmap.map(milestone => {
        if (milestone.id !== milestoneId) return milestone
        return {
          ...milestone,
          tasks: [
            ...milestone.tasks,
            {
              id: newTaskId,
              title: taskData.title,
              assignee: 'client', // Default to client
              assigneeName: taskData.assigneeName,
              status: 'active',
              dueDate: taskData.dueDate,
              blocksMilestone: false,
              needsAttention: false,
              description: taskData.description || ''
            }
          ]
        }
      })
    }))
  }

  // Handle updating an existing task
  const handleUpdateTask = (milestoneId, taskId, taskData) => {
    setProject(prev => ({
      ...prev,
      roadmap: prev.roadmap.map(milestone => {
        if (milestone.id !== milestoneId) return milestone
        return {
          ...milestone,
          tasks: milestone.tasks.map(task => {
            if (task.id !== taskId) return task
            return {
              ...task,
              title: taskData.title,
              dueDate: taskData.dueDate,
              assigneeName: taskData.assigneeName,
              description: taskData.description || ''
              // Note: milestoneId changes would require moving the task between milestones
            }
          })
        }
      })
    }))
  }

  // Handle requesting changes on a review task
  const handleRequestChange = (milestoneId, taskId) => {
    // Mark the task as needing attention and flag it for revision
    setProject(prev => ({
      ...prev,
      roadmap: prev.roadmap.map(milestone => {
        if (milestone.id !== milestoneId) return milestone
        return {
          ...milestone,
          tasks: milestone.tasks.map(task => {
            if (task.id !== taskId) return task
            return { ...task, needsAttention: true }
          })
        }
      })
    }))
  }

  // Handle canceling a help request
  const handleCancelHelpRequest = (milestoneId, taskId) => {
    setProject(prev => ({
      ...prev,
      roadmap: prev.roadmap.map(milestone => {
        if (milestone.id !== milestoneId) return milestone
        return {
          ...milestone,
          tasks: milestone.tasks.map(task => {
            if (task.id !== taskId) return task
            return { ...task, needsAttention: false, helpMessage: '' }
          })
        }
      })
    }))
  }

  const tabs = [
    { id: 'my-tasks', label: 'My Tasks' },
    { id: 'all-tasks', label: 'All Tasks' }
  ]

  // Determine if we should show the alert
  const showAlert = summaryStats.overdueTasks > 0 || summaryStats.blockedMilestones > 0

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header - constrained to same width as content */}
      <div className="px-8 pt-6 pb-4">
        <div className="max-w-4xl flex items-start justify-between gap-6">
          <div>
            <h1 className="text-18 font-semibold text-[#18181A]">{project.name}</h1>
            <p className="text-13 text-[#656565] mt-0.5">{project.client}</p>
          </div>

          {/* Alert Banner - shown when there are overdue tasks or blocked milestones */}
          {showAlert && (
            <div className="flex items-start gap-3 px-4 py-3 bg-[#FFF7F6] border border-[#FFCBC4] rounded-lg flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#F13B3B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-13 font-medium text-[#18181A]">
                  {summaryStats.overdueTasks > 0 && (
                    <span>{summaryStats.overdueTasks} overdue task{summaryStats.overdueTasks !== 1 ? 's' : ''}</span>
                  )}
                  {summaryStats.overdueTasks > 0 && summaryStats.blockedMilestones > 0 && (
                    <span> · </span>
                  )}
                  {summaryStats.blockedMilestones > 0 && (
                    <span>{summaryStats.blockedMilestones} milestone{summaryStats.blockedMilestones !== 1 ? 's' : ''} blocked</span>
                  )}
                </p>
                <p className="text-12 text-[#656565] mt-0.5">
                  Your action is needed to keep the project on track.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="space-y-6 max-w-4xl">
          {/* Tasks Section with Tabs */}
          <ClientTasksSection 
            project={project} 
            onTaskToggle={handleTaskToggle}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
            statusView={statusView}
            onStatusViewChange={setStatusView}
            onMarkNeedsAttention={handleMarkNeedsAttention}
            onCancelHelpRequest={handleCancelHelpRequest}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onRequestChange={handleRequestChange}
          />

          {/* Roadmap Section - Always visible */}
          <ClientRoadmap 
            project={project} 
            onTaskToggle={handleTaskToggle}
          />

          {/* Meetings Section - Placeholder */}
          <ClientMeetings />
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
