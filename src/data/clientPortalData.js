// Mock data for the Client Portal
// Represents a realistic agency-client project scenario

// Task status values: 'active', 'completed', 'backlog', 'cancelled'

// Meetings data for the client portal
export const clientMeetings = {
  // Next upcoming meeting
  upcoming: {
    id: 'mtg-upcoming',
    title: "Robert: [DXR] Clemens und Robert",
    date: "2026-02-04T14:00:00",
    participants: [
      { id: 'p-1', name: 'Clemens', avatar: null },
      { id: 'p-2', name: 'Robert', avatar: null }
    ],
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    hasRecording: false
  },
  // Past meetings list
  past: [
    {
      id: 'mtg-1',
      title: "David Bock x Denis",
      date: "2026-06-25T12:00:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: true,
      recordingUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      recordingThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
      notes: {
        content: '',
        quickActions: [
          { id: 'qa-1', label: 'Meeting Agenda', icon: 'file-text' },
          { id: 'qa-2', label: 'OB Call', icon: 'phone' }
        ],
        connected: true
      },
      summary: null,
      transcript: [
        { id: 'tr-1', speaker: 'Louie', timestamp: '0:04', seconds: 4, text: "Hi Tim, I really appreciate you making time for today's call. Before we get into details, how have things been progressing on your side since our last check-in?" },
        { id: 'tr-2', speaker: 'Tim', timestamp: '0:07', seconds: 7, text: "Hi! Thanks for asking. Overall things have been running smoothly, and our team has already started testing the new dashboard internally to see how it fits into our daily workflow." },
        { id: 'tr-3', speaker: 'Louie', timestamp: '0:10', seconds: 10, text: "That's great to hear. I'm curious — have you or your team noticed any challenges or potential blockers during this initial testing phase?" },
        { id: 'tr-4', speaker: 'Tim', timestamp: '0:14', seconds: 14, text: "A couple of our colleagues mentioned that the loading time feels a bit slow whenever they try to pull larger reports, especially those with several months of data." },
        { id: 'tr-5', speaker: 'Louie', timestamp: '0:21', seconds: 21, text: "Understood, thanks for pointing that out. I'll raise this with our developers and make sure performance improvements are prioritized in the next sprint. Aside from speed, is there anything else you'd like us to focus on?" },
        { id: 'tr-6', speaker: 'Tim', timestamp: '13:33', seconds: 813, text: "Sounds perfect, thank you. That will help us keep everyone on the same page." }
      ]
    },
    {
      id: 'mtg-2',
      title: "David Bock x Denis",
      date: "2026-06-18T12:00:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: true,
      recordingUrl: null,
      notes: {
        content: 'Discussed quarterly goals and upcoming milestones.',
        quickActions: [],
        connected: false
      },
      summary: 'Reviewed Q2 progress. Client satisfied with current trajectory. Next steps: finalize design mockups by end of month.',
      transcript: []
    },
    {
      id: 'mtg-3',
      title: "David Bock x Denis",
      date: "2026-06-11T12:00:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: false,
      notes: { content: '', quickActions: [], connected: false },
      summary: null,
      transcript: []
    },
    {
      id: 'mtg-4',
      title: "David Bock x Denis",
      date: "2026-06-04T14:30:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: true,
      recordingUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      notes: { content: '', quickActions: [], connected: false },
      summary: 'Kickoff meeting for the website redesign project. Established timeline and key deliverables.',
      transcript: []
    },
    {
      id: 'mtg-5',
      title: "David Bock x Denis",
      date: "2026-05-28T12:00:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: false,
      notes: { content: '', quickActions: [], connected: false },
      summary: null,
      transcript: []
    },
    {
      id: 'mtg-6',
      title: "David Bock x Denis",
      date: "2026-05-21T12:00:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: false,
      notes: { content: '', quickActions: [], connected: false },
      summary: null,
      transcript: []
    },
    {
      id: 'mtg-7',
      title: "David Bock x Denis",
      date: "2026-05-14T12:00:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: false,
      notes: { content: '', quickActions: [], connected: false },
      summary: null,
      transcript: []
    },
    {
      id: 'mtg-8',
      title: "David Bock x Denis",
      date: "2026-05-07T14:30:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: false,
      notes: { content: '', quickActions: [], connected: false },
      summary: null,
      transcript: []
    },
    {
      id: 'mtg-9',
      title: "David Bock x Denis",
      date: "2026-04-30T12:00:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: false,
      notes: { content: '', quickActions: [], connected: false },
      summary: null,
      transcript: []
    },
    {
      id: 'mtg-10',
      title: "David Bock x Denis",
      date: "2026-04-23T12:00:00",
      participants: [{ id: 'p-3', name: 'Denis', avatar: null }],
      hasRecording: false,
      notes: { content: '', quickActions: [], connected: false },
      summary: null,
      transcript: []
    }
  ]
}

