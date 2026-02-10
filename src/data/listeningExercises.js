// Sample exercises for the Listening Workflow training
// Each exercise contains a prospect transcript with chunks that can be explored

export const listeningExercises = [
  {
    id: 'exercise-1',
    prospect: 'Sarah Chen',
    role: 'VP of Operations',
    company: 'TechCorp Inc.',
    context: 'Discovery call - first meeting',
    transcript: "I've been looking at solutions like yours for about 3 months now. We had some budget issues earlier but now our CEO is pushing for this. The main thing is we need something that integrates with Salesforce.",
    // Pre-defined chunks for guided mode
    chunks: [
      { id: 1, text: "3 months now", start: 52, end: 64, category: 'timeline' },
      { id: 2, text: "budget issues", start: 78, end: 91, category: 'objection' },
      { id: 3, text: "our CEO is pushing", start: 106, end: 124, category: 'stakeholder' },
      { id: 4, text: "integrates with Salesforce", start: 164, end: 190, category: 'requirement' }
    ],
    // Which chunk is most important to prioritize
    correctPriority: 3,
    priorityExplanation: "The CEO's involvement signals executive sponsorship and urgency - key buying signals. Understanding what's driving them gives you leverage.",
    // Follow-up questions for each chunk
    questions: {
      1: [
        { id: 'q1-1', text: "What happened 3 months ago that started this search?", score: 90, feedback: "Great! This uncovers the triggering event." },
        { id: 'q1-2', text: "Have you been looking at other solutions?", score: 50, feedback: "Too vague - you already know they're looking." },
        { id: 'q1-3', text: "Why has it taken 3 months?", score: 40, feedback: "Can come across as accusatory." },
        { id: 'q1-4', text: "What's changed in those 3 months?", score: 85, feedback: "Good - explores the journey and any shifts in priorities." }
      ],
      2: [
        { id: 'q2-1', text: "What kind of budget issues were you facing?", score: 70, feedback: "Okay, but might make them defensive about money." },
        { id: 'q2-2', text: "Has the budget situation improved now?", score: 60, feedback: "Binary question - won't give you much information." },
        { id: 'q2-3', text: "What changed that freed up the budget?", score: 95, feedback: "Excellent! Uncovers what's driving the timing and priority." },
        { id: 'q2-4', text: "How much budget do you have?", score: 30, feedback: "Too direct and premature for a discovery call." }
      ],
      3: [
        { id: 'q3-1', text: "Why is the CEO pushing for this?", score: 70, feedback: "Good direction, but 'why' can feel confrontational." },
        { id: 'q3-2', text: "When did the CEO start pushing?", score: 40, feedback: "Timeline detail but misses the real insight." },
        { id: 'q3-3', text: "What's driving the CEO's urgency?", score: 100, correct: true, feedback: "Perfect! Opens up pain points and business context without being too direct." },
        { id: 'q3-4', text: "Is the CEO the decision maker?", score: 55, feedback: "Useful but better saved for later in the conversation." }
      ],
      4: [
        { id: 'q4-1', text: "What do you currently use for CRM?", score: 45, feedback: "You already know it's Salesforce from the context." },
        { id: 'q4-2', text: "What specifically needs to integrate with Salesforce?", score: 85, feedback: "Good - digs into the actual workflow requirements." },
        { id: 'q4-3', text: "What happens today without that integration?", score: 95, feedback: "Excellent! Uncovers the pain of the current state." },
        { id: 'q4-4', text: "We integrate with Salesforce perfectly.", score: 20, feedback: "This is a statement, not a question. Keep listening!" }
      ]
    },
    feedback: {
      priority: "The CEO's involvement signals executive sponsorship and urgency - key buying signals.",
      question: "Asking about 'urgency' opens up pain points and timeline without being too direct."
    }
  },
  {
    id: 'exercise-2',
    prospect: 'Marcus Johnson',
    role: 'Director of Sales',
    company: 'GrowthFirst LLC',
    context: 'Follow-up call after demo',
    transcript: "The demo looked great, honestly. My team loved the reporting features. But I'm a bit worried about the learning curve - we've tried similar tools before and adoption was a nightmare. Also, I need to run this by our finance team before we can move forward.",
    chunks: [
      { id: 1, text: "My team loved the reporting features", start: 28, end: 64, category: 'champion' },
      { id: 2, text: "worried about the learning curve", start: 76, end: 108, category: 'objection' },
      { id: 3, text: "tried similar tools before and adoption was a nightmare", start: 116, end: 171, category: 'past_experience' },
      { id: 4, text: "run this by our finance team", start: 186, end: 214, category: 'stakeholder' }
    ],
    correctPriority: 3,
    priorityExplanation: "Their past failed adoption is the real blocker here. Understanding what went wrong before helps you position differently and address their fears.",
    questions: {
      1: [
        { id: 'q1-1', text: "Which reporting features resonated most with the team?", score: 80, feedback: "Good - reinforces the positive and identifies champions." },
        { id: 'q1-2', text: "Who on the team was most excited?", score: 85, feedback: "Great - identifies potential internal champions." },
        { id: 'q1-3', text: "Would your team want to see another demo?", score: 40, feedback: "Premature and doesn't advance the conversation." },
        { id: 'q1-4', text: "How would better reporting impact your team's workflow?", score: 90, feedback: "Excellent - connects features to business outcomes." }
      ],
      2: [
        { id: 'q2-1', text: "What would make the learning curve easier?", score: 75, feedback: "Decent - but assumes there will be a difficult curve." },
        { id: 'q2-2', text: "Our tool is very easy to learn.", score: 15, feedback: "Dismissive. Listen and understand their concern first." },
        { id: 'q2-3', text: "What does your ideal onboarding process look like?", score: 90, feedback: "Great - lets them define success criteria." },
        { id: 'q2-4', text: "How long do you typically budget for training?", score: 70, feedback: "Okay - practical but doesn't address the underlying fear." }
      ],
      3: [
        { id: 'q3-1', text: "What tools have you tried before?", score: 65, feedback: "Okay start but doesn't dig into what went wrong." },
        { id: 'q3-2', text: "What made adoption a nightmare last time?", score: 100, correct: true, feedback: "Perfect! Gets to the root cause of their fear." },
        { id: 'q3-3', text: "We're different from those other tools.", score: 20, feedback: "Defensive. They haven't told you what went wrong yet." },
        { id: 'q3-4', text: "How long ago was that experience?", score: 50, feedback: "Minor detail - doesn't address their core concern." }
      ],
      4: [
        { id: 'q4-1', text: "What does finance typically look for in these decisions?", score: 85, feedback: "Good - helps you prepare for their evaluation criteria." },
        { id: 'q4-2', text: "Can I join that meeting with finance?", score: 40, feedback: "Too pushy at this stage." },
        { id: 'q4-3', text: "What's the approval process like?", score: 75, feedback: "Okay - maps the process but not the people." },
        { id: 'q4-4', text: "Who in finance will be reviewing this?", score: 80, feedback: "Good - identifies the specific stakeholder." }
      ]
    },
    feedback: {
      priority: "Past failed adoption creates strong resistance. Address this before anything else.",
      question: "Understanding the specific failure helps you differentiate and build confidence."
    }
  }
]

