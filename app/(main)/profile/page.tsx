import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import ProfilePageClient from "./_components/ProfilePageClient"

export const metadata: Metadata = {
    title: "Profile | ProjectCentral",
    description: "View and manage your profile, teams, company information, and account settings.",
    keywords: ["profile", "account", "settings", "teams", "user management"],
    openGraph: {
        title: "Profile | ProjectCentral",
        description: "Manage your profile and account settings",
        type: "website",
    },
}

async function getUserProfile(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ownedCompany: {
                include: {
                    teams: {
                        include: {
                            head: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true
                                }
                            },
                            members: {
                                select: {
                                    id: true,
                                    roleTitle: true,
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                            image: true,
                                            role: true
                                        }
                                    }
                                }
                            },
                            _count: {
                                select: {
                                    members: true,
                                    assignedProjects: true
                                }
                            }
                        }
                    }
                }
            },
            company: {
                select: {
                    id: true,
                    name: true,
                    website: true,
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            },
            ledTeams: {
                include: {
                    members: {
                        select: {
                            id: true,
                            roleTitle: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                    role: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            members: true,
                            assignedProjects: true
                        }
                    }
                }
            },
            teamMemberships: {
                select: {
                    id: true,
                    roleTitle: true,
                    team: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true,
                            teamType: true,
                            color: true,
                            head: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
            },
            _count: {
                select: {
                    assignedTasks: true,
                    projects: true,
                    createdTasks: true
                }
            }
        }
    })
}

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    const userProfile = await getUserProfile(session.user.id)

    if (!userProfile) {
        redirect('/signin')
    }

    return <ProfilePageClient userProfile={userProfile} />
}