// Request body:
export interface RequestBody {
    name: string;
    email: string;
    password: string;
    referralCode?: string;
    role?: 'CLIENT' | 'DEVELOPER' | 'PRODUCTMANAGER' | 'ADMIN';
    // Company fields for PM registration
    companyName?: string;
    companyShortName?: string;
    companyId?: string;
}

// User role types for developers
export type UserRole = 'BASIC_DEVELOPER' | 'PROJECT_CREATOR' | 'SENIOR_DEVELOPER' | 'TEAM_LEAD';