// Helper function to get an exercise by ID
export const getExercise = (id) => {
  return listeningExercises.find(ex => ex.id === id) || listeningExercises[0]
}

// Get all available exercises
export const getAllExercises = () => {
  return listeningExercises.map(({ id, prospect, company, context }) => ({
    id, prospect, company, context
  }))
}

// Question templates for free-form selection mode
// Each category has keywords to match and a set of realistic follow-up questions
const questionTemplates = {
  timeline: {
    keywords: ['month', 'months', 'week', 'weeks', 'year', 'years', 'ago', 'recently', 'soon', 'now', 'earlier', 'before', 'since', 'time', 'long'],
    questions: [
      { id: 't1', text: "What triggered this timing?", score: 95, correct: true, feedback: "Excellent! This uncovers the event that started their journey." },
      { id: 't2', text: "What's changed since then?", score: 85, feedback: "Good - explores any shifts in priorities or circumstances." },
      { id: 't3', text: "Why has it taken this long?", score: 40, feedback: "Can come across as accusatory or judgmental." },
      { id: 't4', text: "When do you need this resolved by?", score: 70, feedback: "Okay - gets timeline but misses the deeper context." }
    ],
    feedback: "Timeline questions help you understand urgency and what events are driving their decision."
  },
  stakeholder: {
    keywords: ['CEO', 'ceo', 'boss', 'team', 'manager', 'director', 'VP', 'vp', 'executive', 'leadership', 'pushing', 'wants', 'asked', 'told', 'finance', 'board'],
    questions: [
      { id: 's1', text: "What's driving their urgency on this?", score: 95, correct: true, feedback: "Perfect! Opens up pain points and business context without being confrontational." },
      { id: 's2', text: "What does success look like for them?", score: 85, feedback: "Great - helps you understand their evaluation criteria." },
      { id: 's3', text: "Are they the final decision maker?", score: 55, feedback: "Useful but better saved for later in the conversation." },
      { id: 's4', text: "When did they get involved?", score: 45, feedback: "Timeline detail but misses the strategic insight." }
    ],
    feedback: "Stakeholder questions reveal the power dynamics and what matters to key decision makers."
  },
  objection: {
    keywords: ['worried', 'concern', 'issue', 'problem', 'but', 'however', 'afraid', 'fear', 'risk', 'difficult', 'hard', 'challenge', 'nightmare', 'struggle'],
    questions: [
      { id: 'o1', text: "What specifically concerns you about that?", score: 90, correct: true, feedback: "Excellent! Gets to the root of their concern without being defensive." },
      { id: 'o2', text: "What would need to be true for you to feel confident?", score: 85, feedback: "Great - lets them define success criteria." },
      { id: 'o3', text: "That won't be a problem with us.", score: 15, feedback: "Dismissive. Listen and understand their concern first." },
      { id: 'o4', text: "Have others raised this concern?", score: 50, feedback: "Okay but doesn't address their specific situation." }
    ],
    feedback: "Objection handling starts with truly understanding the concern, not overcoming it."
  },
  budget: {
    keywords: ['budget', 'cost', 'price', 'money', 'afford', 'expensive', 'investment', 'spend', 'funding', 'ROI', 'roi', 'pay'],
    questions: [
      { id: 'b1', text: "What changed that freed up the budget?", score: 95, correct: true, feedback: "Excellent! Uncovers what's driving the timing and priority." },
      { id: 'b2', text: "How do you typically evaluate ROI for tools like this?", score: 80, feedback: "Good - helps you speak their language in proposals." },
      { id: 'b3', text: "What's your budget range?", score: 35, feedback: "Too direct and premature for discovery. Build value first." },
      { id: 'b4', text: "Who controls the budget for this?", score: 70, feedback: "Useful for understanding process but doesn't build value." }
    ],
    feedback: "Budget conversations work best when you understand what's driving the investment decision."
  },
  requirement: {
    keywords: ['need', 'require', 'must', 'integrate', 'integration', 'feature', 'capability', 'Salesforce', 'salesforce', 'CRM', 'tool', 'system', 'platform'],
    questions: [
      { id: 'r1', text: "What happens today without that capability?", score: 95, correct: true, feedback: "Excellent! Uncovers the pain of the current state." },
      { id: 'r2', text: "What specifically needs to work together?", score: 85, feedback: "Good - digs into the actual workflow requirements." },
      { id: 'r3', text: "We can definitely do that.", score: 25, feedback: "Premature. Understand the need before committing." },
      { id: 'r4', text: "Is that a must-have or nice-to-have?", score: 60, feedback: "Binary framing - better to understand the impact instead." }
    ],
    feedback: "Requirement questions work best when you understand the pain behind the ask."
  },
  past_experience: {
    keywords: ['tried', 'before', 'previous', 'last time', 'used to', 'switched', 'moved', 'failed', 'didn\'t work', 'adoption', 'similar'],
    questions: [
      { id: 'p1', text: "What went wrong last time?", score: 95, correct: true, feedback: "Perfect! Gets to the root cause of their hesitation." },
      { id: 'p2', text: "What would make this time different?", score: 85, feedback: "Great - lets them articulate their success criteria." },
      { id: 'p3', text: "We're different from those other tools.", score: 20, feedback: "Defensive. They haven't told you what went wrong yet." },
      { id: 'p4', text: "Which tools did you try?", score: 55, feedback: "Okay start but doesn't dig into the real lessons learned." }
    ],
    feedback: "Past experience questions help you position against their fears, not just competitors."
  },
  champion: {
    keywords: ['loved', 'excited', 'great', 'amazing', 'impressed', 'like', 'enjoy', 'positive', 'fan', 'advocate'],
    questions: [
      { id: 'c1', text: "What specifically resonated with them?", score: 90, correct: true, feedback: "Excellent! Reinforces positives and identifies what to emphasize." },
      { id: 'c2', text: "Who was most excited about it?", score: 85, feedback: "Great - identifies potential internal champions." },
      { id: 'c3', text: "How would this impact their daily workflow?", score: 80, feedback: "Good - connects features to business outcomes." },
      { id: 'c4', text: "Would they want another demo?", score: 40, feedback: "Premature and doesn't advance the conversation." }
    ],
    feedback: "Champion questions help you identify and enable internal advocates."
  }
}

