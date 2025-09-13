"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MentionUser, 
  getMentionSuggestions, 
  getMentionCursorPosition,
  formatMentionForInput,
  extractMentions,
  getMentionedUsers
} from "@/lib/utils/mentions"
import { cn } from "@/lib/utils"
import { User, AtSign } from "lucide-react"

interface MentionInputProps {
  value: string
  onChange: (value: string, mentionedUsers: MentionUser[]) => void
  availableUsers: MentionUser[]
  placeholder?: string
  className?: string
  disabled?: boolean
  rows?: number
  maxLength?: number
}

export function MentionInput({
  value,
  onChange,
  availableUsers,
  placeholder = "Type @ to mention someone...",
  className,
  disabled = false,
  rows = 3,
  maxLength
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<MentionUser[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionPosition, setMentionPosition] = useState<{
    start: number
    text: string
    before: string
    after: string
  } | null>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Handle input changes
  const handleInputChange = (newValue: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursorPos = textarea.selectionStart || 0
    const mentionPos = getMentionCursorPosition(newValue, cursorPos)

    if (mentionPos && mentionPos.mentionText.length >= 0) {
      // Show suggestions
      setMentionPosition({
        start: mentionPos.mentionStart,
        text: mentionPos.mentionText,
        before: mentionPos.beforeMention,
        after: mentionPos.afterMention
      })
      setMentionQuery(mentionPos.mentionText)
      
      const filteredSuggestions = getMentionSuggestions(
        mentionPos.mentionText,
        availableUsers,
        8
      )
      
      setSuggestions(filteredSuggestions)
      setShowSuggestions(filteredSuggestions.length > 0)
      setSelectedSuggestionIndex(0)
    } else {
      // Hide suggestions
      setShowSuggestions(false)
      setMentionPosition(null)
      setMentionQuery("")
    }

    // Get mentioned users and call onChange
    const mentionedUsers = getMentionedUsers(newValue, availableUsers)
    onChange(newValue, mentionedUsers)
  }

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      
      case 'Enter':
      case 'Tab':
        if (showSuggestions && suggestions[selectedSuggestionIndex]) {
          e.preventDefault()
          selectSuggestion(suggestions[selectedSuggestionIndex])
        }
        break
      
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }

  // Select a suggestion
  const selectSuggestion = (user: MentionUser) => {
    if (!mentionPosition || !textareaRef.current) return

    const mentionText = formatMentionForInput(user)
    const newValue = mentionPosition.before + mentionText + ' ' + mentionPosition.after
    
    // Update cursor position
    const newCursorPos = mentionPosition.before.length + mentionText.length + 1
    
    handleInputChange(newValue)
    setShowSuggestions(false)
    
    // Set cursor position after the mention
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }
    }, 0)
  }

  // Calculate suggestions dropdown position
  const getSuggestionsPosition = () => {
    if (!textareaRef.current || !mentionPosition) return { top: 0, left: 0 }

    const textarea = textareaRef.current
    const textBeforeMention = mentionPosition.before + '@' + mentionQuery
    
    // Create a hidden div to measure text dimensions
    const measureDiv = document.createElement('div')
    measureDiv.style.position = 'absolute'
    measureDiv.style.visibility = 'hidden'
    measureDiv.style.whiteSpace = 'pre-wrap'
    measureDiv.style.font = window.getComputedStyle(textarea).font
    measureDiv.style.padding = window.getComputedStyle(textarea).padding
    measureDiv.style.border = window.getComputedStyle(textarea).border
    measureDiv.style.width = textarea.clientWidth + 'px'
    measureDiv.textContent = textBeforeMention
    
    document.body.appendChild(measureDiv)
    const rect = measureDiv.getBoundingClientRect()
    document.body.removeChild(measureDiv)
    
    const textareaRect = textarea.getBoundingClientRect()
    
    return {
      top: rect.height + 5,
      left: Math.max(0, Math.min(rect.width - textareaRect.left, textareaRect.width - 200))
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !textareaRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  // Get mentioned users for display
  const mentionedUsers = getMentionedUsers(value, availableUsers)

  return (
    <div className="relative">
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("resize-none", className)}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
        />

        {/* Mentioned Users Display */}
        {mentionedUsers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <AtSign className="h-3 w-3" />
              Mentioned:
            </span>
            {mentionedUsers.map((user) => (
              <Badge key={user.id} variant="secondary" className="text-xs">
                {user.name || user.email}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Card 
          ref={suggestionsRef}
          className="absolute z-50 w-64 max-h-48 overflow-y-auto shadow-lg"
          style={getSuggestionsPosition()}
        >
          <CardContent className="p-1">
            <div className="text-xs text-muted-foreground px-2 py-1 border-b">
              People you can mention
            </div>
            {suggestions.map((user, index) => (
              <div
                key={user.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                  index === selectedSuggestionIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                onClick={() => selectSuggestion(user)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="text-xs">
                    {user.name?.[0] || user.email?.[0] || <User className="h-3 w-3" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user.name || user.email}
                  </div>
                  {user.name && user.email && (
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatMentionForInput(user)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Hook to get available users for mentions
export function useMentionUsers(projectId?: string) {
  const [users, setUsers] = useState<MentionUser[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    if (!projectId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/members`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.members || [])
      }
    } catch (error) {
      console.error('Error fetching mention users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [projectId])

  return { users, loading, refetch: fetchUsers }
}