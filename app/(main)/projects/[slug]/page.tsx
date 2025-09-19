import ProjectDetail from "./project-detail"

interface ProjectPageProps {
	params: Promise<{
		slug: string
	}>
}

export default function ProjectPage({ params }: ProjectPageProps) {
	return <ProjectDetail params={params} />
}