// Helper function to format meeting time relative to now
export const formatMeetingTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date - now
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.round(diffDays / 7)
  
  if (diffMs < 0) {
    // Past meeting
    return null
  } else if (diffHours < 24) {
    return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`
  } else if (diffDays <= 10) {
    return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
  } else {
    return `in ${diffWeeks} week${diffWeeks !== 1 ? 's' : ''}`
  }
}

// Helper function to format meeting date for display
export const formatMeetingDate = (dateString) => {
  const date = new Date(dateString)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    day: date.getDate().toString().padStart(2, '0'),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }
}

export const clientProject = {
  id: 'proj-1',
  name: 'Website Redesign',
  client: 'Acme Corp',
  startDate: '2026-01-15',
  // Standalone tasks - not attached to any milestone
  standaloneTasks: [
    { 
      id: 'st-1', 
      title: 'Update company bio on website', 
      assignee: 'client', 
      assigneeName: 'Sarah Chen',
      status: 'active', 
      dueDate: '2026-02-10',
      needsAttention: false,
      description: 'Please review and update the company bio text on the About page.'
    },
    { 
      id: 'st-2', 
      title: 'Sign updated contract addendum', 
      assignee: 'client', 
      assigneeName: 'Mike Johnson',
      status: 'active', 
      dueDate: '2026-02-15',
      needsAttention: false,
      description: 'Please review and sign the contract addendum for the additional landing pages.'
    },
    { 
      id: 'st-3', 
      title: 'Provide testimonials for homepage', 
      assignee: 'client', 
      assigneeName: 'Emily Watson',
      status: 'completed', 
      dueDate: '2026-01-25',
      needsAttention: false,
      description: 'We need 3-5 customer testimonials with photos for the homepage.'
    },
  ],
  roadmap: [
    {
      id: 'ms-1',
      name: 'Discovery & Strategy',
      status: 'completed',
      estimatedDuration: '2 weeks',
      tasks: [
        { id: 't-1', title: 'Fill out brand questionnaire', assignee: 'client', assigneeName: 'Sarah Chen', status: 'completed', dueDate: '2026-01-20', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-2', title: 'Provide access to existing analytics', assignee: 'client', assigneeName: 'Mike Johnson', status: 'completed', dueDate: '2026-01-22', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-3', title: 'Conduct stakeholder interviews', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'completed', dueDate: '2026-01-25', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-4', title: 'Review and approve strategy document', assignee: 'client', assigneeName: 'Sarah Chen', status: 'completed', dueDate: '2026-01-28', blocksMilestone: false, needsAttention: false, description: '' },
      ]
    },
    {
      id: 'ms-2',
      name: 'Design Phase',
      status: 'in_progress',
      estimatedDuration: '3 weeks',
      tasks: [
        { id: 't-5', title: 'Create wireframes for key pages', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'completed', dueDate: '2026-01-30', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-6', title: 'Review wireframes and provide feedback', assignee: 'client', assigneeName: 'Sarah Chen', status: 'completed', dueDate: '2026-02-01', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-7', title: 'Design homepage mockup', assignee: 'agency', assigneeName: 'Jordan Lee', status: 'completed', dueDate: '2026-02-03', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-8', title: 'Design inner page templates', assignee: 'agency', assigneeName: 'Jordan Lee', status: 'completed', dueDate: '2026-02-05', needsAttention: false, description: '' },
        { 
          id: 't-9', 
          title: 'Review and approve final designs', 
          assignee: 'client', 
          assigneeName: 'Sarah Chen', 
          status: 'active', 
          dueDate: '2026-01-31', 
          needsAttention: false, 
          description: 'Please review the homepage and inner page designs.\n\n- [ ] Check color consistency\n- [ ] Verify mobile responsiveness\n- [ ] Confirm CTA placements',
          assets: [
            { id: 'a-1', type: 'image', url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop', name: 'Homepage Design.png' },
            { id: 'a-2', type: 'image', url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&h=800&fit=crop', name: 'About Page Design.png' }
          ],
          comments: [
            {
              id: 'c-1',
              author: 'Jordan Lee',
              text: 'Here is the updated homepage design with the new hero section. Let me know your thoughts on the CTA placement.',
              createdAt: '2026-01-30T14:30:00Z',
              resolved: false,
              anchor: { type: 'image', assetId: 'a-1', x: 50, y: 25 }
            },
            {
              id: 'c-2',
              author: 'Sarah Chen',
              text: 'Love the overall direction! Can we make the primary button slightly larger?',
              createdAt: '2026-01-30T15:45:00Z',
              resolved: true,
              anchor: { type: 'image', assetId: 'a-1', x: 52, y: 68 }
            },
            {
              id: 'c-3',
              author: 'Jordan Lee',
              text: 'Updated the button size as requested. Also refined the spacing around the testimonials.',
              createdAt: '2026-01-31T09:15:00Z',
              resolved: false,
              anchor: { type: 'image', assetId: 'a-1', x: 52, y: 68 }
            }
          ]
        },
        { id: 't-10', title: 'Provide high-res logo and brand assets', assignee: 'client', assigneeName: 'Mike Johnson', status: 'active', dueDate: '2026-02-07', nonBlocking: true, needsAttention: false, description: 'We need the following assets:\n\n- [ ] Logo in SVG format\n- [ ] Brand color codes\n- [ ] Typography guidelines' },
      ]
    },
    {
      id: 'ms-3',
      name: 'Development',
      status: 'upcoming',
      estimatedDuration: '4 weeks',
      tasks: [
        { id: 't-11', title: 'Set up development environment', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'active', dueDate: '2026-02-10', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-12', title: 'Build responsive frontend', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'active', dueDate: '2026-02-20', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-13', title: 'Integrate CMS', assignee: 'agency', assigneeName: 'Jordan Lee', status: 'active', dueDate: '2026-02-25', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-14', title: 'Provide content for all pages', assignee: 'client', assigneeName: 'Emily Watson', status: 'backlog', dueDate: '2026-02-28', nonBlocking: true, needsAttention: false, description: 'Content needed for the following pages:\n\n- [ ] Homepage hero text\n- [ ] About Us page\n- [ ] Services descriptions\n- [ ] Contact information' },
        { 
          id: 't-15', 
          title: 'Review Image Movie', 
          assignee: 'client', 
          assigneeName: 'Sarah Chen', 
          status: 'active', 
          dueDate: '2026-03-05', 
          blocksMilestone: false, 
          needsAttention: false, 
          description: 'Please review the staging site walkthrough video and provide feedback.',
          assets: [
            { id: 'a-3', type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', name: 'Staging Site Walkthrough.mp4' }
          ],
          comments: [],
          reactions: []
        },
        { 
          id: 't-20', 
          title: 'Review Social Media Reel', 
          assignee: 'client', 
          assigneeName: 'Sarah Chen', 
          status: 'active', 
          dueDate: '2026-03-06', 
          blocksMilestone: false, 
          needsAttention: false, 
          description: 'Please review this Instagram reel for our social media campaign.',
          assets: [
            { id: 'a-5', type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', name: 'Instagram Reel.mp4', aspectRatio: '9:16' }
          ],
          comments: [],
          reactions: []
        },
        { 
          id: 't-21', 
          title: 'Review Product Demo', 
          assignee: 'client', 
          assigneeName: 'Sarah Chen', 
          status: 'active', 
          dueDate: '2026-03-07', 
          blocksMilestone: false, 
          needsAttention: false, 
          description: 'Please review the product demo video for the landing page.',
          assets: [
            { id: 'a-6', type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', name: 'Product Demo.mp4' }
          ],
          comments: [],
          reactions: []
        },
        { 
          id: 't-22', 
          title: 'Review Story Video', 
          assignee: 'client', 
          assigneeName: 'Sarah Chen', 
          status: 'active', 
          dueDate: '2026-03-08', 
          blocksMilestone: false, 
          needsAttention: false, 
          description: 'Please review this story format video for TikTok.',
          assets: [
            { id: 'a-7', type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', name: 'TikTok Story.mp4', aspectRatio: '9:16' }
          ],
          comments: [],
          reactions: []
        },
      ]
    },
    {
      id: 'ms-4',
      name: 'Launch & Handoff',
      status: 'upcoming',
      estimatedDuration: '1 week',
      tasks: [
        { id: 't-16', title: 'Final QA and bug fixes', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'active', dueDate: '2026-03-10', blocksMilestone: false, needsAttention: false, description: '' },
        { 
          id: 't-17', 
          title: 'Final review and sign-off', 
          assignee: 'client', 
          assigneeName: 'Sarah Chen', 
          status: 'active', 
          dueDate: '2026-03-12', 
          needsAttention: false, 
          description: 'Please review the final documentation and sign off on the project.',
          assets: [
            { id: 'a-4', type: 'pdf', url: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf', name: 'Project Documentation.pdf' }
          ],
          comments: [
            {
              id: 'c-6',
              author: 'Jordan Lee',
              text: 'Here is the final project documentation for your review.',
              createdAt: '2026-03-10T09:00:00Z',
              resolved: false,
              anchor: { type: 'pdf', assetId: 'a-4', page: 1, x: 50, y: 30 }
            }
          ]
        },
        { id: 't-18', title: 'Deploy to production', assignee: 'agency', assigneeName: 'Alex Rivera', status: 'active', dueDate: '2026-03-15', blocksMilestone: false, needsAttention: false, description: '' },
        { id: 't-19', title: 'Handoff documentation and training', assignee: 'agency', assigneeName: 'Jordan Lee', status: 'active', dueDate: '2026-03-18', blocksMilestone: false, needsAttention: false, description: '' },
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
// Includes both milestone tasks and standalone tasks
export const getPendingClientTasks = (project) => {
  const pendingTasks = []
  
  // Milestone tasks
  project.roadmap.forEach(milestone => {
    milestone.tasks
      .filter(task => task.assignee === 'client' && task.status === 'active')
      .forEach(task => {
        // Compute if this task is currently blocking the milestone
        const blocksMilestone = isTaskBlockingMilestone(milestone, task.id)
        pendingTasks.push({
          ...task,
          blocksMilestone,
          milestoneName: milestone.name,
          milestoneId: milestone.id
        })
      })
  })
  
  // Standalone tasks (never block milestones)
  ;(project.standaloneTasks || [])
    .filter(task => task.assignee === 'client' && task.status === 'active')
    .forEach(task => {
      pendingTasks.push({
        ...task,
        blocksMilestone: false,
        isStandalone: true,
        milestoneName: null,
        milestoneId: null
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
        // Compute if this task is currently blocking the milestone
        const blocksMilestone = isTaskBlockingMilestone(milestone, task.id)
        allTasks.push({
          ...task,
          blocksMilestone,
          milestoneName: milestone.name,
          milestoneId: milestone.id,
          milestoneStatus: milestone.status
        })
      })
  })
  
  return allTasks
}

// Helper function to check if a task is blocking its milestone
// A task blocks a milestone if it's the first uncompleted non-blocking task in the sequence
export const isTaskBlockingMilestone = (milestone, taskId) => {
  // Find the first uncompleted task that is NOT marked as nonBlocking
  const firstBlockingTask = milestone.tasks.find(
    task => task.status !== 'completed' && !task.nonBlocking
  )
  // This task blocks if it's the first blocking uncompleted task
  return firstBlockingTask && firstBlockingTask.id === taskId
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
        // Compute if this task is currently blocking the milestone
        const blocksMilestone = isTaskBlockingMilestone(milestone, task.id)
        tasks.push({
          ...task,
          blocksMilestone,
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
// Includes both milestone tasks and standalone tasks
export const getTasksForView = (project, statusFilter, myTasksOnly = true) => {
  const assigneeFilter = myTasksOnly ? 'client' : null
  
  // Get milestone tasks
  const milestoneTasks = getTasksByStatus(project, statusFilter, assigneeFilter)
  
  // Get standalone tasks
  const standaloneTasks = (project.standaloneTasks || [])
    .filter(task => task.status === statusFilter)
    .filter(task => !assigneeFilter || task.assignee === assigneeFilter)
    .map(task => ({ 
      ...task, 
      isStandalone: true,
      milestoneName: null,
      milestoneId: null,
      milestoneStatus: null
    }))
  
  return [...milestoneTasks, ...standaloneTasks]
}
