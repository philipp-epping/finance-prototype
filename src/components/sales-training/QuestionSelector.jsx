import React, { useState } from 'react'
import { Check, X, MessageCircleQuestion, Sparkles, ChevronRight } from 'lucide-react'

// Individual question option card
const QuestionOption = ({ question, isSelected, isRevealed, onClick, disabled }) => {
  const isCorrect = question.correct === true
  const score = question.score || 0

  // Determine card styling based on state
  const getCardStyle = () => {
    if (!isRevealed) {
      // Pre-reveal state
      if (isSelected) {
        return 'bg-accent-100 border-accent-600 ring-2 ring-accent-300'
      }
      return 'bg-white border-grey-300 hover:border-grey-400 hover:bg-grey-50'
    }

    // Post-reveal state
    if (isCorrect) {
      return 'bg-green-100 border-green-700'
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-100 border-red-400'
    }
    return 'bg-grey-100 border-grey-300 opacity-60'
  }

  // Determine indicator styling
  const getIndicatorStyle = () => {
    if (!isRevealed) {
      if (isSelected) {
        return 'bg-accent-800 border-accent-800'
      }
      return 'border-grey-400'
    }

    if (isCorrect) {
      return 'bg-green-800 border-green-800'
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-800 border-red-800'
    }
    return 'border-grey-400'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isRevealed}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${getCardStyle()} ${
        disabled || isRevealed ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Selection/Result indicator */}
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-150 ${getIndicatorStyle()}`}
        >
          {isRevealed && isCorrect && <Check className="w-3 h-3 text-white" />}
          {isRevealed && isSelected && !isCorrect && <X className="w-3 h-3 text-white" />}
          {!isRevealed && isSelected && <Check className="w-3 h-3 text-white" />}
        </div>

        {/* Question content */}
        <div className="flex-1 min-w-0">
          <p className="text-16 text-grey-1000 leading-relaxed">
            {question.text}
          </p>

          {/* Feedback (shown after reveal) */}
          {isRevealed && (isSelected || isCorrect) && question.feedback && (
            <div className={`mt-3 pt-3 border-t ${isCorrect ? 'border-green-300' : 'border-red-300'}`}>
              <p className={`text-13 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                {question.feedback}
              </p>
            </div>
          )}
        </div>

        {/* Score badge (shown after reveal) */}
        {isRevealed && (
          <div className={`px-2 py-1 rounded text-12 font-medium ${
            score >= 90 ? 'bg-green-200 text-green-950' :
            score >= 70 ? 'bg-yellow-200 text-yellow-950' :
            score >= 50 ? 'bg-grey-200 text-grey-800' :
            'bg-red-200 text-red-900'
          }`}>
            {score}%
          </div>
        )}
      </div>
    </button>
  )
}

// Feedback panel shown after submission
const FeedbackPanel = ({ isCorrect, feedback, onContinue }) => {
  return (
    <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-100' : 'bg-yellow-100'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCorrect ? 'bg-green-700' : 'bg-yellow-700'
        }`}>
          {isCorrect ? (
            <Sparkles className="w-4 h-4 text-white" />
          ) : (
            <MessageCircleQuestion className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h4 className={`text-14 font-medium mb-1 ${
            isCorrect ? 'text-green-950' : 'text-yellow-950'
          }`}>
            {isCorrect ? 'Great choice!' : 'Good attempt!'}
          </h4>
          <p className={`text-14 ${isCorrect ? 'text-green-900' : 'text-yellow-900'}`}>
            {feedback}
          </p>
        </div>
      </div>

      {onContinue && (
        <div className="mt-4 pt-4 border-t border-opacity-20 flex justify-end">
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-4 py-2 bg-accent-800 hover:bg-accent-900 text-white rounded-lg text-14 font-medium transition-colors"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// Main QuestionSelector component
const QuestionSelector = ({
  prioritizedChunk,
  questions = [],
  selectedQuestionId,
  onSelectQuestion,
  isSubmitted,
  onSubmit,
  feedback,
  onContinue
}) => {
  const [localSelection, setLocalSelection] = useState(selectedQuestionId)

  const handleSelect = (questionId) => {
    if (isSubmitted) return
    setLocalSelection(questionId)
    onSelectQuestion(questionId)
  }

  const selectedQuestion = questions.find(q => q.id === localSelection)
  const correctQuestion = questions.find(q => q.correct === true)
  const isCorrect = selectedQuestion?.correct === true

  if (!prioritizedChunk) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-12 h-12 rounded-full bg-grey-200 flex items-center justify-center mb-4">
          <MessageCircleQuestion className="w-6 h-6 text-grey-600" />
        </div>
        <h3 className="text-16 font-medium text-grey-1000 mb-2">
          No chunk selected
        </h3>
        <p className="text-14 text-grey-700 max-w-sm">
          Go back to Step 2 and select which chunk you want to prioritize.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Prioritized chunk display */}
      <div className="mb-6 p-4 bg-accent-100 rounded-xl border border-accent-300">
        <p className="text-12 text-accent-800 font-medium uppercase tracking-wide mb-1">
          You selected
        </p>
        <p className="text-16 font-medium text-accent-1000">
          "{prioritizedChunk.text}"
        </p>
      </div>

      {/* Instructions */}
      <div className="mb-4">
        <p className="text-14 text-grey-700">
          What's the <span className="font-medium text-grey-1000">best follow-up question</span> to 
          dig deeper into this?
        </p>
      </div>

      {/* Question options */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-3">
          {questions.map((question) => (
            <QuestionOption
              key={question.id}
              question={question}
              isSelected={localSelection === question.id}
              isRevealed={isSubmitted}
              onClick={() => handleSelect(question.id)}
              disabled={isSubmitted}
            />
          ))}
        </div>
      </div>

      {/* Submit button or Feedback */}
      <div className="mt-6 pt-4 border-t border-grey-300">
        {isSubmitted ? (
          <FeedbackPanel
            isCorrect={isCorrect}
            feedback={feedback || correctQuestion?.feedback || "Keep practicing to improve your listening skills!"}
            onContinue={onContinue}
          />
        ) : (
          <button
            onClick={onSubmit}
            disabled={!localSelection}
            className={`w-full py-3 rounded-xl text-14 font-medium transition-all duration-150 ${
              localSelection
                ? 'bg-accent-800 hover:bg-accent-900 text-white'
                : 'bg-grey-200 text-grey-500 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        )}
      </div>
    </div>
  )
}

export default QuestionSelector
