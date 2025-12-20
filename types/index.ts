// Re-export all types from a central location
export * from './project'
export * from './user'
export * from './dashboard'

// Common utility types
export type ApiResponse<T> = {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export type PaginatedResponse<T> = {
    data: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}

export type SortOrder = 'asc' | 'desc'

export type FilterOptions = {
    search?: string
    status?: string[]
    dateFrom?: Date
    dateTo?: Date
    sortBy?: string
    sortOrder?: SortOrder
}