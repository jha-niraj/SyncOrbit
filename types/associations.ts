import { Role, InvitationType, InvitationStatus, Company, Project, ProjectMember, User } from "@prisma/client"

export interface AssociationUser {
    id: string
    name: string | null
    email: string | null
    role: Role
}

export interface AssociationCompany extends Company {
    users?: AssociationUser[]
}

export interface AssociationProject extends Project {
    user?: AssociationUser & {
        company: {
            id: string
            name: string
        } | null
    }
}

export interface AssociationProjectMembership extends ProjectMember {
    project: AssociationProject
}

export interface AssociationOwnedProject extends Project {
    members: (ProjectMember & {
        user: AssociationUser
    })[]
}

export interface UserAssociations {
    user: AssociationUser
    memberOfCompany: Company | null
    managedCompany: (Company & { users: AssociationUser[] }) | null
    projectMemberships: AssociationProjectMembership[]
    ownedProjects: AssociationOwnedProject[]
}

export interface PendingInvitation {
    id: string
    email: string
    type: InvitationType
    status: InvitationStatus
    message: string | null
    expiresAt: Date
    sender: {
        name: string | null
        email: string | null
    }
    company: {
        name: string
    } | null
    project: {
        title: string
    } | null
    createdAt: Date | string
}
