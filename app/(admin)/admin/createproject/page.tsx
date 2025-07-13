"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, AlertCircle, X } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface Client {
	id: string
	name: string
	email: string
	image?: string
	totalSpent: number
	projectsCount: number
}

interface Developer {
	id: string
	name: string
	email: string
	image?: string
	skills?: string
}

export default function CreateProjectPage() {
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedClient, setSelectedClient] = useState<Client | null>(null)
	const [isSearching, setIsSearching] = useState(false)
	const [searchResults, setSearchResults] = useState<Client[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [developers, setDevelopers] = useState<Developer[]>([])
	const [selectedDevelopers, setSelectedDevelopers] = useState<Developer[]>([])
	const router = useRouter()

	const [projectData, setProjectData] = useState({
		title: "",
		description: "",
		slug: "",
		clientType: "EXTERNAL",
		budget: "",
		currency: "USD",
		startDate: "",
		endDate: "",
		livePreviewUrl: "",
		figmaUrl: "",
		githubUrl: "",
		documentsUrl: "",
		otherLinks: ""
	})

	// Load developers when component mounts
	useEffect(() => {
		loadDevelopers()
	}, [])

	const loadDevelopers = async () => {
		try {
			const response = await fetch('/api/admin/search-developers')
			if (response.ok) {
				const data = await response.json()
				setDevelopers(data.developers || [])
			}
		} catch (error) {
			console.error('Error loading developers:', error)
		}
	}

	const searchClients = async (query: string) => {
		if (query.length < 2) {
			setSearchResults([])
			return
		}

		setIsSearching(true)

		try {
			const response = await fetch(`/api/admin/search-clients?q=${encodeURIComponent(query)}`)

			if (!response.ok) {
				throw new Error('Failed to search clients')
			}

			const data = await response.json()
			setSearchResults(data.clients || [])
		} catch (error) {
			console.error('Error searching clients:', error)
			toast.error('Failed to search clients')
			setSearchResults([])
		} finally {
			setIsSearching(false)
		}
	}

	const handleSearch = () => {
		if (searchTerm.trim()) {
			searchClients(searchTerm)
		}
	}

	const handleSearchInputChange = (value: string) => {
		setSearchTerm(value)
	}

	const handleClientSelect = (client: Client) => {
		setSelectedClient(client)
		setSearchResults([])
		setSearchTerm("")
	}

	const handleDeveloperSelect = (developerId: string) => {
		const developer = developers.find(dev => dev.id === developerId)
		if (developer && !selectedDevelopers.find(dev => dev.id === developerId)) {
			setSelectedDevelopers(prev => [...prev, developer])
		}
	}

	const handleRemoveDeveloper = (developerId: string) => {
		setSelectedDevelopers(prev => prev.filter(dev => dev.id !== developerId))
	}

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)+/g, '')
	}

	const handleTitleChange = (title: string) => {
		setProjectData(prev => ({
			...prev,
			title,
			slug: generateSlug(title)
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!selectedClient) {
			toast.error("Please select a client")
			return
		}

		if (!projectData.title || !projectData.budget) {
			toast.error("Please fill in all required fields")
			return
		}

		setIsLoading(true)

		try {
			const response = await fetch('/api/admin/create-project', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...projectData,
					clientId: selectedClient.id,
					budget: parseFloat(projectData.budget),
					developerIds: selectedDevelopers.map(dev => dev.id)
				})
			})

			const result = await response.json()

			if (response.ok && result.success) {
				toast.success("Project created successfully!")

				// Reset form
				setProjectData({
					title: "",
					description: "",
					slug: "",
					clientType: "EXTERNAL",
					budget: "",
					currency: "USD",
					startDate: "",
					endDate: "",
					livePreviewUrl: "",
					figmaUrl: "",
					githubUrl: "",
					documentsUrl: "",
					otherLinks: ""
				})
				setSelectedClient(null)
				setSelectedDevelopers([])

				// Redirect to admin dashboard or projects list
				router.push('/admin')
			} else {
				toast.error(result.error || "Failed to create project")
			}
		} catch (error) {
			console.error('Error creating project:', error)
			toast.error("Failed to create project")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black">
			<div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
				<div className="flex flex-col space-y-8">
					{/* Header */}
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">
							Create New Project
						</h1>
						<p className="text-gray-600 mt-2">
							Search for a client and assign them a new project
						</p>
					</div>

					{/* Client Search */}
					<Card className="bg-white border-gray-200">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Search className="h-5 w-5" />
								Search Client
							</CardTitle>
							<CardDescription>
								Search for a client by name or email address
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-2">
								<Input
									placeholder="Enter client name or email..."
									value={searchTerm}
									onChange={(e) => handleSearchInputChange(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
								/>
								<Button onClick={handleSearch} disabled={isSearching}>
									{isSearching ? "Searching..." : "Search"}
								</Button>
							</div>

							{/* Search Results */}
							{searchResults.length > 0 && (
								<div className="space-y-2">
									<h4 className="font-medium text-gray-900">Search Results:</h4>
									{searchResults.map((client) => (
										<motion.div
											key={client.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
											onClick={() => handleClientSelect(client)}
										>
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<AvatarImage src={client.image || "/placeholder.svg"} alt={client.name} />
													<AvatarFallback className="bg-gray-900 text-white">
														{client.name.charAt(0).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium text-gray-900">{client.name}</p>
													<p className="text-sm text-gray-600">{client.email}</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium text-gray-900">
													${client.totalSpent.toLocaleString()}
												</p>
												<p className="text-xs text-gray-600">
													{client.projectsCount} projects
												</p>
											</div>
										</motion.div>
									))}
								</div>
							)}

							{/* No Results */}
							{searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
								<div className="text-center py-4">
									<p className="text-gray-500">No clients found matching &quot;{searchTerm}&quot;</p>
								</div>
							)}

							{/* Selected Client */}
							{selectedClient && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									className="p-4 bg-green-50 border border-green-200 rounded-lg"
								>
									<div className="flex items-center gap-3">
										<Avatar className="h-12 w-12">
											<AvatarImage src={selectedClient.image || "/placeholder.svg"} alt={selectedClient.name} />
											<AvatarFallback className="bg-green-600 text-white">
												{selectedClient.name.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<h4 className="font-medium text-gray-900">
												Selected Client: {selectedClient.name}
											</h4>
											<p className="text-sm text-gray-600">
												{selectedClient.email}
											</p>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setSelectedClient(null)}
										>
											Change
										</Button>
									</div>
								</motion.div>
							)}
						</CardContent>
					</Card>

					{/* Project Form */}
					{selectedClient && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<Card className="bg-white border-gray-200">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Plus className="h-5 w-5" />
										Project Details
									</CardTitle>
									<CardDescription>
										Fill in the project information
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form onSubmit={handleSubmit} className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="title">Project Title *</Label>
												<Input
													id="title"
													value={projectData.title}
													onChange={(e) => handleTitleChange(e.target.value)}
													placeholder="Enter project title"
													required
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="slug">Project Slug</Label>
												<Input
													id="slug"
													value={projectData.slug}
													onChange={(e) => setProjectData(prev => ({ ...prev, slug: e.target.value }))}
													placeholder="project-slug"
												/>
												<p className="text-xs text-gray-500">
													URL: /projects/{projectData.slug}
												</p>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="description">Description</Label>
											<Textarea
												id="description"
												value={projectData.description}
												onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
												placeholder="Enter project description"
												rows={4}
											/>
										</div>

										{/* Developer Selection */}
										<div className="space-y-4">
											<Label>Assign Developers</Label>
											<Select onValueChange={handleDeveloperSelect}>
												<SelectTrigger>
													<SelectValue placeholder="Select developers to assign" />
												</SelectTrigger>
												<SelectContent>
													{developers.map((developer) => (
														<SelectItem key={developer.id} value={developer.id}>
															<div className="flex items-center gap-2">
																<Avatar className="h-6 w-6">
																	<AvatarImage src={developer.image || "/placeholder.svg"} alt={developer.name} />
																	<AvatarFallback className="text-xs">
																		{developer.name.charAt(0).toUpperCase()}
																	</AvatarFallback>
																</Avatar>
																<span>{developer.name}</span>
																{developer.skills && (
																	<span className="text-xs text-gray-500">
																		({developer.skills.split(',').slice(0, 2).join(', ')})
																	</span>
																)}
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											{/* Selected Developers */}
											{selectedDevelopers.length > 0 && (
												<div className="space-y-2">
													<h4 className="text-sm font-medium text-gray-900">Selected Developers:</h4>
													<div className="flex flex-wrap gap-2">
														{selectedDevelopers.map((developer) => (
															<Badge key={developer.id} variant="outline" className="flex items-center gap-2">
																<Avatar className="h-4 w-4">
																	<AvatarImage src={developer.image || "/placeholder.svg"} alt={developer.name} />
																	<AvatarFallback className="text-xs">
																		{developer.name.charAt(0).toUpperCase()}
																	</AvatarFallback>
																</Avatar>
																<span>{developer.name}</span>
																<X 
																	className="h-3 w-3 cursor-pointer hover:text-red-500"
																	onClick={() => handleRemoveDeveloper(developer.id)}
																/>
															</Badge>
														))}
													</div>
												</div>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											<div className="space-y-2">
												<Label htmlFor="clientType">Client Type</Label>
												<Select
													value={projectData.clientType}
													onValueChange={(value) => setProjectData(prev => ({ ...prev, clientType: value }))}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select client type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="EXTERNAL">External</SelectItem>
														<SelectItem value="INTERNAL">Internal</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="budget">Budget *</Label>
												<Input
													id="budget"
													type="number"
													value={projectData.budget}
													onChange={(e) => setProjectData(prev => ({ ...prev, budget: e.target.value }))}
													placeholder="0"
													min="0"
													step="0.01"
													required
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="currency">Currency</Label>
												<Select
													value={projectData.currency}
													onValueChange={(value) => setProjectData(prev => ({ ...prev, currency: value }))}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select currency" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="USD">USD ($)</SelectItem>
														<SelectItem value="INR">INR (₹)</SelectItem>
														<SelectItem value="NPR">NPR (Rs.)</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="startDate">Start Date</Label>
												<Input
													id="startDate"
													type="date"
													value={projectData.startDate}
													onChange={(e) => setProjectData(prev => ({ ...prev, startDate: e.target.value }))}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="endDate">End Date (Optional)</Label>
												<Input
													id="endDate"
													type="date"
													value={projectData.endDate}
													onChange={(e) => setProjectData(prev => ({ ...prev, endDate: e.target.value }))}
													min={projectData.startDate || undefined}
												/>
											</div>
										</div>

										{/* Project Links */}
										<div className="space-y-4">
											<h3 className="text-lg font-semibold text-gray-900">Project Resources</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div className="space-y-2">
													<Label htmlFor="livePreviewUrl">Live Preview URL</Label>
													<Input
														id="livePreviewUrl"
														type="url"
														value={projectData.livePreviewUrl}
														onChange={(e) => setProjectData(prev => ({ ...prev, livePreviewUrl: e.target.value }))}
														placeholder="https://example.com"
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="figmaUrl">Figma Design URL</Label>
													<Input
														id="figmaUrl"
														type="url"
														value={projectData.figmaUrl}
														onChange={(e) => setProjectData(prev => ({ ...prev, figmaUrl: e.target.value }))}
														placeholder="https://figma.com/..."
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="githubUrl">GitHub Repository</Label>
													<Input
														id="githubUrl"
														type="url"
														value={projectData.githubUrl}
														onChange={(e) => setProjectData(prev => ({ ...prev, githubUrl: e.target.value }))}
														placeholder="https://github.com/..."
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="documentsUrl">Documentation URL</Label>
													<Input
														id="documentsUrl"
														type="url"
														value={projectData.documentsUrl}
														onChange={(e) => setProjectData(prev => ({ ...prev, documentsUrl: e.target.value }))}
														placeholder="https://docs.example.com"
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label htmlFor="otherLinks">Other Links</Label>
												<Textarea
													id="otherLinks"
													value={projectData.otherLinks}
													onChange={(e) => setProjectData(prev => ({ ...prev, otherLinks: e.target.value }))}
													placeholder="Any other relevant links or notes..."
													rows={3}
												/>
											</div>
										</div>

										<Button type="submit" disabled={isLoading} className="w-full">
											{isLoading ? "Creating Project..." : "Create Project"}
										</Button>
									</form>
								</CardContent>
							</Card>
						</motion.div>
					)}

					{/* Instructions */}
					<Card className="bg-blue-50 border-blue-200">
						<CardContent className="pt-6">
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
								<div>
									<h4 className="font-medium text-blue-900 mb-1">
										How to create a project:
									</h4>
									<ul className="text-sm text-blue-800 space-y-1">
										<li>1. Search for the client by name or email</li>
										<li>2. Select the client from the search results</li>
										<li>3. Fill in the project details and assign developers</li>
										<li>4. Add project resources and links</li>
										<li>5. Submit to create the project</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
} 