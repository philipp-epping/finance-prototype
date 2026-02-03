// Mock data for the Client Portal
// Represents a realistic agency-client project scenario

// Task status values: 'active', 'completed', 'backlog', 'cancelled'

export const clientProject = {
  id: 'proj-1',
  name: 'Website Redesign',
  client: 'Acme Corp',
  startDate: '2026-01-15',
  roadmap: [
    {
      id: 'ms-1',
      name: 'Discovery & Strategy',
      status: 'completed',
      tasks: [
        { id: 't-1', title: 'Fill out brand questionnaire', assignee: 'client', assigneeName: 'Sarah Chen', status: 'completed', dueDate: '2026-01-20', blocksMilestone: false, needsAttention: false },
        { id: 't-2', title: 'Provide access to existing analytics', assignee: 'client', assigneeName: 'Mike Johnson', status: 'completed', dueDate: '2026-01-22', blocksMilestone: false, needsAttention: false },
        { id: 't-3', title: 'Conduct stakeholder interviews', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'completed', dueDate: '2026-01-25', blocksMilestone: false, needsAttention: false },
        { id: 't-4', title: 'Review and approve strategy document', assignee: 'client', assigneeName: 'Sarah Chen', status: 'completed', dueDate: '2026-01-28', blocksMilestone: false, needsAttention: false },
      ]
    },
    {
      id: 'ms-2',
      name: 'Design Phase',
      status: 'in_progress',
      tasks: [
        { id: 't-5', title: 'Create wireframes for key pages', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'completed', dueDate: '2026-01-30', blocksMilestone: false, needsAttention: false },
        { id: 't-6', title: 'Review wireframes and provide feedback', assignee: 'client', assigneeName: 'Sarah Chen', status: 'completed', dueDate: '2026-02-01', blocksMilestone: false, needsAttention: false },
        { id: 't-7', title: 'Design homepage mockup', assignee: 'agency', assigneeName: 'Jordan Lee', status: 'completed', dueDate: '2026-02-03', blocksMilestone: false, needsAttention: false },
        { id: 't-8', title: 'Design inner page templates', assignee: 'agency', assigneeName: 'Jordan Lee', status: 'active', dueDate: '2026-02-05', blocksMilestone: false, needsAttention: false },
        { id: 't-9', title: 'Review and approve final designs', assignee: 'client', assigneeName: 'Sarah Chen', status: 'active', dueDate: '2026-01-31', blocksMilestone: true, needsAttention: false },
        { id: 't-10', title: 'Provide high-res logo and brand assets', assignee: 'client', assigneeName: 'Mike Johnson', status: 'active', dueDate: '2026-02-07', blocksMilestone: true, needsAttention: false },
      ]
    },
    {
      id: 'ms-3',
      name: 'Development',
      status: 'upcoming',
      tasks: [
        { id: 't-11', title: 'Set up development environment', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'active', dueDate: '2026-02-10', blocksMilestone: false, needsAttention: false },
        { id: 't-12', title: 'Build responsive frontend', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'active', dueDate: '2026-02-20', blocksMilestone: false, needsAttention: false },
        { id: 't-13', title: 'Integrate CMS', assignee: 'agency', assigneeName: 'Jordan Lee', status: 'active', dueDate: '2026-02-25', blocksMilestone: false, needsAttention: false },
        { id: 't-14', title: 'Provide content for all pages', assignee: 'client', assigneeName: 'Emily Watson', status: 'backlog', dueDate: '2026-02-28', blocksMilestone: true, needsAttention: false },
        { id: 't-15', title: 'Review staging site', assignee: 'client', assigneeName: 'Sarah Chen', status: 'active', dueDate: '2026-03-05', blocksMilestone: false, needsAttention: false },
      ]
    },
    {
      id: 'ms-4',
      name: 'Launch & Handoff',
      status: 'upcoming',
      tasks: [
        { id: 't-16', title: 'Final QA and bug fixes', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'active', dueDate: '2026-03-10', blocksMilestone: false, needsAttention: false },
        { id: 't-17', title: 'Final review and sign-off', assignee: 'client', assigneeName: 'Sarah Chen', status: 'active', dueDate: '2026-03-12', blocksMilestone: true, needsAttention: false },
        { id: 't-18', title: 'Deploy to production', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'active', dueDate: '2026-03-15', blocksMilestone: false, needsAttention: false },
        { id: 't-19', title: 'Handoff documentation and training', assignee: 'agency', assigneeName: 'Jordan Lee', status: 'active', dueDate: '2026-03-18', blocksMilestone: false, needsAttention: false },
      ]
    }
  ]
}

