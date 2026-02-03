import React, { useState, useRef, useEffect } from 'react'
import { CheckCircle2, ClipboardList, Check, Plus, MoreHorizontal, HelpCircle, ArrowLeft, ThumbsUp, ThumbsDown, X, User, Calendar, Pencil, Target, FileText, ChevronDown } from 'lucide-react'
import { getTasksForView, isTaskOverdue, formatDueDate, groupTasksByAssignee } from '../data/clientPortalData'

// Searchable Select Component
const SearchableSelect = ({ value, options, onChange, placeholder = 'Search...', displayValue }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    const optionText = typeof option === 'string' ? option : option.name
    return optionText.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleSelect = (option) => {
    const optionValue = typeof option === 'string' ? option : option.id
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const getDisplayText = () => {
    if (displayValue) return displayValue
    if (!value) return ''
    const selected = options.find(opt => 
      typeof opt === 'string' ? opt === value : opt.id === value
    )
    return selected ? (typeof selected === 'string' ? selected : selected.name) : ''
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : getDisplayText()}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={isOpen ? placeholder : (getDisplayText() || placeholder)}
          className="w-full px-3 py-2 pr-8 text-14 text-[rgba(43,40,39,0.9)] placeholder-[#BFBCBA]
            border border-[#E8E8E8] rounded-lg bg-white
            focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF]
            transition-colors"
        />
        <button
          type="button"
          onClick={() => { setIsOpen(!isOpen); if (!isOpen) inputRef.current?.focus(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#736F6D] hover:text-[#18181A]"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E8E8E8] rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-14 text-[#736F6D]">No results found</div>
          ) : (
            filteredOptions.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.id
              const optionText = typeof option === 'string' ? option : option.name
              const isSelected = optionValue === value
              
              return (
                <button
                  key={optionValue}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-3 py-2 text-left text-14 transition-colors
                    ${isSelected 
                      ? 'bg-[#EEF0FF] text-[#4D5FFF]' 
                      : 'text-[rgba(43,40,39,0.9)] hover:bg-[#F5F5F5]'
                    }`}
                >
                  {optionText}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

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
    milestoneId: '',
    description: ''
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
      milestoneId: task.milestoneId || '',
      description: task.description || ''
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
      milestoneId: '',
      description: ''
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
      <div 
        className="inline-flex rounded-md overflow-hidden border border-[#E8E8E8] w-[200px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Approve button (thumbs up) - larger click area */}
        <button
          onClick={(e) => { e.stopPropagation(); handleApprove(task); }}
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
          onClick={(e) => { e.stopPropagation(); handleRequestChange(task); }}
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

  // Check if the selected task is a review task
  const selectedTaskIsReview = selectedTask ? isReviewTask(selectedTask) : false

  // Task Modal - for viewing/editing/adding tasks
  // Show placeholder modal for review tasks, full modal for regular tasks
  const taskModal = taskModalOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeTaskModal}
      />
      
      {/* Modal - Figma styling */}
      <div 
        className="relative bg-white rounded-[16px] w-full max-w-[480px] mx-4 flex flex-col max-h-[90vh]"
        style={{ 
          boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.08), 0px 0px 2px 0px rgba(0, 0, 0, 0.16)' 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
          <span className="text-14 font-medium text-[#736F6D]">
            {taskModalMode === 'add' ? 'Create Task' : selectedTaskIsReview ? 'Review Item' : 'Task Details'}
          </span>
          <button
            onClick={closeTaskModal}
            className="p-1.5 rounded-md text-[#736F6D] hover:text-[#18181A] hover:bg-[#F0F0F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Show placeholder for review tasks in view mode */}
        {selectedTaskIsReview && taskModalMode === 'view' ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
              <ThumbsUp className="w-8 h-8 text-[#BFBCBA]" />
            </div>
            <h3 className="text-18 font-semibold text-[#18181A] mb-2">{taskForm.title}</h3>
            <p className="text-14 text-[#736F6D] max-w-xs">
              Review feedback view coming soon. Use the action buttons in the task list to approve or request changes.
            </p>
            <button
              onClick={closeTaskModal}
              className="mt-6 px-5 py-2.5 text-13 font-medium text-white bg-[#4D5FFF] rounded-lg
                hover:bg-[#4555E3] transition-colors"
            >
              Got it
            </button>
          </div>
        ) : (
        <>
        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Task Title - Large and prominent */}
          <div className="mb-6">
            {taskModalMode === 'view' ? (
              <h2 className="text-24 font-semibold text-[#18181A] leading-tight">
                {taskForm.title}
              </h2>
            ) : (
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => handleTaskFormChange('title', e.target.value)}
                placeholder="Enter task title"
                className="w-full text-24 font-semibold text-[#18181A] placeholder-[#BFBCBA]
                  px-3 py-2 -mx-3 rounded-lg
                  border border-[#E8E8E8] bg-[#FAFAFA]
                  focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF] focus:bg-white
                  transition-colors"
                autoFocus
              />
            )}
          </div>

          {/* Fields Grid */}
          <div className="space-y-4">
            {/* Due Date Field */}
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-2 w-28 flex-shrink-0 pt-2">
                <Calendar className="w-4 h-4 text-[#736F6D]" />
                <span className="text-14 text-[#736F6D]">Due Date</span>
              </div>
              <div className="flex-1">
                {taskModalMode === 'view' ? (
                  <div className="px-3 py-2 rounded-lg bg-white text-14 text-[rgba(43,40,39,0.9)]">
                    {taskForm.dueDate ? new Date(taskForm.dueDate).toLocaleDateString('en-US', { 
                      weekday: 'short', day: 'numeric', month: 'short'
                    }) : 'No due date'}
                  </div>
                ) : (
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => handleTaskFormChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 text-14 text-[rgba(43,40,39,0.9)]
                      border border-[#E8E8E8] rounded-lg bg-white
                      focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF]
                      transition-colors"
                  />
                )}
              </div>
            </div>

            {/* Assignee Field */}
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-2 w-28 flex-shrink-0 pt-2">
                <User className="w-4 h-4 text-[#736F6D]" />
                <span className="text-14 text-[#736F6D]">Assign</span>
              </div>
              <div className="flex-1">
                {taskModalMode === 'view' ? (
                  <div className="flex items-center gap-2">
                    {taskForm.assigneeName ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E8E8] text-14 text-[rgba(43,40,39,0.9)]">
                        <span className="w-2 h-2 rounded-full bg-[#4D5FFF]"></span>
                        {taskForm.assigneeName}
                      </span>
                    ) : (
                      <span className="text-14 text-[#BFBCBA]">Unassigned</span>
                    )}
                  </div>
                ) : (
                  <SearchableSelect
                    value={taskForm.assigneeName}
                    options={allAssigneeNames}
                    onChange={(val) => handleTaskFormChange('assigneeName', val)}
                    placeholder="Search assignee..."
                  />
                )}
              </div>
            </div>

            {/* Milestone Field */}
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-2 w-28 flex-shrink-0 pt-2">
                <Target className="w-4 h-4 text-[#736F6D]" />
                <span className="text-14 text-[#736F6D]">Milestone</span>
              </div>
              <div className="flex-1">
                {taskModalMode === 'view' ? (
                  <div className="px-3 py-2 rounded-lg bg-white text-14 text-[rgba(43,40,39,0.9)]">
                    {allMilestones.find(m => m.id === taskForm.milestoneId)?.name || 
                      <span className="text-[#BFBCBA]">No milestone</span>
                    }
                  </div>
                ) : (
                  <SearchableSelect
                    value={taskForm.milestoneId}
                    options={allMilestones}
                    onChange={(val) => handleTaskFormChange('milestoneId', val)}
                    placeholder="Search milestone..."
                  />
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-2 w-28 flex-shrink-0 pt-2">
                <FileText className="w-4 h-4 text-[#736F6D]" />
                <span className="text-14 text-[#736F6D]">Description</span>
              </div>
              <div className="flex-1">
                {taskModalMode === 'view' ? (
                  <div className="px-3 py-2 rounded-lg bg-white text-14 text-[rgba(43,40,39,0.9)] leading-relaxed whitespace-pre-wrap">
                    {taskForm.description || <span className="text-[#BFBCBA]">No description</span>}
                  </div>
                ) : (
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => handleTaskFormChange('description', e.target.value)}
                    placeholder="Add a description or subtasks (use - [ ] for checkboxes)"
                    rows={4}
                    className="w-full px-3 py-2 text-14 text-[rgba(43,40,39,0.9)] placeholder-[#BFBCBA]
                      border border-[#E8E8E8] rounded-lg bg-white resize-none leading-relaxed
                      focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF]
                      transition-colors"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer - Action Buttons */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E8E8E8]">
          {taskModalMode === 'view' ? (
            <>
              {/* Left side - Edit button */}
              <button
                onClick={switchToEditMode}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-13 font-medium text-[#656565] 
                  bg-white border border-[#E8E8E8] rounded-lg
                  hover:bg-[#F5F5F5] hover:text-[#18181A] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              
              {/* Right side - Action buttons */}
              <div className="flex items-center gap-2">
                {/* Help button */}
                {selectedTask && (
                  <button
                    onClick={() => {
                      closeTaskModal()
                      handleHelpButtonClick(selectedTask)
                    }}
                    className={`p-2.5 rounded-lg transition-colors
                      ${selectedTask.needsAttention 
                        ? 'text-[#4D5FFF] bg-[#EEF0FF] hover:bg-[#DFE9FF]' 
                        : 'text-[#736F6D] bg-white border border-[#E8E8E8] hover:bg-[#F5F5F5]'
                      }`}
                    title={selectedTask.needsAttention ? 'Cancel help request' : 'Need help?'}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                )}
                
                {/* Mark Done / Review button */}
                {selectedTask && selectedTask.status === 'active' && (
                  selectedTaskIsReview ? (
                    <div className="inline-flex rounded-lg overflow-hidden border border-[#E8E8E8]">
                      <button
                        onClick={() => {
                          handleApprove(selectedTask)
                          closeTaskModal()
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-13 font-medium
                          bg-[#E9F8E5] text-[#2A531E] hover:bg-[#D4F0CE] transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleRequestChange(selectedTask)
                          closeTaskModal()
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-13 font-medium
                          bg-[#FCECE7] text-[#D71723] border-l border-[#E8E8E8] hover:bg-[#F9DCD4] transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Revise
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleMarkDone(selectedTask)
                        closeTaskModal()
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-13 font-medium 
                        bg-[#E9F8E5] text-[#2A531E] border border-[#CDE8C2]
                        hover:bg-[#D4F0CE] transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Mark Done
                    </button>
                  )
                )}
              </div>
            </>
          ) : (
            <>
              {/* Edit/Add mode buttons */}
              <div></div>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeTaskModal}
                  className="px-4 py-2 text-13 font-medium text-[#656565] hover:text-[#18181A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTask}
                  disabled={!taskForm.title.trim()}
                  className="px-5 py-2.5 text-13 font-medium text-white bg-[#4D5FFF] rounded-lg
                    hover:bg-[#4555E3] disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors"
                >
                  {taskModalMode === 'add' ? 'Add Task' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
        </>
        )}
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
        onClick={() => openTaskModal(task)}
        className={`
          ${!isLast ? 'border-b border-[#F0F0F0]' : ''}
          ${overdue && isActiveView ? 'border-l-4 border-l-[#F13B3B]' : ''}
          hover:bg-[#FAFAFA] transition-colors duration-[120ms] cursor-pointer
        `}
      >
        {/* Task Column */}
        <td className={`px-4 py-3 ${overdue && isActiveView ? 'pl-3' : ''}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-13 text-[#3D3D3F]">
              {task.title}
            </span>
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
                    onClick={(e) => { e.stopPropagation(); handleMarkDone(task); }}
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
                    onClick={(e) => { e.stopPropagation(); handleHelpButtonClick(task); }}
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
