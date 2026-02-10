import React from 'react'
import { Check, Lightbulb } from 'lucide-react'

// Individual chunk card for prioritization
const ChunkCard = ({ chunk, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${
        isSelected
          ? 'bg-accent-100 border-accent-600 ring-2 ring-accent-300'
          : 'bg-white border-grey-300 hover:border-grey-400 hover:bg-grey-50'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Selection indicator */}
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-150 ${
            isSelected
              ? 'bg-accent-800 border-accent-800'
              : 'border-grey-400'
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>

        {/* Chunk content */}
        <div className="flex-1 min-w-0">
          <p className="text-16 font-medium text-grey-1000 leading-relaxed">
            "{chunk.text}"
          </p>
        </div>
      </div>
    </button>
  )
}

// Main ChunkPrioritizer component
const ChunkPrioritizer = ({
  chunks = [],
  prioritizedChunkId,
  onPrioritize
}) => {
  if (chunks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-12 h-12 rounded-full bg-grey-200 flex items-center justify-center mb-4">
          <Lightbulb className="w-6 h-6 text-grey-600" />
        </div>
        <h3 className="text-16 font-medium text-grey-1000 mb-2">
          No chunks to prioritize
        </h3>
        <p className="text-14 text-grey-700 max-w-sm">
          Go back to Step 1 and select some chunks from the transcript first.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Instructions */}
      <div className="mb-6">
        <p className="text-14 text-grey-700">
          You selected {chunks.length} {chunks.length === 1 ? 'chunk' : 'chunks'}. 
          Now pick the <span className="font-medium text-grey-1000">most important one</span> to dig deeper into.
        </p>
      </div>

      {/* Chunk cards */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-3">
          {chunks.map((chunk) => (
            <ChunkCard
              key={chunk.id}
              chunk={chunk}
              isSelected={prioritizedChunkId === chunk.id}
              onClick={() => onPrioritize(chunk.id)}
            />
          ))}
        </div>
      </div>

      {/* Hint */}
      <div className="mt-6 pt-4 border-t border-grey-300">
        <div className="flex items-start gap-2 p-3 bg-accent-100 rounded-lg">
          <Lightbulb className="w-4 h-4 text-accent-800 flex-shrink-0 mt-0.5" />
          <p className="text-13 text-accent-1000">
            <span className="font-medium">Pro tip:</span> Look for signals that reveal pain, urgency, 
            or key stakeholders. These usually lead to the most valuable conversations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChunkPrioritizer
