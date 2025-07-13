import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, Figma, Github, FileText, Link } from "lucide-react"

interface ProjectLinksProps {
	project: {
		livePreviewUrl?: string | null
		figmaUrl?: string | null
		githubUrl?: string | null
		documentsUrl?: string | null
		otherLinks?: string | null
	}
}

export function ProjectLinks({ project }: ProjectLinksProps) {
	const links = [
		{
			label: "Live Preview",
			url: project.livePreviewUrl,
			icon: <Globe className="h-4 w-4" />,
			color: "bg-green-100 text-green-700 border-green-200"
		},
		{
			label: "Figma Design",
			url: project.figmaUrl,
			icon: <Figma className="h-4 w-4" />,
			color: "bg-purple-100 text-purple-700 border-purple-200"
		},
		{
			label: "GitHub Repository",
			url: project.githubUrl,
			icon: <Github className="h-4 w-4" />,
			color: "bg-gray-100 text-gray-700 border-gray-200"
		},
		{
			label: "Documentation",
			url: project.documentsUrl,
			icon: <FileText className="h-4 w-4" />,
			color: "bg-blue-100 text-blue-700 border-blue-200"
		}
	]

	const activeLinks = links.filter(link => link.url)
	const hasOtherLinks = project.otherLinks && project.otherLinks.trim()

	if (activeLinks.length === 0 && !hasOtherLinks) {
		return (
			<Card className="bg-gray-50 border-gray-200">
				<CardContent className="pt-6">
					<div className="text-center text-gray-500 py-4">
						<Link className="mx-auto h-8 w-8 mb-2 text-gray-300" />
						<p className="text-sm">No project links available yet</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="bg-white border-gray-200">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Link className="h-5 w-5" />
					Project Resources
				</CardTitle>
				<CardDescription>
					Access important project links and resources
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Main Links */}
				<div className="grid grid-cols-1 gap-3">
					{activeLinks.map((link, index) => (
						<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
							<div className="flex items-center gap-3">
								<div className={`p-2 rounded-md ${link.color}`}>
									{link.icon}
								</div>
								<div>
									<p className="font-medium text-gray-900">{link.label}</p>
									<p className="text-sm text-gray-500 truncate max-w-[200px]">
										{link.url}
									</p>
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => window.open(link.url!, '_blank')}
								className="border-gray-300 hover:border-gray-400"
							>
								<ExternalLink className="h-3 w-3 mr-1" />
								Visit
							</Button>
						</div>
					))}
				</div>

				{/* Other Links */}
				{hasOtherLinks && (
					<div className="pt-4 border-t">
						<h4 className="font-medium text-gray-900 mb-3">Additional Resources</h4>
						<div className="bg-gray-50 rounded-lg p-3">
							<p className="text-sm text-gray-700 whitespace-pre-wrap">
								{project.otherLinks}
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
} 