// Get unique assignee names for grouping
export const getAssigneeNames = (tasks) => {
  const names = new Set()
  tasks.forEach(task => {
    if (task.assigneeName) names.add(task.assigneeName)
  })
  return Array.from(names).sort()
}

// Group tasks by assignee name
export const groupTasksByAssignee = (tasks) => {
  const grouped = {}
  tasks.forEach(task => {
    const name = task.assigneeName || 'Unassigned'
    if (!grouped[name]) {
      grouped[name] = []
    }
    grouped[name].push(task)
  })
  return grouped
}

// Helper to check if task is completed (for backward compatibility)
export const isTaskCompleted = (task) => task.status === 'completed'

// Helper function to get all pending client tasks (active status only)
export const getPendingClientTasks = (project) => {
  const pendingTasks = []
  
  project.roadmap.forEach(milestone => {
    milestone.tasks
      .filter(task => task.assignee === 'client' && task.status === 'active')
      .forEach(task => {
        pendingTasks.push({
          ...task,
          milestoneName: milestone.name,
          milestoneId: milestone.id
        })
      })
  })
  
  return pendingTasks
}

// Helper function to calculate milestone progress
export const getMilestoneProgress = (milestone) => {
  const total = milestone.tasks.length
  const completed = milestone.tasks.filter(t => t.status === 'completed').length
  return { completed, total }
}

// Helper function to get roadmap summary
export const getRoadmapSummary = (project) => {
  const total = project.roadmap.length
  const completed = project.roadmap.filter(m => m.status === 'completed').length
  const inProgress = project.roadmap.filter(m => m.status === 'in_progress').length
  
  return { total, completed, inProgress }
}

// Helper function to check if a task is overdue
export const isTaskOverdue = (task) => {
  if (task.status === 'completed' || !task.dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)
  return dueDate < today
}

// Helper function to format due date for display
export const formatDueDate = (task) => {
  if (!task.dueDate) return ''
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)
  
  const diffTime = dueDate - today
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays)
    return `${overdueDays} day${overdueDays !== 1 ? 's' : ''} overdue`
  } else if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Tomorrow'
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`
  } else {
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

// Helper function to get all client tasks (all statuses)
export const getAllClientTasks = (project) => {
  const allTasks = []
  
  project.roadmap.forEach(milestone => {
    milestone.tasks
      .filter(task => task.assignee === 'client')
      .forEach(task => {
        allTasks.push({
          ...task,
          milestoneName: milestone.name,
          milestoneId: milestone.id,
          milestoneStatus: milestone.status
        })
      })
  })
  
  return allTasks
}

// Helper function to get tasks by status with optional assignee filter
// statusFilter: 'active', 'completed', 'backlog', 'cancelled'
// assigneeFilter: 'client', 'agency', or null for all
export const getTasksByStatus = (project, statusFilter, assigneeFilter = null) => {
  const tasks = []
  
  project.roadmap.forEach(milestone => {
    milestone.tasks
      .filter(task => {
        const matchesStatus = task.status === statusFilter
        const matchesAssignee = !assigneeFilter || task.assignee === assigneeFilter
        return matchesStatus && matchesAssignee
      })
      .forEach(task => {
        tasks.push({
          ...task,
          milestoneName: milestone.name,
          milestoneId: milestone.id,
          milestoneStatus: milestone.status
        })
      })
  })
  
  return tasks
}

// Helper function to get all tasks for a specific view
// Combines status filter with "my tasks" (client only) or "all tasks"
export const getTasksForView = (project, statusFilter, myTasksOnly = true) => {
  const assigneeFilter = myTasksOnly ? 'client' : null
  return getTasksByStatus(project, statusFilter, assigneeFilter)
}
