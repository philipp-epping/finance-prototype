import React, { useState, useRef, useCallback } from 'react'

// Free-form transcript: Click and drag to select any text
const TranscriptViewer = ({ 
  transcript, 
  selections = [],
  onSelectionChange,
  prospect,
  context
}) => {
  const textRef = useRef(null)
  const [isSelecting, setIsSelecting] = useState(false)

  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return
    setIsSelecting(false)

    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return

    const selectedText = selection.toString().trim()
    if (!selectedText) return

    // Get selection range relative to the transcript
    const range = selection.getRangeAt(0)
    const textNode = textRef.current

    if (!textNode) return

    // Create a range to measure the offset
    const preRange = document.createRange()
    preRange.selectNodeContents(textNode)
    preRange.setEnd(range.startContainer, range.startOffset)
    const start = preRange.toString().length

    const newSelection = {
      id: Date.now(),
      text: selectedText,
      start: start,
      end: start + selectedText.length
    }

    onSelectionChange([...selections, newSelection])

    // Clear the browser selection
    selection.removeAllRanges()
  }, [isSelecting, selections, onSelectionChange])

  const handleMouseDown = () => {
    setIsSelecting(true)
  }

  const handleRemoveSelection = (selectionId) => {
    onSelectionChange(selections.filter(s => s.id !== selectionId))
  }

  // Render transcript with highlighted selections
  const renderTranscript = () => {
    if (selections.length === 0) {
      return <span className="text-grey-800">{transcript}</span>
    }

    const elements = []
    let lastIndex = 0

    // Sort selections by start position
    const sortedSelections = [...selections].sort((a, b) => a.start - b.start)

    sortedSelections.forEach((sel) => {
      // Add text before this selection
      if (sel.start > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`} className="text-grey-800">
            {transcript.substring(lastIndex, sel.start)}
          </span>
        )
      }

      // Add the selection as a highlighted span
      elements.push(
        <span
          key={`sel-${sel.id}`}
          className="inline-block px-1 py-0.5 mx-0.5 rounded-md bg-accent-300 text-accent-1000 ring-2 ring-accent-500 cursor-pointer group relative"
          onClick={() => handleRemoveSelection(sel.id)}
        >
          {sel.text}
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-grey-950 text-white text-11 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Click to remove
          </span>
        </span>
      )

      lastIndex = sel.end
    })

    // Add remaining text
    if (lastIndex < transcript.length) {
      elements.push(
        <span key={`text-${lastIndex}`} className="text-grey-800">
          {transcript.substring(lastIndex)}
        </span>
      )
    }

    return elements
  }

  const selectionCount = selections.length

  return (
    <div className="flex flex-col h-full">
      {/* Prospect info */}
      {prospect && (
        <div className="mb-4 pb-4 border-b border-grey-300">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-accent-200 flex items-center justify-center text-accent-800 font-medium text-14">
              {prospect.charAt(0)}
            </div>
            <span className="font-medium text-grey-1000 text-14">{prospect}</span>
          </div>
          {context && (
            <p className="text-grey-700 text-13 ml-10">{context}</p>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-13 text-grey-700">
          Click and drag to select any text
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 bg-grey-100 rounded-xl p-6 overflow-auto">
        <div 
          ref={textRef}
          className="max-w-2xl text-16 leading-relaxed select-text cursor-text"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {renderTranscript()}
        </div>
      </div>

      {/* Selection count */}
      <div className="mt-4 pt-4 border-t border-grey-300 flex items-center justify-between">
        <div className="text-14 text-grey-700">
          <span className="font-medium text-grey-1000">{selectionCount}</span>
          {selectionCount === 1 ? ' chunk' : ' chunks'} selected
        </div>
        {selectionCount === 0 && (
          <p className="text-13 text-grey-600">
            Select portions of the transcript that you could ask follow-up questions about
          </p>
        )}
      </div>
    </div>
  )
}

export default TranscriptViewer