// Generic fallback questions when no keyword match is found
const genericQuestions = [
  { id: 'g1', text: "Tell me more about that.", score: 70, feedback: "Safe but generic. Try to be more specific." },
  { id: 'g2', text: "What's driving that for you?", score: 90, correct: true, feedback: "Great open-ended question that invites deeper sharing." },
  { id: 'g3', text: "How does that impact your day-to-day?", score: 85, feedback: "Good - connects to their personal experience." },
  { id: 'g4', text: "What would success look like?", score: 80, feedback: "Helpful for understanding their goals." }
]

/**
 * Generate relevant follow-up questions based on selected text
 * Uses keyword matching to find the most relevant question category
 * @param {string} selectedText - The text the user selected
 * @returns {Object} - { questions: Array, feedback: string, category: string }
 */
export const generateQuestionsForSelection = (selectedText) => {
  if (!selectedText || typeof selectedText !== 'string') {
    return {
      questions: genericQuestions,
      feedback: "Good listening! Ask open-ended questions to learn more.",
      category: 'generic'
    }
  }

  const text = selectedText.toLowerCase()
  let bestMatch = null
  let bestScore = 0

  // Score each category by counting keyword matches
  for (const [category, data] of Object.entries(questionTemplates)) {
    let score = 0
    for (const keyword of data.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score++
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = { category, ...data }
    }
  }

  // Return best match or fallback to generic
  if (bestMatch && bestScore > 0) {
    return {
      questions: bestMatch.questions,
      feedback: bestMatch.feedback,
      category: bestMatch.category
    }
  }

  return {
    questions: genericQuestions,
    feedback: "Good listening! Ask open-ended questions to learn more.",
    category: 'generic'
  }
}
