import React, { useState, useMemo } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2, Headphones } from 'lucide-react'
import TranscriptViewer from './TranscriptViewer'
import ChunkPrioritizer from './ChunkPrioritizer'
import QuestionSelector from './QuestionSelector'
import { getExercise, generateQuestionsForSelection } from '../../data/listeningExercises'

// Step indicator component
const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-13 font-medium transition-all duration-200 ${
              step < currentStep
                ? 'bg-green-700 text-white'
                : step === currentStep
                ? 'bg-accent-800 text-white ring-4 ring-accent-200'
                : 'bg-grey-200 text-grey-600'
            }`}
          >
            {step < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-8 h-0.5 mx-1 ${
                step < currentStep ? 'bg-green-600' : 'bg-grey-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Step title component
const StepTitle = ({ step }) => {
  const titles = {
    1: 'What could you ask about?',
    2: 'Which is most important?',
    3: 'Best follow-up question?'
  }
  
  const subtitles = {
    1: 'Identify the chunks in the transcript that you could ask follow-up questions about.',
    2: 'From your selections, pick the one that would be most valuable to explore.',
    3: 'Choose the best follow-up question to dig deeper into this topic.'
  }

  return (
    <div className="mb-6">
      <h2 className="text-18 font-semibold text-grey-1000 mb-1">
        Step {step} of 3: {titles[step]}
      </h2>
      <p className="text-14 text-grey-700">{subtitles[step]}</p>
    </div>
  )
}

// Completion screen
const CompletionScreen = ({ generatedFeedback, wasCorrect, onRestart, onNextExercise }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
        wasCorrect ? 'bg-green-100' : 'bg-yellow-100'
      }`}>
        {wasCorrect ? (
          <CheckCircle2 className="w-8 h-8 text-green-700" />
        ) : (
          <Headphones className="w-8 h-8 text-yellow-700" />
        )}
      </div>
      
      <h2 className="text-18 font-semibold text-grey-1000 mb-2">
        {wasCorrect ? 'Excellent work!' : 'Exercise complete!'}
      </h2>
      
      <p className="text-14 text-grey-700 max-w-md mb-6">
        {wasCorrect 
          ? "You identified the key signals and asked the right question. Great listening skills!" 
          : "Keep practicing! The more you train, the better you'll become at identifying key buying signals."
        }
      </p>

      {/* Summary */}
      <div className="w-full max-w-sm bg-grey-100 rounded-xl p-4 mb-6 text-left">
        <h4 className="text-13 font-medium text-grey-800 uppercase tracking-wide mb-3">
          What to remember
        </h4>
        <p className="text-14 text-grey-900">
          {generatedFeedback}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2 bg-grey-200 hover:bg-grey-300 text-grey-900 rounded-lg text-14 font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
        {onNextExercise && (
          <button
            onClick={onNextExercise}
            className="flex items-center gap-2 px-4 py-2 bg-accent-800 hover:bg-accent-900 text-white rounded-lg text-14 font-medium transition-colors"
          >
            Next Exercise
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Main ListeningWorkflow component
const ListeningWorkflow = ({ exerciseId = 'exercise-1' }) => {
  // Get exercise data
  const exercise = useMemo(() => getExercise(exerciseId), [exerciseId])

  // Workflow state (free-form only)
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState([])
  const [prioritizedChunkId, setPrioritizedChunkId] = useState(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState(null)
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Derived state
  const canContinueStep1 = selections.length > 0
  const canContinueStep2 = prioritizedChunkId !== null

  // Get the prioritized chunk object
  const prioritizedChunk = useMemo(() => {
    if (!prioritizedChunkId) return null
    return selections.find(s => s.id === prioritizedChunkId)
  }, [prioritizedChunkId, selections])

  // Generate questions based on the prioritized chunk's text
  const generatedQuestionsData = useMemo(() => {
    if (!prioritizedChunk) return { questions: [], feedback: '', category: '' }
    return generateQuestionsForSelection(prioritizedChunk.text)
  }, [prioritizedChunk])

  const questions = generatedQuestionsData.questions

  // Check if user got the correct answer
  const wasCorrect = useMemo(() => {
    if (!selectedQuestionId) return false
    const selectedQ = questions.find(q => q.id === selectedQuestionId)
    return selectedQ?.correct === true
  }, [selectedQuestionId, questions])

  // Handlers
  const handleSelectionChange = (newSelections) => {
    setSelections(newSelections)
    // Reset downstream state when selections change
    setPrioritizedChunkId(null)
    setSelectedQuestionId(null)
    setIsQuestionSubmitted(false)
  }

  const handlePrioritize = (chunkId) => {
    setPrioritizedChunkId(chunkId)
    // Reset question selection when priority changes
    setSelectedQuestionId(null)
    setIsQuestionSubmitted(false)
  }

  const handleSelectQuestion = (questionId) => {
    setSelectedQuestionId(questionId)
  }

  const handleSubmitQuestion = () => {
    setIsQuestionSubmitted(true)
  }

  const handleContinueAfterFeedback = () => {
    setIsComplete(true)
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(1)
    setSelections([])
    setPrioritizedChunkId(null)
    setSelectedQuestionId(null)
    setIsQuestionSubmitted(false)
    setIsComplete(false)
  }

  // Render completion screen
  if (isComplete) {
    return (
      <CompletionScreen
        generatedFeedback={generatedQuestionsData.feedback}
        wasCorrect={wasCorrect}
        onRestart={handleRestart}
        onNextExercise={null}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-grey-300">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-accent-800" />
          </div>
          <div>
            <h1 className="text-14 font-medium text-grey-1000">
              Listening Exercise
            </h1>
            <p className="text-13 text-grey-700">
              {exercise.prospect} · {exercise.context}
            </p>
          </div>
        </div>
        <StepIndicator currentStep={currentStep} totalSteps={3} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <StepTitle step={currentStep} />

          <div className="h-[calc(100%-80px)]">
            {currentStep === 1 && (
              <TranscriptViewer
                transcript={exercise.transcript}
                selections={selections}
                onSelectionChange={handleSelectionChange}
                prospect={exercise.prospect}
                context={exercise.context}
              />
            )}

            {currentStep === 2 && (
              <ChunkPrioritizer
                chunks={selections}
                prioritizedChunkId={prioritizedChunkId}
                onPrioritize={handlePrioritize}
              />
            )}

            {currentStep === 3 && (
              <QuestionSelector
                prioritizedChunk={prioritizedChunk}
                questions={questions}
                selectedQuestionId={selectedQuestionId}
                onSelectQuestion={handleSelectQuestion}
                isSubmitted={isQuestionSubmitted}
                onSubmit={handleSubmitQuestion}
                feedback={generatedQuestionsData.feedback}
                onContinue={handleContinueAfterFeedback}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-grey-300 bg-grey-50">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-14 font-medium transition-colors ${
            currentStep === 1
              ? 'text-grey-400 cursor-not-allowed'
              : 'text-grey-700 hover:bg-grey-200'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {currentStep < 3 && (
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !canContinueStep1) ||
              (currentStep === 2 && !canContinueStep2)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-14 font-medium transition-colors ${
              (currentStep === 1 && canContinueStep1) ||
              (currentStep === 2 && canContinueStep2)
                ? 'bg-accent-800 hover:bg-accent-900 text-white'
                : 'bg-grey-200 text-grey-500 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ListeningWorkflow
