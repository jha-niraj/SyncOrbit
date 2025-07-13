'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { cloudinary } from "@/lib/cloudinary";

const feedbackSchema = z.object({
	title: z.string().min(1).max(200),
	description: z.string().max(1000).optional(),
});

const messageSchema = z.object({
	content: z.string().min(1).max(1000),
});

export async function getProjectBySlug(slug: string) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const project = await prisma.project.findUnique({
			where: { slug },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					}
				},
				tasks: {
					select: {
						id: true,
						title: true,
						description: true,
						status: true,
						assignedDeveloper: {
							select: {
								id: true,
								name: true,
								image: true,
							}
						},
						subtasks: {
							select: {
								id: true,
								title: true,
								description: true,
								completed: true,
								createdAt: true,
								updatedAt: true,
							},
							orderBy: {
								createdAt: 'asc'
							}
						}
					}
				},
				feedbacks: {
					select: {
						id: true,
						title: true,
						description: true,
						status: true,
						createdAt: true,
						user: {
							select: {
								id: true,
								name: true,
								image: true,
							}
						}
					},
					orderBy: {
						createdAt: 'desc'
					}
				},
				messages: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								image: true,
								role: true
							}
						}
					},
					orderBy: {
						createdAt: 'asc'
					}
				}
			}
		});

		if (!project) {
			return { success: false, error: "Project not found" };
		}

		// Check if user has access to this project
		const hasAccess = project.userId === session.user.id || 
						 session.user.role === 'ADMIN' || 
						 project.tasks.some(task => task.assignedDeveloper?.id === session.user.id);

		if (!hasAccess) {
			return { success: false, error: "Access denied" };
		}

		return { success: true, project };
	} catch (error) {
		console.error('Error fetching project:', error);
		return { success: false, error: "Failed to fetch project" };
	}
}

export async function addFeedback(projectId: string, feedbackData: z.infer<typeof feedbackSchema>) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const validatedData = feedbackSchema.parse(feedbackData);

		// Check if user has access to this project
		const project = await prisma.project.findUnique({
			where: { id: projectId },
			select: { userId: true }
		});

		if (!project) {
			return { success: false, error: "Project not found" };
		}

		if (project.userId !== session.user.id && session.user.role !== 'ADMIN') {
			return { success: false, error: "Access denied" };
		}

		const feedback = await prisma.feedback.create({
			data: {
				title: validatedData.title,
				description: validatedData.description,
				projectId,
				userId: session.user.id,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
					}
				}
			}
		});

		return { success: true, feedback };
	} catch (error) {
		console.error('Error adding feedback:', error);
		if (error instanceof z.ZodError) {
			return { success: false, error: "Invalid input data" };
		}
		return { success: false, error: "Failed to add feedback" };
	}
}

export async function sendMessage(projectId: string, content: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        // Check if user has access to this project
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                OR: [
                    { userId: session.user.id },
                    { tasks: { some: { assignedDeveloperId: session.user.id } } }
                ]
            }
        });

        if (!project && session.user.role !== 'ADMIN') {
            throw new Error("Project not found or access denied");
        }

        const message = await prisma.message.create({
            data: {
                content,
                projectId,
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                }
            }
        });

        return { success: true, message };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, error: "Failed to send message" };
    }
}

export async function sendMessageWithLink(projectId: string, content: string, linkUrl: string, linkTitle?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        // Check if user has access to this project
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                OR: [
                    { userId: session.user.id },
                    { tasks: { some: { assignedDeveloperId: session.user.id } } }
                ]
            }
        });

        if (!project && session.user.role !== 'ADMIN') {
            throw new Error("Project not found or access denied");
        }

        // Validate URL
        try {
            new URL(linkUrl);
        } catch {
            throw new Error("Invalid URL format");
        }

        const message = await prisma.message.create({
            data: {
                content,
                linkUrl,
                linkTitle,
                projectId,
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                }
            }
        });

        return { success: true, message };
    } catch (error) {
        console.error("Error sending message with link:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to send message" };
    }
}

export async function sendMessageWithImage(projectId: string, content: string, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        // Check if user has access to this project
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                OR: [
                    { userId: session.user.id },
                    { tasks: { some: { assignedDeveloperId: session.user.id } } }
                ]
            }
        });

        if (!project && session.user.role !== 'ADMIN') {
            throw new Error("Project not found or access denied");
        }

        // Upload image to Cloudinary
        const imageFile = formData.get('image') as File;
        if (!imageFile) {
            throw new Error("No image file provided");
        }

        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
            throw new Error("Please select an image file");
        }

        // Validate file size (5MB limit)
        if (imageFile.size > 5 * 1024 * 1024) {
            throw new Error("Image size must be less than 5MB");
        }

        // Upload to Cloudinary
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'chat-images',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as { secure_url: string });
                }
            ).end(buffer);
        });

        // Create message with image
        const message = await prisma.message.create({
            data: {
                content,
                imageUrl: uploadResult.secure_url,
                projectId,
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                }
            }
        });

        return { success: true, message };
    } catch (error) {
        console.error("Error sending message with image:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to send message" };
    }
}

export async function updateFeedbackStatus(feedbackId: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        // Check if user has access to this feedback
        const feedback = await prisma.feedback.findFirst({
            where: {
                id: feedbackId,
                OR: [
                    { userId: session.user.id },
                    { project: { tasks: { some: { assignedDeveloperId: session.user.id } } } }
                ]
            },
            include: {
                project: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!feedback && session.user.role !== 'ADMIN') {
            throw new Error("Feedback not found or access denied");
        }

        const updatedFeedback = await prisma.feedback.update({
            where: { id: feedbackId },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                }
            }
        });

        return { success: true, feedback: updatedFeedback };
    } catch (error) {
        console.error("Error updating feedback status:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update feedback status" };
    }
}

export async function updateProjectPayment(projectId: string, paidAmount: number) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        // Only admin can update payment
        if (session.user.role !== 'ADMIN') {
            throw new Error("Access denied");
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { budget: true }
        });

        if (!project) {
            throw new Error("Project not found");
        }

        const paymentStatus = paidAmount >= project.budget ? 'COMPLETED' : 
                             paidAmount > 0 ? 'PARTIAL' : 'PENDING';

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { 
                paidAmount,
                paymentStatus
            }
        });

        return { success: true, project: updatedProject };
    } catch (error) {
        console.error("Error updating project payment:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update payment" };
    }
}

export async function getProjectMessages(projectId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        const messages = await prisma.message.findMany({
            where: { projectId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return { success: true, messages };
    } catch (error) {
        console.error("Error fetching messages:", error);
        return { success: false, error: "Failed to fetch messages" };
    }
} 