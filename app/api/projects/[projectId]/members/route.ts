import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { projectId } = await params

    // Get the project to verify access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id }, // User is the client
          { 
            company: {
              users: {
                some: { id: session.user.id }
              }
            }
          } // User is part of the company
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        company: {
          include: {
            users: {
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
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      )
    }

    // Collect all unique users associated with the project
    const users = new Map()

    // Add the client
    if (project.user) {
      users.set(project.user.id, {
        id: project.user.id,
        name: project.user.name,
        email: project.user.email,
        image: project.user.image,
        role: 'CLIENT'
      })
    }

    // Add company members
    if (project.company?.users) {
      project.company.users.forEach(user => {
        users.set(user.id, {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role
        })
      })
    }

    // Add assigned developers from tasks
    project.tasks.forEach(task => {
      if (task.assignedTo) {
        users.set(task.assignedTo.id, {
          id: task.assignedTo.id,
          name: task.assignedTo.name,
          email: task.assignedTo.email,
          image: task.assignedTo.image,
          role: 'DEVELOPER'
        })
      }
    })

    // Convert Map to array and exclude the current user
    const members = Array.from(users.values())
      .filter(user => user.id !== session.user.id)
      .sort((a, b) => {
        // Sort by name, with users having names first
        if (a.name && !b.name) return -1
        if (!a.name && b.name) return 1
        const nameA = a.name || a.email || ''
        const nameB = b.name || b.email || ''
        return nameA.localeCompare(nameB)
      })

    return NextResponse.json({
      members,
      total: members.length
    })

  } catch (error) {
    console.error('Error fetching project members:', error)
    return NextResponse.json(
      { error: "Failed to fetch project members" },
      { status: 500 }
    )
  }
}