import ProjectDetail from "./projectdetail"

interface ProjectPageProps {
	params: Promise<{
		slug: string
	}>
}

export default function ProjectPage({ params }: ProjectPageProps) {
	return <ProjectDetail params={params} />
}
