export interface MentionUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

export interface ParsedMention {
  userId: string
  username: string
  displayName: string
  position: {
    start: number
    end: number
  }
}

/**
 * Extract mentions from text content
 * Supports formats like @username, @"Full Name", @email@domain.com
 */
export function extractMentions(text: string): ParsedMention[] {
  const mentions: ParsedMention[] = []
  
  // Pattern to match @mentions in various formats
  // @username, @"Full Name", @email@domain.com
  const mentionRegex = /@(?:\"([^"]+)\"|([a-zA-Z0-9._-]+(?:@[a-zA-Z0-9.-]+)?)|([a-zA-Z0-9._-]+))/g
  
  let match
  while ((match = mentionRegex.exec(text)) !== null) {
    const fullMatch = match[0]
    const quotedName = match[1] // "Full Name"
    const emailOrUsername = match[2] // email@domain.com or username
    const simpleUsername = match[3] // simple username
    
    const displayName = quotedName || emailOrUsername || simpleUsername || ''
    
    mentions.push({
      userId: '', // Will be resolved later
      username: displayName,
      displayName,
      position: {
        start: match.index!,
        end: match.index! + fullMatch.length
      }
    })
  }
  
  return mentions
}

/**
 * Replace mentions in text with clickable mention components
 */
export function formatMentionsForDisplay(
  text: string, 
  mentions: ParsedMention[], 
  users: MentionUser[]
): string {
  if (mentions.length === 0) return text
  
  let formattedText = text
  let offset = 0
  
  // Sort mentions by position to process them in order
  const sortedMentions = [...mentions].sort((a, b) => a.position.start - b.position.start)
  
  for (const mention of sortedMentions) {
    const user = users.find(u => 
      u.name?.toLowerCase() === mention.displayName.toLowerCase() ||
      u.email?.toLowerCase() === mention.displayName.toLowerCase()
    )
    
    if (user) {
      const mentionHtml = `<span class="mention-tag" data-user-id="${user.id}" data-user-name="${user.name || user.email}">@${user.name || user.email}</span>`
      
      const startPos = mention.position.start + offset
      const endPos = mention.position.end + offset
      
      formattedText = formattedText.slice(0, startPos) + mentionHtml + formattedText.slice(endPos)
      
      // Update offset for next replacements
      offset += mentionHtml.length - (mention.position.end - mention.position.start)
    }
  }
  
  return formattedText
}

/**
 * Resolve mention usernames to actual user IDs
 */
export function resolveMentions(
  mentions: ParsedMention[], 
  users: MentionUser[]
): ParsedMention[] {
  return mentions.map(mention => {
    const user = users.find(u => 
      u.name?.toLowerCase() === mention.displayName.toLowerCase() ||
      u.email?.toLowerCase() === mention.displayName.toLowerCase() ||
      u.name?.toLowerCase().replace(/\s+/g, '') === mention.username.toLowerCase() ||
      u.email?.split('@')[0].toLowerCase() === mention.username.toLowerCase()
    )
    
    return {
      ...mention,
      userId: user?.id || '',
      displayName: user?.name || user?.email || mention.displayName
    }
  }).filter(mention => mention.userId) // Only keep resolved mentions
}

/**
 * Get users mentioned in text
 */
export function getMentionedUsers(
  text: string,
  availableUsers: MentionUser[]
): MentionUser[] {
  const mentions = extractMentions(text)
  const resolvedMentions = resolveMentions(mentions, availableUsers)
  
  const mentionedUserIds = new Set(resolvedMentions.map(m => m.userId))
  
  return availableUsers.filter(user => mentionedUserIds.has(user.id))
}

/**
 * Create notification message for mentions
 */
export function createMentionNotification(
  mentioner: MentionUser,
  context: {
    type: 'task_comment' | 'project_comment' | 'message' | 'feedback'
    entityId: string
    entityTitle: string
  }
): string {
  const mentionerName = mentioner.name || mentioner.email || 'Someone'
  
  switch (context.type) {
    case 'task_comment':
      return `${mentionerName} mentioned you in a comment on task "${context.entityTitle}"`
    case 'project_comment':
      return `${mentionerName} mentioned you in a comment on project "${context.entityTitle}"`
    case 'message':
      return `${mentionerName} mentioned you in a message`
    case 'feedback':
      return `${mentionerName} mentioned you in feedback for "${context.entityTitle}"`
    default:
      return `${mentionerName} mentioned you`
  }
}

/**
 * Validate mention format
 */
export function isValidMention(text: string): boolean {
  const mentionRegex = /^@(?:\"[^"]+\"|[a-zA-Z0-9._-]+(?:@[a-zA-Z0-9.-]+)?|[a-zA-Z0-9._-]+)$/
  return mentionRegex.test(text)
}

/**
 * Get mention suggestions based on input
 */
export function getMentionSuggestions(
  input: string,
  users: MentionUser[],
  limit = 10
): MentionUser[] {
  if (!input || input.length < 1) return []
  
  const query = input.toLowerCase()
  
  return users
    .filter(user => {
      const name = user.name?.toLowerCase() || ''
      const email = user.email?.toLowerCase() || ''
      
      return name.includes(query) || 
             email.includes(query) || 
             email.split('@')[0].includes(query)
    })
    .sort((a, b) => {
      // Prioritize name matches over email matches
      const aNameMatch = a.name?.toLowerCase().startsWith(query) ? 1 : 0
      const bNameMatch = b.name?.toLowerCase().startsWith(query) ? 1 : 0
      
      if (aNameMatch !== bNameMatch) {
        return bNameMatch - aNameMatch
      }
      
      // Then sort alphabetically
      const aName = a.name || a.email || ''
      const bName = b.name || b.email || ''
      return aName.localeCompare(bName)
    })
    .slice(0, limit)
}

/**
 * Format mention for input display
 */
export function formatMentionForInput(user: MentionUser): string {
  if (user.name && !user.name.includes(' ')) {
    return `@${user.name}`
  } else if (user.name) {
    return `@"${user.name}"`
  } else if (user.email) {
    return `@${user.email}`
  }
  return '@unknown'
}

/**
 * Clean mentions from text (remove @ symbols for storage)
 */
export function cleanMentionsForStorage(text: string): string {
  return text.replace(/@(?:\"([^"]+)\"|([a-zA-Z0-9._-]+(?:@[a-zA-Z0-9.-]+)?)|([a-zA-Z0-9._-]+))/g, (match) => {
    return match.substring(1) // Remove the @ symbol
  })
}

/**
 * Get cursor position for mention insertion
 */
export function getMentionCursorPosition(text: string, cursorPos: number): {
  mentionStart: number
  mentionText: string
  beforeMention: string
  afterMention: string
} | null {
  // Find the @ symbol before the cursor
  let mentionStart = -1
  for (let i = cursorPos - 1; i >= 0; i--) {
    if (text[i] === '@') {
      mentionStart = i
      break
    } else if (text[i] === ' ' || text[i] === '\n') {
      break
    }
  }
  
  if (mentionStart === -1) return null
  
  const mentionText = text.slice(mentionStart + 1, cursorPos)
  const beforeMention = text.slice(0, mentionStart)
  const afterMention = text.slice(cursorPos)
  
  return {
    mentionStart,
    mentionText,
    beforeMention,
    afterMention
  }
}