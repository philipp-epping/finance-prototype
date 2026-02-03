import React, { useState, useRef, useEffect } from 'react'
import { CheckCircle2, ClipboardList, Check, Plus, MoreHorizontal, HelpCircle, ArrowLeft, ThumbsUp, ThumbsDown, X, User, Calendar, Pencil } from 'lucide-react'
import { getTasksForView, isTaskOverdue, formatDueDate, groupTasksByAssignee } from '../data/clientPortalData'

const ClientTasksSection = ({ 
  project, 
  onTaskToggle, 
  activeTab, 
  onTabChange, 
  tabs,
  statusView = 'active',
  onStatusViewChange,
  onMarkNeedsAttention,
  onCancelHelpRequest,
  onAddTask,
  onUpdateTask,
  onRequestChange
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpModalTask, setHelpModalTask] = useState(null) // Task object when modal is open
  const [helpMessage, setHelpMessage] = useState('')
  const menuRef = useRef(null)
  
  // Task modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskModalMode, setTaskModalMode] = useState('view') // 'view' | 'edit' | 'add'
  const [selectedTask, setSelectedTask] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    dueDate: '',
    assigneeName: '',
    milestoneId: ''
  })

  // Get all unique assignee names from project
  const allAssigneeNames = React.useMemo(() => {
    const names = new Set()
    project.roadmap.forEach(milestone => {
      milestone.tasks.forEach(task => {
        if (task.assigneeName) names.add(task.assigneeName)
      })
    })
    return Array.from(names).sort()
  }, [project])

  // Get all milestones from project
  const allMilestones = React.useMemo(() => {
    return project.roadmap.map(m => ({ id: m.id, name: m.name }))
  }, [project])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get tasks based on active tab and status view
  const myTasksOnly = activeTab === 'my-tasks'
  const displayTasks = getTasksForView(project, statusView, myTasksOnly)
  
  // Group tasks by assignee for "All Tasks" view
  const groupedTasks = !myTasksOnly ? groupTasksByAssignee(displayTasks) : null
  const assigneeNames = groupedTasks ? Object.keys(groupedTasks).sort() : []

  // Check if task is a review task (based on title)
  const isReviewTask = (task) => {
    const title = task.title.toLowerCase()
    return title.includes('review') || title.includes('approve')
  }

  const handleMarkDone = (task) => {
    if (onTaskToggle) {
      onTaskToggle(task.milestoneId, task.id, 'completed')
    }
  }

  const handleApprove = (task) => {
    if (onTaskToggle) {
      onTaskToggle(task.milestoneId, task.id, 'completed')
    }
  }

  const handleRequestChange = (task) => {
    if (onRequestChange) {
      onRequestChange(task.milestoneId, task.id)
    }
  }

  const handleHelpButtonClick = (task) => {
    if (task.needsAttention) {
      // Cancel the help request
      if (onCancelHelpRequest) {
        onCancelHelpRequest(task.milestoneId, task.id)
      }
    } else {
      // Open the help modal
      setHelpModalTask(task)
      setHelpMessage('')
    }
  }

  const closeHelpModal = () => {
    setHelpModalTask(null)
    setHelpMessage('')
  }

  const submitHelpRequest = () => {
    if (helpModalTask && onMarkNeedsAttention) {
      onMarkNeedsAttention(helpModalTask.milestoneId, helpModalTask.id, helpMessage)
    }
    closeHelpModal()
  }

  // Task modal handlers
  const openTaskModal = (task) => {
    setSelectedTask(task)
    setTaskForm({
      title: task.title,
      dueDate: task.dueDate || '',
      assigneeName: task.assigneeName || '',
      milestoneId: task.milestoneId || ''
    })
    setTaskModalMode('view')
    setTaskModalOpen(true)
  }

  const openAddTaskModal = () => {
    setSelectedTask(null)
    setTaskForm({
      title: '',
      dueDate: '',
      assigneeName: allAssigneeNames[0] || '',
      milestoneId: ''
    })
    setTaskModalMode('add')
    setTaskModalOpen(true)
  }

  const closeTaskModal = () => {
    setTaskModalOpen(false)
    setSelectedTask(null)
    setTaskModalMode('view')
  }

  const switchToEditMode = () => {
    setTaskModalMode('edit')
  }

  const handleTaskFormChange = (field, value) => {
    setTaskForm(prev => ({ ...prev, [field]: value }))
  }

  const saveTask = () => {
    if (taskModalMode === 'add') {
      if (onAddTask) {
        onAddTask(taskForm)
      }
    } else if (taskModalMode === 'edit' && selectedTask) {
      if (onUpdateTask) {
        onUpdateTask(selectedTask.milestoneId, selectedTask.id, taskForm)
      }
    }
    closeTaskModal()
  }

  const handleStatusViewChange = (newStatus) => {
    if (onStatusViewChange) {
      onStatusViewChange(newStatus)
    }
    setMenuOpen(false)
  }

  const statusViewLabels = {
    active: 'Active Tasks',
    completed: 'Completed',
    backlog: 'Backlog',
    cancelled: 'Cancelled'
  }

  // Header component (shared between empty and populated states)
  const Header = () => (
    <div className="px-4 py-3 flex items-center justify-between border-b border-[#E8E8E8]">
      {/* Left side: Icon + Toggle */}
      <div className="flex items-center gap-3">
        <ClipboardList className="w-5 h-5 text-[#656565]" />
        
        {/* Pill Navigation - now on the left */}
        <div className="inline-flex bg-[#F0F0F0] rounded-lg p-0.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1 rounded-md text-12 font-medium transition-all duration-[120ms] ${
                activeTab === tab.id
                  ? 'bg-white text-[#18181A] shadow-xs'
                  : 'text-[#656565] hover:text-[#18181A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Right side: Add Task button + 3-dot menu */}
      <div className="flex items-center gap-2">
        {/* Add Task button */}
        <button
          onClick={openAddTaskModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-12 font-medium
            bg-white text-[#3D3D3F] border border-[#E8E8E8]
            hover:bg-[#FAFAFA] hover:border-[#D9D9D9]
            transition-colors duration-[120ms]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>

        {/* 3-dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md text-[#656565] hover:text-[#18181A] hover:bg-[#F0F0F0] transition-colors duration-[120ms]"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-md border border-[#E8E8E8] py-1 z-10">
              <button
                onClick={() => handleStatusViewChange('completed')}
                className={`w-full text-left px-3 py-2 text-13 hover:bg-[#FAFAFA] transition-colors ${
                  statusView === 'completed' ? 'text-[#4D5FFF] font-medium' : 'text-[#3D3D3F]'
                }`}
              >
                View Completed
              </button>
              <button
                onClick={() => handleStatusViewChange('backlog')}
                className={`w-full text-left px-3 py-2 text-13 hover:bg-[#FAFAFA] transition-colors ${
                  statusView === 'backlog' ? 'text-[#4D5FFF] font-medium' : 'text-[#3D3D3F]'
                }`}
              >
                View Backlog
              </button>
              <button
                onClick={() => handleStatusViewChange('cancelled')}
                className={`w-full text-left px-3 py-2 text-13 hover:bg-[#FAFAFA] transition-colors ${
                  statusView === 'cancelled' ? 'text-[#4D5FFF] font-medium' : 'text-[#3D3D3F]'
                }`}
              >
                View Cancelled
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Show "back to active" banner when viewing non-active statuses
  const StatusBanner = () => {
    if (statusView === 'active') return null
    
    return (
      <div className="px-4 py-2 bg-[#F9F9F9] border-b border-[#E8E8E8] flex items-center justify-between">
        <span className="text-12 text-[#656565]">
          Viewing: <span className="font-medium text-[#3D3D3F]">{statusViewLabels[statusView]}</span>
        </span>
        <button
          onClick={() => handleStatusViewChange('active')}
          className="inline-flex items-center gap-1 text-12 text-[#4D5FFF] hover:text-[#4555E3] font-medium transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Active
        </button>
      </div>
    )
  }

  // Review button component - fixed width split button with larger icon zones
  const ReviewButton = ({ task }) => {
    const [hovered, setHovered] = useState(null) // 'approve' | 'reject' | null
    
    // Determine the label based on hover state
    const getLabel = () => {
      if (hovered === 'approve') return 'Approve'
      if (hovered === 'reject') return 'Request Changes'
      return 'Review'
    }

    // Determine label and background colors based on hover state
    const getCenterClass = () => {
      if (hovered === 'approve') return 'text-[#2A531E] bg-[#E9F8E5]'
      if (hovered === 'reject') return 'text-[#D71723] bg-[#FCECE7]'
      return 'text-[#717171] bg-[#F5F5F5]'
    }
    
    return (
      <div className="inline-flex rounded-md overflow-hidden border border-[#E8E8E8] w-[200px]">
        {/* Approve button (thumbs up) - larger click area */}
        <button
          onClick={() => handleApprove(task)}
          onMouseEnter={() => setHovered('approve')}
          onMouseLeave={() => setHovered(null)}
          className={`inline-flex items-center justify-center w-[35px] py-2.5 transition-colors duration-[120ms]
            ${hovered === 'approve' 
              ? 'bg-[#E9F8E5] text-[#2A531E]' 
              : 'bg-[#F5F5F5] text-[#717171] hover:bg-[#EBEBEB]'
            }`}
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        
        {/* Center label - flexible width, text centered */}
        <div className={`flex-1 flex items-center justify-center py-2.5 text-12 font-medium border-x border-[#E8E8E8] transition-colors duration-[120ms] whitespace-nowrap ${getCenterClass()}`}>
          {getLabel()}
        </div>
        
        {/* Reject button (thumbs down) - larger click area */}
        <button
          onClick={() => handleRequestChange(task)}
          onMouseEnter={() => setHovered('reject')}
          onMouseLeave={() => setHovered(null)}
          className={`inline-flex items-center justify-center w-[35px] py-2.5 transition-colors duration-[120ms]
            ${hovered === 'reject' 
              ? 'bg-[#FCECE7] text-[#D71723]' 
              : 'bg-[#F5F5F5] text-[#717171] hover:bg-[#EBEBEB]'
            }`}
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // Help Requested badge with tooltip
  const HelpRequestedBadge = () => (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-11 font-medium bg-[#EEF0FF] text-[#1729C1] border border-[#D0DEFF] relative group cursor-default">
      Help Requested
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 
        bg-[#18181A] text-white text-11 rounded whitespace-nowrap
        opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
        We'll get back to you shortly
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#18181A]" />
      </div>
    </span>
  )

  // Help Request Modal - rendered inline to prevent focus issues
  const helpModal = helpModalTask ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeHelpModal}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-elevated w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#E8E8E8]">
          <h3 className="text-14 font-semibold text-[#18181A]">{helpModalTask.title}</h3>
          <button
            onClick={closeHelpModal}
            className="p-1 rounded-md text-[#8D8D8D] hover:text-[#18181A] hover:bg-[#F0F0F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5">
          <label className="block text-13 text-[#656565] mb-3">
            Describe what's blocking you so we can help sort this out.
          </label>
          <textarea
            value={helpMessage}
            onChange={(e) => setHelpMessage(e.target.value)}
            placeholder="What do you need help with?"
            className="w-full h-28 px-3 py-2 text-13 text-[#18181A] placeholder-[#8D8D8D]
              border border-[#E8E8E8] rounded-lg resize-none
              focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF]
              transition-colors"
            autoFocus
          />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 pt-0">
          <button
            onClick={closeHelpModal}
            className="px-4 py-2 text-13 font-medium text-[#656565] hover:text-[#18181A] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submitHelpRequest}
            disabled={!helpMessage.trim()}
            className="px-4 py-2 text-13 font-medium text-white bg-[#4D5FFF] rounded-lg
              hover:bg-[#4555E3] disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  ) : null

  // Task Modal - for viewing/editing/adding tasks
  const taskModal = taskModalOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeTaskModal}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-elevated w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8E8E8]">
          <h3 className="text-16 font-semibold text-[#18181A]">
            {taskModalMode === 'add' ? 'Add Task' : taskModalMode === 'edit' ? 'Edit Task' : 'Task Details'}
          </h3>
          <div className="flex items-center gap-2">
            {taskModalMode === 'view' && (
              <button
                onClick={switchToEditMode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-12 font-medium text-[#656565] hover:text-[#18181A] hover:bg-[#F0F0F0] rounded-md transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
            <button
              onClick={closeTaskModal}
              className="p-1.5 rounded-md text-[#8D8D8D] hover:text-[#18181A] hover:bg-[#F0F0F0] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-12 font-medium text-[#656565] mb-1.5">Title</label>
            {taskModalMode === 'view' ? (
              <p className="text-14 text-[#18181A]">{taskForm.title}</p>
            ) : (
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => handleTaskFormChange('title', e.target.value)}
                placeholder="Enter task title"
                className="w-full px-3 py-2 text-14 text-[#18181A] placeholder-[#8D8D8D]
                  border border-[#E8E8E8] rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF]
                  transition-colors"
                autoFocus={taskModalMode === 'add'}
              />
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-12 font-medium text-[#656565] mb-1.5">Due Date</label>
            {taskModalMode === 'view' ? (
              <div className="flex items-center gap-2 text-14 text-[#18181A]">
                <Calendar className="w-4 h-4 text-[#8D8D8D]" />
                {taskForm.dueDate ? new Date(taskForm.dueDate).toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                }) : 'No due date'}
              </div>
            ) : (
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => handleTaskFormChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 text-14 text-[#18181A]
                  border border-[#E8E8E8] rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF]
                  transition-colors"
              />
            )}
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-12 font-medium text-[#656565] mb-1.5">Assignee</label>
            {taskModalMode === 'view' ? (
              <div className="flex items-center gap-2 text-14 text-[#18181A]">
                <User className="w-4 h-4 text-[#8D8D8D]" />
                {taskForm.assigneeName || 'Unassigned'}
              </div>
            ) : (
              <select
                value={taskForm.assigneeName}
                onChange={(e) => handleTaskFormChange('assigneeName', e.target.value)}
                className="w-full px-3 py-2 text-14 text-[#18181A]
                  border border-[#E8E8E8] rounded-lg bg-white
                  focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF]
                  transition-colors"
              >
                <option value="">Select assignee</option>
                {allAssigneeNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Milestone */}
          <div>
            <label className="block text-12 font-medium text-[#656565] mb-1.5">Milestone (optional)</label>
            {taskModalMode === 'view' ? (
              <p className="text-14 text-[#18181A]">
                {allMilestones.find(m => m.id === taskForm.milestoneId)?.name || 'No milestone'}
              </p>
            ) : (
              <select
                value={taskForm.milestoneId}
                onChange={(e) => handleTaskFormChange('milestoneId', e.target.value)}
                className="w-full px-3 py-2 text-14 text-[#18181A]
                  border border-[#E8E8E8] rounded-lg bg-white
                  focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF]
                  transition-colors"
              >
                <option value="">No milestone</option>
                {allMilestones.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 pt-0">
          <button
            onClick={closeTaskModal}
            className="px-4 py-2 text-13 font-medium text-[#656565] hover:text-[#18181A] transition-colors"
          >
            {taskModalMode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {taskModalMode !== 'view' && (
            <button
              onClick={saveTask}
              disabled={!taskForm.title.trim()}
              className="px-4 py-2 text-13 font-medium text-white bg-[#4D5FFF] rounded-lg
                hover:bg-[#4555E3] disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              {taskModalMode === 'add' ? 'Add Task' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null

  // Task row component
  const TaskRow = ({ task, isLast }) => {
    const overdue = isTaskOverdue(task)
    const dueDateText = formatDueDate(task)
    const isActiveView = statusView === 'active'
    const isReview = isReviewTask(task)
    
    return (
      <tr
        className={`
          ${!isLast ? 'border-b border-[#F0F0F0]' : ''}
          ${overdue && isActiveView ? 'border-l-4 border-l-[#F13B3B]' : ''}
          hover:bg-[#FAFAFA] transition-colors duration-[120ms]
        `}
      >
        {/* Task Column */}
        <td className={`px-4 py-3 ${overdue && isActiveView ? 'pl-3' : ''}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => openTaskModal(task)}
              className="text-13 text-[#3D3D3F] hover:text-[#4D5FFF] hover:underline text-left transition-colors"
            >
              {task.title}
            </button>
            {/* Show Help Requested OR Blocks Milestone, not both */}
            {task.needsAttention ? (
              <HelpRequestedBadge />
            ) : task.blocksMilestone ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-11 font-medium bg-[#FCF2E7] text-[#42301C] border border-[#F5DCC3]">
                Blocks Milestone
              </span>
            ) : null}
          </div>
        </td>
        
        {/* Due Column */}
        <td className="px-4 py-3">
          <span className={`text-13 ${overdue && isActiveView ? 'text-[#F13B3B] font-medium' : 'text-[#3D3D3F]'}`}>
            {dueDateText}
          </span>
        </td>
        
        {/* Action Column */}
        <td className="px-4 py-3 overflow-visible">
          <div className="flex items-center gap-2 overflow-visible">
            {/* Only show actions for active tasks */}
            {isActiveView && (
              <>
                {/* Review tasks get thumbs up/down, others get Mark Done */}
                {isReview ? (
                  <ReviewButton task={task} />
                ) : (
                  <button
                    onClick={() => handleMarkDone(task)}
                    className="inline-flex items-center justify-center gap-2 w-[200px] py-2.5 rounded-md text-12 font-medium 
                      bg-[#F5F5F5] text-[#717171] border border-[#E8E8E8]
                      hover:bg-[#E9F8E5] hover:text-[#2A531E] hover:border-[#CDE8C2]
                      transition-colors duration-[120ms]"
                  >
                    <span>Mark Done</span>
                    <Check className="w-4 h-4" />
                  </button>
                )}

                {/* Help button - opens modal or cancels request */}
                <div className="relative group">
                  <button
                    onClick={() => handleHelpButtonClick(task)}
                    className={`p-2 rounded-md transition-colors duration-[120ms]
                      ${task.needsAttention 
                        ? 'text-[#4D5FFF] bg-[#EEF0FF] hover:bg-[#DFE9FF]' 
                        : 'text-[#BBBBBB] hover:text-[#656565] hover:bg-[#F5F5F5]'
                      }`}
                    aria-label={task.needsAttention ? 'Cancel help request' : 'Need help with this task?'}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 
                    bg-[#18181A] text-white text-11 rounded whitespace-nowrap
                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {task.needsAttention ? 'Cancel help request' : 'Need help?'}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#18181A]" />
                  </div>
                </div>
              </>
            )}
            
            {/* For non-active views, show status badge */}
            {!isActiveView && (
              <span className={`inline-flex items-center px-2 py-1 rounded text-11 font-medium ${
                statusView === 'completed' 
                  ? 'bg-[#E9F8E5] text-[#2A531E]' 
                  : statusView === 'cancelled'
                  ? 'bg-[#FCECE7] text-[#86340F]'
                  : 'bg-[#F5F5F5] text-[#717171]'
              }`}>
                {statusViewLabels[statusView]}
              </span>
            )}
          </div>
        </td>
      </tr>
    )
  }

  // Empty state
  if (displayTasks.length === 0) {
    const emptyMessages = {
      active: { title: "You're all caught up!", subtitle: "No pending tasks at the moment." },
      completed: { title: "No completed tasks", subtitle: "Completed tasks will appear here." },
      backlog: { title: "Backlog is empty", subtitle: "No tasks in backlog." },
      cancelled: { title: "No cancelled tasks", subtitle: "Cancelled tasks will appear here." }
    }

    return (
      <>
        <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
          <Header />
          <StatusBanner />
          <div className="p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-[#E9F8E5] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-5 h-5 text-[#50942A]" />
            </div>
            <p className="text-13 text-[#656565]">{emptyMessages[statusView].title}</p>
            <p className="text-12 text-[#8D8D8D] mt-1">{emptyMessages[statusView].subtitle}</p>
          </div>
        </div>
        {helpModal}
        {taskModal}
      </>
    )
  }

  // Grouped view for "All Tasks"
  if (!myTasksOnly && groupedTasks) {
    return (
      <>
        <div className="bg-white border border-[#E8E8E8] rounded-lg overflow-visible">
          <Header />
          <StatusBanner />

          {/* Table with column headers */}
          <div className="overflow-visible">
            <table className="w-full">
              {/* Table Header - visible for alignment */}
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8]">
                  <th className="text-left px-4 py-2.5 text-13 font-medium text-[#656565]">Task</th>
                  <th className="text-left px-4 py-2.5 text-13 font-medium text-[#656565] w-36">Due</th>
                  <th className="text-left px-4 py-2.5 text-13 font-medium text-[#656565] w-56">Action</th>
                </tr>
              </thead>
              
              {/* Grouped task rows */}
              <tbody>
                {assigneeNames.map((assigneeName) => (
                  <React.Fragment key={assigneeName}>
                    {/* Group Header Row */}
                    <tr className="bg-[#F5F5F5] border-b border-[#E8E8E8]">
                      <td colSpan={3} className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#8D8D8D]" />
                          <span className="text-12 font-medium text-[#3D3D3F]">{assigneeName}</span>
                          <span className="text-11 text-[#8D8D8D]">({groupedTasks[assigneeName].length} tasks)</span>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Task Rows for this group */}
                    {groupedTasks[assigneeName].map((task, taskIndex) => (
                      <TaskRow 
                        key={task.id} 
                        task={task} 
                        isLast={taskIndex === groupedTasks[assigneeName].length - 1}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Help Modal */}
        {helpModal}
        {taskModal}
      </>
    )
  }

  // Regular view for "My Tasks"
  return (
    <>
      <div className="bg-white border border-[#E8E8E8] rounded-lg overflow-visible">
        <Header />
        <StatusBanner />

        {/* Table */}
        <div className="overflow-visible">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8]">
                <th className="text-left px-4 py-2.5 text-13 font-medium text-[#656565]">Task</th>
                <th className="text-left px-4 py-2.5 text-13 font-medium text-[#656565] w-36">Due</th>
                <th className="text-left px-4 py-2.5 text-13 font-medium text-[#656565] w-56">Action</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {displayTasks.map((task, index) => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  isLast={index === displayTasks.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Help Modal */}
      {helpModal}
        {taskModal}
    </>
  )
}

export default ClientTasksSection
