import React, { useState, useRef, useEffect } from 'react'
import { X, ThumbsUp, ThumbsDown, Check, CheckCircle2, MessageCircle, Clock, ChevronLeft, ChevronRight, Play, Pause, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react'

// Helper to format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Format video timestamp as MM:SS
const formatTimestamp = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Comment Pin component - renders on the asset
const CommentPin = ({ comment, index, isActive, onClick, isResolved }) => {
  if (comment.anchor?.type === 'video') return null // Video comments don't have pins
  
  const x = comment.anchor?.x || 50
  const y = comment.anchor?.y || 50
  
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center text-11 font-medium transition-all duration-150 z-10
        ${isActive 
          ? 'bg-[#4D5FFF] text-white scale-125 shadow-lg' 
          : isResolved
            ? 'bg-[#8D8D8D] text-white opacity-60 hover:opacity-100'
            : 'bg-[#4D5FFF] text-white hover:scale-110'
        }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {index + 1}
    </button>
  )
}

// Image Viewer Component
const ImageViewer = ({ asset, comments, activeCommentId, onPinClick, onImageClick, pendingAnchor }) => {
  const [zoom, setZoom] = useState(1)
  const imageRef = useRef(null)
  
  const handleImageClick = (e) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    onImageClick({ type: 'image', assetId: asset.id, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 })
  }
  
  // Filter comments for this asset
  const assetComments = comments.filter(c => c.anchor?.assetId === asset.id)
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Zoom Controls */}
      <div className="flex justify-center py-3">
        <div className="flex items-center gap-1 bg-[#242424] rounded-lg shadow-md border border-[#333] p-1">
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#333] transition-colors"
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4 text-[#8D8D8D]" />
          </button>
          <span className="text-12 text-[#8D8D8D] px-2 min-w-[48px] text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(prev => Math.min(2, prev + 0.25))}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#333] transition-colors"
            disabled={zoom >= 2}
          >
            <ZoomIn className="w-4 h-4 text-[#8D8D8D]" />
          </button>
        </div>
      </div>
      
      {/* Image Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <div 
          className="relative cursor-crosshair"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <img
            ref={imageRef}
            src={asset.url}
            alt={asset.name}
            className="max-w-full max-h-[60vh] rounded-lg shadow-lg"
            onClick={handleImageClick}
            draggable={false}
          />
          
          {/* Render comment pins */}
          {assetComments.map((comment, idx) => (
            <CommentPin
              key={comment.id}
              comment={comment}
              index={idx}
              isActive={activeCommentId === comment.id}
              isResolved={comment.resolved}
              onClick={() => onPinClick(comment.id)}
            />
          ))}
          
          {/* Pending anchor indicator */}
          {pendingAnchor && pendingAnchor.assetId === asset.id && (
            <div
              className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-[#4D5FFF] text-white flex items-center justify-center animate-pulse"
              style={{ left: `${pendingAnchor.x}%`, top: `${pendingAnchor.y}%` }}
            >
              <MessageCircle className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Emoji definitions for reactions
const REACTION_EMOJIS = [
  { id: 'heart', emoji: '❤️', label: 'Love' },
  { id: 'thumbsUp', emoji: '👍', label: 'Thumbs Up' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'clap', emoji: '👏', label: 'Clap' },
  { id: 'raisedHands', emoji: '🙌', label: 'Raised Hands' },
  { id: 'eyes', emoji: '👀', label: 'Eyes' },
]

// Get emoji character from reaction id
const getEmojiChar = (emojiId) => {
  const found = REACTION_EMOJIS.find(e => e.id === emojiId)
  return found ? found.emoji : '❤️'
}

// Video Viewer Component - Loom-style UX
// Playback speed options
const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2, 2.5, 3]

const VideoViewer = ({ asset, comments, activeCommentId, onCommentClick, pendingAnchor, videoRef, reactions, onAddReaction }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hoveredReaction, setHoveredReaction] = useState(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [videoRef])
  
  // Click on video = play/pause only (standard behavior)
  const handleVideoClick = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }
  
  const togglePlayPause = (e) => {
    e.stopPropagation()
    handleVideoClick()
  }
  
  // Handle emoji reaction click
  const handleReactionClick = (emojiId) => {
    const video = videoRef.current
    if (!video) return
    const timestamp = Math.round(video.currentTime * 10) / 10
    onAddReaction(emojiId, timestamp, asset.id)
  }
  
  // Handle Comment button click - pauses video and triggers comment flow
  const handleCommentButtonClick = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    const timestamp = Math.round(video.currentTime * 10) / 10
    onCommentClick({ type: 'video', assetId: asset.id, timestamp })
  }
  
  // Handle playback speed change
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }
  
  // Filter reactions for this asset
  const assetReactions = reactions?.filter(r => r.assetId === asset.id || !r.assetId) || []
  
  // Check if video is vertical (9:16 aspect ratio)
  const isVertical = asset.aspectRatio === '9:16'
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Video Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={`relative ${isVertical ? 'max-w-[300px]' : 'max-w-full'}`}>
          <video
            ref={videoRef}
            src={asset.url}
            className={`rounded-lg shadow-lg cursor-pointer ${
              isVertical 
                ? 'h-[55vh] w-auto' 
                : 'max-w-full max-h-[55vh]'
            }`}
            onClick={handleVideoClick}
          />
          
          {/* Custom play/pause overlay */}
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </div>
          </button>
          
          {/* Floating reaction indicators on video */}
          {assetReactions.map((reaction, idx) => {
            const posPercent = duration ? (reaction.timestamp / duration) * 100 : 0
            // Only show reactions that are close to current time (within 2 seconds)
            const isNearCurrent = Math.abs(currentTime - reaction.timestamp) < 2
            if (!isNearCurrent) return null
            return (
              <div
                key={reaction.id || idx}
                className="absolute text-24 animate-bounce pointer-events-none"
                style={{ 
                  left: `${Math.min(90, Math.max(10, posPercent))}%`, 
                  top: '20%',
                  animationDuration: '1s'
                }}
              >
                {getEmojiChar(reaction.emoji)}
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Video Controls */}
      <div className="px-4 pb-2">
        <div className="bg-[#242424] rounded-lg p-3">
          {/* Progress bar with reaction markers */}
          <div className="flex items-center gap-3 mb-3">
            <button onClick={togglePlayPause} className="text-white hover:text-[#4D5FFF] transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <span className="text-12 text-[#8D8D8D] min-w-[80px]">
              {formatTimestamp(currentTime)} / {formatTimestamp(duration || 0)}
            </span>
            <div 
              className="flex-1 h-2 bg-[#333] rounded-full overflow-visible relative cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const percent = clickX / rect.width
                const seekTime = percent * duration
                if (videoRef.current && duration) {
                  videoRef.current.currentTime = seekTime
                }
              }}
            >
              {/* Progress fill */}
              <div 
                className="absolute inset-y-0 left-0 bg-[#4D5FFF] rounded-full transition-all pointer-events-none"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
              
              {/* Reaction markers on timeline */}
              {assetReactions.map((reaction, idx) => {
                const posPercent = duration ? (reaction.timestamp / duration) * 100 : 0
                return (
                  <div
                    key={reaction.id || idx}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer hover:scale-150 transition-transform z-10"
                    style={{ left: `${posPercent}%` }}
                    onMouseEnter={() => setHoveredReaction(reaction)}
                    onMouseLeave={() => setHoveredReaction(null)}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = reaction.timestamp
                      }
                    }}
                  >
                    <span className="text-12">{getEmojiChar(reaction.emoji)}</span>
                    
                    {/* Tooltip */}
                    {hoveredReaction?.id === reaction.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#18181A] text-white text-10 rounded whitespace-nowrap z-20">
                        {reaction.author} at {formatTimestamp(reaction.timestamp)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Playback Speed Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded text-11 font-medium text-[#8D8D8D] hover:text-white hover:bg-[#333] transition-colors flex items-center gap-1"
              >
                {playbackSpeed}x
                <ChevronRight className={`w-3 h-3 transition-transform ${showSpeedMenu ? 'rotate-90' : ''}`} />
              </button>
              
              {showSpeedMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSpeedMenu(false)}
                  />
                  
                  {/* Dropdown menu */}
                  <div className="absolute bottom-full right-0 mb-1 bg-[#242424] border border-[#333] rounded-lg shadow-lg overflow-hidden z-20">
                    {PLAYBACK_SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          handleSpeedChange(speed)
                          setShowSpeedMenu(false)
                        }}
                        className={`w-full px-4 py-1.5 text-11 font-medium text-left flex items-center justify-between gap-3 transition-colors
                          ${playbackSpeed === speed
                            ? 'bg-[#4D5FFF] text-white'
                            : 'text-[#8D8D8D] hover:text-white hover:bg-[#333]'
                          }`}
                      >
                        {speed}x
                        {playbackSpeed === speed && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Show pending anchor timestamp */}
            {pendingAnchor && pendingAnchor.assetId === asset.id && (
              <span className="text-12 text-[#4D5FFF] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(pendingAnchor.timestamp)}
              </span>
            )}
          </div>
          
          {/* Reaction bar + Comment button */}
          <div className="flex items-center justify-between pt-2 border-t border-[#333]">
            {/* Emoji reactions */}
            <div className="flex items-center gap-1">
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji.id}
                  onClick={() => handleReactionClick(emoji.id)}
                  className="p-2 rounded-lg hover:bg-[#333] transition-all hover:scale-110 active:scale-95"
                  title={emoji.label}
                >
                  <span className="text-20">{emoji.emoji}</span>
                </button>
              ))}
            </div>
            
            {/* Request Changes button */}
            <button
              onClick={handleCommentButtonClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-13 font-medium
                bg-[#D71723] text-white hover:bg-[#B8131E] transition-colors"
            >
              <MessageCircle className="w-[18px] h-[18px]" />
              Request Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// PDF Viewer Component
const PDFViewer = ({ asset, comments, activeCommentId, onPDFClick, pendingAnchor }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 1 // For V1, we assume single page PDFs or just show iframe
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Page Controls */}
      <div className="flex justify-center py-3">
        <div className="flex items-center gap-2 bg-[#242424] rounded-lg shadow-md border border-[#333] px-3 py-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-1 rounded hover:bg-[#333] transition-colors disabled:opacity-50"
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4 text-[#8D8D8D]" />
          </button>
          <span className="text-12 text-[#8D8D8D] min-w-[60px] text-center">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-1 rounded hover:bg-[#333] transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#8D8D8D]" />
          </button>
        </div>
      </div>
      
      {/* PDF Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-[800px]">
          <iframe
            src={asset.url}
            className="w-full h-full min-h-[500px] rounded-lg bg-white"
            title={asset.name}
          />
          <p className="text-12 text-[#8D8D8D] text-center mt-2">
            PDF commenting with pins coming in a future update
          </p>
        </div>
      </div>
    </div>
  )
}

// Comment Item Component
const CommentItem = ({ comment, index, isActive, onClick, onToggleResolved, onSeekToTimestamp }) => {
  const hasVideoTimestamp = comment.anchor?.type === 'video' && comment.anchor?.timestamp !== undefined
  
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-150 border
        ${isActive 
          ? 'bg-[#EEF0FF] border-[#4D5FFF]' 
          : comment.resolved
            ? 'bg-[#F5F5F5] border-transparent opacity-60 hover:opacity-100'
            : 'bg-white border-[#E8E8E8] hover:border-[#BBBBBB]'
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#E8E8E8] flex items-center justify-center flex-shrink-0">
          <span className="text-12 font-medium text-[#656565]">
            {comment.author?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-13 font-medium ${comment.resolved ? 'text-[#8D8D8D] line-through' : 'text-[#18181A]'}`}>
              {comment.author}
            </span>
            <span className="text-11 text-[#8D8D8D]">
              {formatRelativeTime(comment.createdAt)}
            </span>
            
            {/* Video timestamp badge */}
            {hasVideoTimestamp && (
              <button
                onClick={(e) => { e.stopPropagation(); onSeekToTimestamp?.(comment.anchor.timestamp); }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#242424] text-[#8D8D8D] text-10 hover:bg-[#333] hover:text-white transition-colors"
              >
                <Clock className="w-3 h-3" />
                {formatTimestamp(comment.anchor.timestamp)}
              </button>
            )}
            
            {/* Pin number for image comments */}
            {comment.anchor?.type === 'image' && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#4D5FFF] text-white text-10">
                {index + 1}
              </span>
            )}
          </div>
          
          {/* Comment text */}
          <p className={`text-13 leading-relaxed ${comment.resolved ? 'text-[#8D8D8D]' : 'text-[#3D3D3F]'}`}>
            {comment.text}
          </p>
        </div>
        
        {/* Resolved toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleResolved(comment.id); }}
          className={`w-8 h-8 rounded-md transition-colors flex-shrink-0 flex items-center justify-center
            ${comment.resolved 
              ? 'text-[#50942A] bg-[#E9F8E5] hover:bg-[#D4F0CE]' 
              : 'text-[#8D8D8D] hover:text-[#50942A] hover:bg-[#E9F8E5]'
            }`}
          title={comment.resolved ? 'Mark as unresolved' : 'Mark as resolved'}
        >
          {comment.resolved ? (
            <CheckCircle2 className="w-[16px] h-[16px]" />
          ) : (
            <Check className="w-[16px] h-[16px]" />
          )}
        </button>
      </div>
    </div>
  )
}

// Comment Input Component
const CommentInput = ({ pendingAnchor, onSubmit, onCancel }) => {
  const [text, setText] = useState('')
  const inputRef = useRef(null)
  
  useEffect(() => {
    if (pendingAnchor && inputRef.current) {
      inputRef.current.focus()
    }
  }, [pendingAnchor])
  
  if (!pendingAnchor) return null
  
  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit(text.trim())
    setText('')
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }
  
  // Anchor preview label
  const getAnchorLabel = () => {
    if (pendingAnchor.type === 'video') {
      return `At ${formatTimestamp(pendingAnchor.timestamp)}`
    }
    if (pendingAnchor.type === 'image') {
      return `Pin at (${Math.round(pendingAnchor.x)}%, ${Math.round(pendingAnchor.y)}%)`
    }
    if (pendingAnchor.type === 'pdf') {
      return `Page ${pendingAnchor.page}`
    }
    return 'New comment'
  }
  
  return (
    <div className="p-3 bg-[#F5F5F5] rounded-lg border border-[#E8E8E8]">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4 text-[#4D5FFF]" />
        <span className="text-12 text-[#4D5FFF] font-medium">{getAnchorLabel()}</span>
      </div>
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add your comment..."
        className="w-full px-3 py-2 text-13 text-[#18181A] placeholder-[#8D8D8D]
          border border-[#E8E8E8] rounded-lg resize-none bg-white
          focus:outline-none focus:ring-2 focus:ring-[#4D5FFF]/20 focus:border-[#4D5FFF]
          transition-colors"
        rows={3}
      />
      <div className="flex items-center justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-12 font-medium text-[#656565] hover:text-[#18181A] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="px-3 py-1.5 text-12 font-medium text-white bg-[#4D5FFF] rounded-md
            hover:bg-[#4555E3] disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        >
          Add Comment
        </button>
      </div>
    </div>
  )
}

// Main ReviewModal Component
const ReviewModal = ({ 
  task, 
  onClose, 
  onApprove, 
  onRequestChanges,
  onAddComment,
  onToggleResolved,
  // Queue props
  queueIndex = 0,
  queueTotal = 1,
  onNext,
  onPrevious
}) => {
  const [activeAssetIndex, setActiveAssetIndex] = useState(0)
  const [activeCommentId, setActiveCommentId] = useState(null)
  const [pendingAnchor, setPendingAnchor] = useState(null)
  const [comments, setComments] = useState(task.comments || [])
  const [reactions, setReactions] = useState(task.reactions || [])
  const [activeCommentTab, setActiveCommentTab] = useState('unresolved')
  const videoRef = useRef(null)
  
  const assets = task.assets || []
  const currentAsset = assets[activeAssetIndex]
  
  // Filter comments for current asset
  const currentAssetComments = comments.filter(c => 
    c.anchor?.assetId === currentAsset?.id
  )
  
  // Handle clicking on asset to place anchor (for images/PDFs)
  const handleAssetClick = (anchor) => {
    setPendingAnchor(anchor)
    setActiveCommentId(null)
  }
  
  // Handle adding a reaction (for videos)
  const handleAddReaction = (emojiId, timestamp, assetId) => {
    const newReaction = {
      id: `r-${Date.now()}`,
      emoji: emojiId,
      timestamp,
      assetId,
      author: 'You', // In real app, this would be the current user
      createdAt: new Date().toISOString()
    }
    setReactions(prev => [...prev, newReaction])
    // In a real app, this would persist to the backend
    console.log('New reaction:', newReaction)
  }
  
  // Handle clicking on a comment pin
  const handlePinClick = (commentId) => {
    setActiveCommentId(commentId)
    setPendingAnchor(null)
  }
  
  // Handle clicking on a comment in the list
  const handleCommentClick = (comment) => {
    setActiveCommentId(comment.id)
    setPendingAnchor(null)
    
    // If it's a video comment, seek to timestamp
    if (comment.anchor?.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = comment.anchor.timestamp
    }
    
    // If it's a different asset, switch to it
    const assetIndex = assets.findIndex(a => a.id === comment.anchor?.assetId)
    if (assetIndex !== -1 && assetIndex !== activeAssetIndex) {
      setActiveAssetIndex(assetIndex)
    }
  }
  
  // Handle seeking to video timestamp
  const handleSeekToTimestamp = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
      videoRef.current.pause()
    }
  }
  
  // Handle adding a new comment
  const handleAddComment = (text) => {
    if (!pendingAnchor) return
    
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You', // In real app, this would be the current user
      text,
      createdAt: new Date().toISOString(),
      resolved: false,
      anchor: pendingAnchor
    }
    
    setComments(prev => [...prev, newComment])
    setPendingAnchor(null)
    
    if (onAddComment) {
      onAddComment(newComment)
    }
  }
  
  // Handle toggling resolved status
  const handleToggleResolved = (commentId) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    ))
    
    if (onToggleResolved) {
      onToggleResolved(commentId)
    }
  }
  
  // Cancel pending anchor
  const handleCancelPendingAnchor = () => {
    setPendingAnchor(null)
  }
  
  // Count unresolved comments
  const unresolvedCount = comments.filter(c => !c.resolved).length
  
  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  // No assets fallback
  if (!currentAsset) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 text-center">
          <h3 className="text-18 font-semibold text-[#18181A] mb-2">{task.title}</h3>
          <p className="text-14 text-[#656565] mb-6">No assets to review for this task.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-13 font-medium text-[#656565] hover:text-[#18181A] transition-colors"
            >
              Close
            </button>
            <button
              onClick={onApprove}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-13 font-medium
                bg-[#E9F8E5] text-[#2A531E] rounded-lg hover:bg-[#D4F0CE] transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              Approve
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-[1200px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          boxShadow: '0px 0px 40px 0px rgba(0, 0, 0, 0.15), 0px 0px 2px 0px rgba(0, 0, 0, 0.2)' 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
          <h2 className="text-16 font-semibold text-[#18181A]">{task.title}</h2>
          
          <div className="flex items-center gap-2">
            {/* Previous button */}
            {queueTotal > 1 && (
              <button
                onClick={onPrevious}
                disabled={queueIndex === 0}
                className="p-2.5 rounded-lg text-[#8D8D8D] hover:text-[#18181A] hover:bg-[#F0F0F0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            {/* Queue progress indicator */}
            {queueTotal > 1 && (
              <span className="text-13 text-[#8D8D8D] min-w-[50px] text-center">
                {queueIndex + 1} of {queueTotal}
              </span>
            )}
            
            {/* Next button */}
            {queueTotal > 1 && (
              <button
                onClick={onNext}
                disabled={queueIndex === queueTotal - 1}
                className="p-2.5 rounded-lg text-[#8D8D8D] hover:text-[#18181A] hover:bg-[#F0F0F0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#8D8D8D] hover:text-[#18181A] hover:bg-[#F0F0F0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content - Split View */}
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Asset Viewer (70%) */}
          <div className="w-[70%] bg-[#1a1a1a] flex flex-col">
            {/* Asset Tabs */}
            {assets.length > 1 && (
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333]">
                {assets.map((asset, idx) => (
                  <button
                    key={asset.id}
                    onClick={() => setActiveAssetIndex(idx)}
                    className={`px-3 py-1.5 rounded-md text-12 font-medium transition-colors
                      ${idx === activeAssetIndex
                        ? 'bg-[#4D5FFF] text-white'
                        : 'text-[#8D8D8D] hover:text-white hover:bg-[#333]'
                      }`}
                  >
                    {asset.name}
                  </button>
                ))}
              </div>
            )}
            
            {/* Asset Viewer */}
            {currentAsset.type === 'image' && (
              <ImageViewer
                asset={currentAsset}
                comments={comments}
                activeCommentId={activeCommentId}
                onPinClick={handlePinClick}
                onImageClick={handleAssetClick}
                pendingAnchor={pendingAnchor}
              />
            )}
            
            {currentAsset.type === 'video' && (
              <VideoViewer
                asset={currentAsset}
                comments={comments}
                activeCommentId={activeCommentId}
                onCommentClick={handleAssetClick}
                pendingAnchor={pendingAnchor}
                videoRef={videoRef}
                reactions={reactions}
                onAddReaction={handleAddReaction}
              />
            )}
            
            {currentAsset.type === 'pdf' && (
              <PDFViewer
                asset={currentAsset}
                comments={comments}
                activeCommentId={activeCommentId}
                onPDFClick={handleAssetClick}
                pendingAnchor={pendingAnchor}
              />
            )}
          </div>
          
          {/* Right Panel - Comments (30%) */}
          <div className="w-[30%] flex flex-col border-l border-[#E8E8E8] bg-white">
            {/* Comments Tabs */}
            <div className="px-4 py-3 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-lg p-1">
                <button
                  onClick={() => setActiveCommentTab('unresolved')}
                  className={`flex-1 px-3 py-1.5 rounded-md text-13 font-medium transition-colors
                    ${activeCommentTab === 'unresolved'
                      ? 'bg-white text-[#18181A] shadow-sm'
                      : 'text-[#656565] hover:text-[#18181A]'
                    }`}
                >
                  Unresolved ({unresolvedCount})
                </button>
                <button
                  onClick={() => setActiveCommentTab('resolved')}
                  className={`flex-1 px-3 py-1.5 rounded-md text-13 font-medium transition-colors
                    ${activeCommentTab === 'resolved'
                      ? 'bg-white text-[#18181A] shadow-sm'
                      : 'text-[#656565] hover:text-[#18181A]'
                    }`}
                >
                  Resolved ({comments.length - unresolvedCount})
                </button>
              </div>
            </div>
            
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {(() => {
                const filteredComments = activeCommentTab === 'unresolved'
                  ? comments.filter(c => !c.resolved)
                  : comments.filter(c => c.resolved)
                
                if (filteredComments.length === 0 && !pendingAnchor) {
                  return (
                    <div className="text-center py-8">
                      {activeCommentTab === 'unresolved' ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-[#22C55E] mx-auto mb-2" />
                          <p className="text-13 text-[#8D8D8D]">Ready for your review</p>
                          <p className="text-12 text-[#BBBBBB] mt-1">Approve if everything looks good</p>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-8 h-8 text-[#E8E8E8] mx-auto mb-2" />
                          <p className="text-13 text-[#8D8D8D]">No resolved comments</p>
                        </>
                      )}
                    </div>
                  )
                }
                
                return filteredComments.map((comment, idx) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    index={idx}
                    isActive={activeCommentId === comment.id}
                    onClick={() => handleCommentClick(comment)}
                    onToggleResolved={handleToggleResolved}
                    onSeekToTimestamp={handleSeekToTimestamp}
                  />
                ))
              })()}
              
              {/* Comment Input */}
              <CommentInput
                pendingAnchor={pendingAnchor}
                onSubmit={handleAddComment}
                onCancel={handleCancelPendingAnchor}
              />
            </div>
            
            {/* Actions Footer */}
            <div className="px-4 py-4 border-t border-[#E8E8E8] bg-[#FAFAFA]">
              {unresolvedCount === 0 ? (
                /* No changes requested - show Approve button */
                <button
                  onClick={() => {
                    if (onApprove) onApprove()
                    // Auto-advance to next item or close if last
                    if (queueIndex < queueTotal - 1 && onNext) {
                      onNext()
                    } else {
                      onClose()
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-14 font-medium
                    bg-[#22C55E] text-white rounded-lg
                    hover:bg-[#16A34A] transition-colors"
                >
                  <ThumbsUp className="w-5 h-5" />
                  Approve
                </button>
              ) : (
                /* Changes requested - show Auto Approve / Review Again options */
                <div className="space-y-3">
                  <p className="text-12 text-[#656565] text-center">Once changes are applied</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // Auto approve means when changes are applied, auto-approve
                        if (onRequestChanges) onRequestChanges({ autoApprove: true })
                        // Auto-advance to next item or close if last
                        if (queueIndex < queueTotal - 1 && onNext) {
                          onNext()
                        } else {
                          onClose()
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-13 font-medium
                        bg-[#E9F8E5] text-[#22C55E] rounded-lg border border-[#BBE9B0]
                        hover:bg-[#D4F0CE] transition-colors"
                    >
                      <Check className="w-[18px] h-[18px]" />
                      Auto Approve
                    </button>
                    <button
                      onClick={() => {
                        // Review again means require another review after changes
                        if (onRequestChanges) onRequestChanges({ reviewAgain: true })
                        // Auto-advance to next item or close if last
                        if (queueIndex < queueTotal - 1 && onNext) {
                          onNext()
                        } else {
                          onClose()
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-13 font-medium
                        bg-[#FEF3C7] text-[#D97706] rounded-lg border border-[#FDE68A]
                        hover:bg-[#FDE68A] transition-colors"
                    >
                      <RefreshCw className="w-[18px] h-[18px]" />
                      Review Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewModal
