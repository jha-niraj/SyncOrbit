"use client"

import { useState, useEffect, useCallback } from "react"
import {
	Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
	Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
	Plus, Trash2, CheckCircle, Clock, AlertCircle, User, Calendar, Loader2,
	ImageIcon, ExternalLink, FileIcon, Download
} from "lucide-react"
import { toast } from "sonner"
import {
	createSubTask, updateSubTask, deleteSubTask, getTaskWithSubTasks
} from "@/actions/(developers)/developers.action"
import { uploadImageToCloudinary } from "@/actions/shared/upload.action"
import { TaskStatus } from "@prisma/client"
import Image from "next/image"

interface SubTask {
	id: string
	title: string
	description: string | null
	completed: boolean
	createdAt: Date
	updatedAt: Date
}

interface TaskWithSubTasks {
	id: string
	title: string
	description: string | null
	status: TaskStatus
	createdAt: Date
	updatedAt: Date
	assignedDeveloper: {
		id: string
		name: string | null
		email: string | null
		image: string | null
	} | null
	subtasks: SubTask[]
	project: {
		id: string
		title: string
		slug: string
	}
}

interface TaskManagementSheetProps {
	taskId: string
	trigger: React.ReactNode
	userRole: string
}

export function TaskManagementSheet({ taskId, trigger, userRole }: TaskManagementSheetProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [task, setTask] = useState<TaskWithSubTasks | null>(null)
	const [loading, setLoading] = useState(false)
	const [newSubTask, setNewSubTask] = useState({ title: "", description: "" })
	const [creatingSubTask, setCreatingSubTask] = useState(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [filePreview, setFilePreview] = useState<string | null>(null)
	const [uploadingFile, setUploadingFile] = useState(false)
	const [selectedFileType, setSelectedFileType] = useState<'image' | 'document'>('image')

	const isDeveloper = ['DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'].includes(userRole)

	const loadTask = useCallback(async () => {
		if (!taskId) return

		setLoading(true)
		try {
			const result = await getTaskWithSubTasks(taskId)
			if (result.success && result.task) {
				setTask(result.task)
			} else {
				toast.error(result.error || "Failed to load task")
			}
		} catch (error) {
			console.error("Load task error:", error)
			toast.error("Failed to load task")
		} finally {
			setLoading(false)
		}
	}, [taskId])

	useEffect(() => {
		if (isOpen) {
			loadTask()
		}
	}, [isOpen, loadTask])

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			// Validate file type
			const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
			const documentTypes = [
				'application/pdf', 'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'application/vnd.ms-excel',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'text/plain', 'application/zip', 'application/x-zip-compressed'
			]

			const validTypes = [...imageTypes, ...documentTypes]
			const isImage = imageTypes.includes(file.type)

			if (!validTypes.includes(file.type)) {
				toast.error('Please select a valid image or document file')
				return
			}

			// Validate file size (5MB)
			if (file.size > 5 * 1024 * 1024) {
				toast.error('File size must be less than 5MB')
				return
			}

			setSelectedFile(file)
			setSelectedFileType(isImage ? 'image' : 'document')

			// Create preview for images only
			if (isImage) {
				const reader = new FileReader()
				reader.onload = (e) => {
					setFilePreview(e.target?.result as string)
				}
				reader.readAsDataURL(file)
			} else {
				setFilePreview(null)
			}
		}
	}

	const clearFileSelection = () => {
		setSelectedFile(null)
		setFilePreview(null)
	}

	const detectLinksInText = (text: string) => {
		const urlRegex = /(https?:\/\/[^\s]+)/g
		return text.split(urlRegex).map((part, index) => {
			if (part.match(urlRegex)) {
				return (
					<a
						key={index}
						href={part}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
					>
						{part}
						<ExternalLink className="h-3 w-3" />
					</a>
				)
			}
			return part
		})
	}

	const handleCreateSubTask = async () => {
		if (!newSubTask.title.trim()) {
			toast.error("Please enter a task title")
			return
		}

		setCreatingSubTask(true)
		try {
			let description = newSubTask.description

			// Upload file if selected
			if (selectedFile) {
				setUploadingFile(true)
				const formData = new FormData()
				formData.append('file', selectedFile)

				const uploadResult = await uploadImageToCloudinary(formData)
				if (uploadResult.success && uploadResult.url) {
					const filePrefix = selectedFileType === 'image' ? 'Image' : 'File'
					const fileName = selectedFile.name
					description = description
						? `${description}\n\n${filePrefix}: ${fileName} - ${uploadResult.url}`
						: `${filePrefix}: ${fileName} - ${uploadResult.url}`
					toast.success(`${filePrefix} uploaded successfully`)
				} else {
					toast.error(uploadResult.message || "Failed to upload file")
					// Continue without file
				}
				setUploadingFile(false)
			}

			const result = await createSubTask({
				title: newSubTask.title,
				description: description || undefined,
				taskId,
			})

			if (result.success) {
				toast.success("Subtask created successfully")
				setNewSubTask({ title: "", description: "" })
				clearFileSelection()
				await loadTask() // Refresh the task
			} else {
				toast.error(result.error || "Failed to create subtask")
			}
		} catch (error) {
			console.error("Create subtask error:", error)
			toast.error("Failed to create subtask")
		} finally {
			setCreatingSubTask(false)
			setUploadingFile(false)
		}
	}

	const handleToggleSubTask = async (subTaskId: string, completed: boolean) => {
		try {
			const result = await updateSubTask({
				subTaskId,
				completed,
			})

			if (result.success) {
				toast.success(`Subtask ${completed ? 'completed' : 'uncompleted'}`)
				await loadTask() // Refresh the task
			} else {
				toast.error(result.error || "Failed to update subtask")
			}
		} catch (error) {
			console.error("Update subtask error:", error)
			toast.error("Failed to update subtask")
		}
	}

	const handleDeleteSubTask = async (subTaskId: string) => {
		try {
			const result = await deleteSubTask({ subTaskId })

			if (result.success) {
				toast.success("Subtask deleted successfully")
				await loadTask() // Refresh the task
			} else {
				toast.error(result.error || "Failed to delete subtask")
			}
		} catch (error) {
			console.error("Delete subtask error:", error)
			toast.error("Failed to delete subtask")
		}
	}

	const getStatusColor = (status: TaskStatus) => {
		switch (status) {
			case TaskStatus.COMPLETED:
				return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
			case TaskStatus.IN_PROGRESS:
				return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
			case TaskStatus.YET_TO_START:
				return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
			default:
				return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
		}
	}

	const getStatusIcon = (status: TaskStatus) => {
		switch (status) {
			case TaskStatus.COMPLETED:
				return <CheckCircle className="h-4 w-4" />
			case TaskStatus.IN_PROGRESS:
				return <Clock className="h-4 w-4" />
			case TaskStatus.YET_TO_START:
				return <AlertCircle className="h-4 w-4" />
			default:
				return <AlertCircle className="h-4 w-4" />
		}
	}

	const completedSubTasks = task?.subtasks.filter(st => st.completed).length || 0
	const totalSubTasks = task?.subtasks.length || 0
	const progressPercentage = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				{trigger}
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-full h-full sm:w-[80vw] md:w-[55vw] sm:max-w-[80vw] p-6 overflow-y-auto"
				style={{ maxWidth: '90vw' }}
			>
				<SheetHeader>
					<SheetTitle className="text-lg font-semibold">Task Details</SheetTitle>
					<SheetDescription>
						Manage subtasks and track progress
					</SheetDescription>
				</SheetHeader>
				{
					loading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
						</div>
					) : task ? (
						<div className="space-y-6 mt-6">
							<Card>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<CardTitle className="text-lg">{task.title}</CardTitle>
										<Badge className={`${getStatusColor(task.status)} border text-xs`}>
											{getStatusIcon(task.status)}
											<span className="ml-1">{task.status.replace('_', ' ')}</span>
										</Badge>
									</div>
									{
										task.description && (
											<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
												{task.description}
											</p>
										)
									}
								</CardHeader>
								<CardContent className="space-y-4">
									{
										task.assignedDeveloper && (
											<div className="flex items-center gap-3">
												<User className="h-4 w-4 text-gray-500" />
												<div className="flex items-center gap-2">
													<Avatar className="h-6 w-6">
														<AvatarImage src={task.assignedDeveloper.image || "/placeholder.svg"} />
														<AvatarFallback className="text-xs">
															{task.assignedDeveloper.name?.charAt(0) || 'D'}
														</AvatarFallback>
													</Avatar>
													<span className="text-sm text-gray-700 dark:text-gray-300">
														{task.assignedDeveloper.name || task.assignedDeveloper.email}
													</span>
												</div>
											</div>
										)
									}
									<div className="flex items-center gap-3">
										<Calendar className="h-4 w-4 text-gray-500" />
										<span className="text-sm text-gray-600 dark:text-gray-400">
											Created {new Date(task.createdAt).toLocaleDateString()}
										</span>
									</div>
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">Progress</span>
											<span className="text-sm text-gray-600 dark:text-gray-400">
												{completedSubTasks} of {totalSubTasks} subtasks
											</span>
										</div>
										<Progress value={progressPercentage} className="h-2" />
										<div className="text-center">
											<span className="text-2xl font-bold text-blue-600">
												{Math.round(progressPercentage)}%
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
							{
								isDeveloper && (
									<Card>
										<CardHeader>
											<CardTitle className="text-base">Add New Subtask</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="subtask-title">Task Title</Label>
												<Input
													id="subtask-title"
													placeholder="Enter subtask title..."
													value={newSubTask.title}
													onChange={(e) => setNewSubTask({ ...newSubTask, title: e.target.value })}
													disabled={creatingSubTask || uploadingFile}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="subtask-description">Description (Optional)</Label>
												<Textarea
													id="subtask-description"
													placeholder="Enter subtask description... You can also include links!"
													value={newSubTask.description}
													onChange={(e) => setNewSubTask({ ...newSubTask, description: e.target.value })}
													rows={3}
													disabled={creatingSubTask || uploadingFile}
												/>
											</div>
											<div className="space-y-2">
												<Label>Attach File (Optional)</Label>
												<div className="flex items-center gap-2">
													<input
														type="file"
														accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip"
														onChange={handleFileSelect}
														className="hidden"
														id="file-upload"
														disabled={creatingSubTask || uploadingFile}
													/>
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => document.getElementById('file-upload')?.click()}
														disabled={creatingSubTask || uploadingFile}
													>
														<ImageIcon className="h-4 w-4 mr-2" />
														Select File
													</Button>
													{
														selectedFile && (
															<Button
																type="button"
																variant="ghost"
																size="sm"
																onClick={clearFileSelection}
																disabled={creatingSubTask || uploadingFile}
															>
																<Trash2 className="h-4 w-4 mr-2" />
																Remove
															</Button>
														)
													}
												</div>
												{
													selectedFile && (
														<div className="relative p-3 border rounded-lg bg-muted/20">
															<div className="flex items-center gap-3">
																{
																	selectedFileType === 'image' ? (
																		<div className="relative">
																			<Image
																				src={filePreview || ''}
																				alt="Preview"
																				className="w-16 h-16 object-cover rounded"
																				height={16}
																				width={16}
																			/>
																		</div>
																	) : (
																		<div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
																			<FileIcon className="h-8 w-8 text-muted-foreground" />
																		</div>
																	)
																}
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-medium truncate">{selectedFile.name}</p>
																	<p className="text-xs text-muted-foreground">
																		{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
																	</p>
																</div>
															</div>
															{
																uploadingFile && (
																	<div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
																		<div className="text-white text-center">
																			<Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
																			<p className="text-sm">Uploading...</p>
																		</div>
																	</div>
																)
															}
														</div>
													)
												}
												<p className="text-xs text-muted-foreground">
													Supports images and documents up to 5MB (JPG, PNG, WebP, PDF, DOC, DOCX, XLS, XLSX, TXT, ZIP)
												</p>
											</div>
											<Button
												onClick={handleCreateSubTask}
												disabled={creatingSubTask || uploadingFile || !newSubTask.title.trim()}
												className="w-full"
											>
												{
													uploadingFile ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															Uploading File...
														</>
													) : creatingSubTask ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															Creating...
														</>
													) : (
														<>
															<Plus className="mr-2 h-4 w-4" />
															Add Subtask
														</>
													)
												}
											</Button>
										</CardContent>
									</Card>
								)
							}

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Subtasks ({totalSubTasks})</h3>
								{
									task.subtasks.length > 0 ? (
										<div className="space-y-3">
											{
												task.subtasks.map((subTask) => {
													// Parse file attachments from description
													const imageUrlMatch = subTask.description?.match(/Image: ([^\s]+) - (https?:\/\/[^\s]+)/)
													const fileUrlMatch = subTask.description?.match(/File: ([^\s]+) - (https?:\/\/[^\s]+)/)

													const imageUrl = imageUrlMatch?.[2]
													const imageName = imageUrlMatch?.[1]
													const fileUrl = fileUrlMatch?.[2]
													const fileName = fileUrlMatch?.[1]

													const descriptionWithoutFiles = subTask.description
														?.replace(/Image: [^\s]+ - https?:\/\/[^\s]+/, '')
														?.replace(/File: [^\s]+ - https?:\/\/[^\s]+/, '')
														?.trim()

													return (
														<Card key={subTask.id} className={`${subTask.completed ? 'bg-gray-50 dark:bg-gray-900/50' : ''}`}>
															<CardContent className="p-4">
																<div className="flex items-start gap-3">
																	<Checkbox
																		checked={subTask.completed}
																		onCheckedChange={(checked) =>
																			handleToggleSubTask(subTask.id, checked as boolean)
																		}
																		disabled={!isDeveloper}
																		className="mt-1"
																	/>
																	<div className="flex-1 min-w-0">
																		<h4 className={`font-medium ${subTask.completed ? 'line-through text-gray-500' : ''}`}>
																			{subTask.title}
																		</h4>
																		{
																			descriptionWithoutFiles && (
																				<div className={`text-sm mt-1 ${subTask.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
																					{detectLinksInText(descriptionWithoutFiles)}
																				</div>
																			)
																		}
																		{
																			imageUrl && (
																				<div className="mt-2">
																					<p className="text-xs text-muted-foreground mb-1">📎 {imageName}</p>
																					<Image
																						src={imageUrl}
																						alt={imageName || "Subtask attachment"}
																						className="max-w-full h-auto max-h-48 object-contain rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
																						onClick={() => window.open(imageUrl, '_blank')}
																						width={48}
																						height={48}
																					/>
																				</div>
																			)
																		}
																		{
																			fileUrl && fileName && (
																				<div className="mt-2">
																					<div
																						className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
																						onClick={() => window.open(fileUrl, '_blank')}
																					>
																						<FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
																						<span className="text-sm font-medium truncate">{fileName}</span>
																						<Download className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-auto" />
																					</div>
																				</div>
																			)
																		}
																		<p className="text-xs text-gray-500 mt-2">
																			Created {new Date(subTask.createdAt).toLocaleDateString()}
																		</p>
																	</div>
																	{
																		isDeveloper && (
																			<Button
																				variant="ghost"
																				size="sm"
																				onClick={() => handleDeleteSubTask(subTask.id)}
																				className="text-red-500 hover:text-red-700 hover:bg-red-50"
																			>
																				<Trash2 className="h-4 w-4" />
																			</Button>
																		)
																	}
																</div>
															</CardContent>
														</Card>
													)
												})
											}
										</div>
									) : (
										<div className="text-center py-8 text-gray-500 dark:text-gray-400">
											<AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
											<p>No subtasks yet</p>
											{
												isDeveloper && (
													<p className="text-sm mt-2">Add subtasks to track progress on this task</p>
												)
											}
										</div>
									)
								}
							</div>
						</div>
					) : (
						<div className="text-center py-8 text-gray-500 dark:text-gray-400">
							<p>Failed to load task details</p>
						</div>
					)
				}
			</SheetContent>
		</Sheet>
	)
} 