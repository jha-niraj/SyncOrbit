import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Status, TaskStatus } from "@prisma/client";
import { Calendar, DollarSign, Users, ArrowRight, Target, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

import { ProjectWithRelations } from "@/types/project";

interface ProjectCardProps {
	project: ProjectWithRelations;
}

export function ProjectCard({ project }: ProjectCardProps) {
	const completedTasks = project.tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
	const totalTasks = project.tasks.length;
	const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

	const assignedDevelopers = project.tasks
		.map(task => task.assignedDeveloper)
		.filter((dev, index, self) => dev && self.findIndex(d => d?.id === dev.id) === index);

	const getStatusColor = (status: Status) => {
		switch (status) {
			case Status.IN_PROGRESS:
				return "bg-white text-black border-gray-300"
			case Status.COMPLETED:
				return "bg-black text-white border-gray-800"
			case Status.ON_HOLD:
				return "bg-gray-100 text-gray-800 border-gray-300"
			case Status.CANCELLED:
				return "bg-gray-800 text-white border-gray-600"
			default:
				return "bg-gray-50 text-gray-700 border-gray-200"
		}
	}

	const formatCurrencyAmount = (amount: number, currency: string) => {
		const symbols = {
			USD: '$',
			INR: '₹',
			NPR: 'Rs.'
		};
		return `${symbols[currency as keyof typeof symbols] || currency} ${amount.toLocaleString()}`;
	}

	return (
		<Card className="bg-white border-2 border-gray-200 hover:border-black transition-all duration-300 group h-full">
			<CardHeader className="pb-4">
				<div className="space-y-3">
					<div className="flex items-start justify-between">
						<CardTitle className="text-xl font-bold text-black group-hover:text-black transition-colors line-clamp-1">
							{project.title}
						</CardTitle>
						<Badge className={`${getStatusColor(project.status)} text-xs font-medium ml-2 shrink-0`}>
							{project.status.replace('_', ' ')}
						</Badge>
					</div>
					<CardDescription className="text-gray-600 line-clamp-2 leading-relaxed text-sm">
						{project.description || "No description provided"}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 gap-4">
					<div className="flex items-center justify-between py-2 border-b border-gray-100">
						<div className="flex items-center gap-2">
							<DollarSign className="h-4 w-4 text-gray-500" />
							<span className="text-sm font-medium text-gray-700">Budget</span>
						</div>
						<span className="text-sm font-bold text-black">
							{formatCurrencyAmount(project.budget, project.currency)}
						</span>
					</div>
					<div className="flex items-center justify-between py-2 border-b border-gray-100">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-gray-500" />
							<span className="text-sm font-medium text-gray-700">Start Date</span>
						</div>
						<span className="text-sm font-bold text-black">
							{formatDate(project.startDate)}
						</span>
					</div>
					{
						project.endDate && (
							<div className="flex items-center justify-between py-2 border-b border-gray-100">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-gray-500" />
									<span className="text-sm font-medium text-gray-700">Due Date</span>
								</div>
								<span className="text-sm font-bold text-black">
									{formatDate(project.endDate)}
								</span>
							</div>
						)
					}
				</div>
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Target className="h-4 w-4 text-gray-500" />
							<span className="text-sm font-medium text-gray-700">Progress</span>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-gray-500" />
							<span className="text-sm font-bold text-black">
								{completedTasks}/{totalTasks}
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<Progress value={progressPercentage} className="h-2 bg-gray-200" />
						<div className="text-center">
							<span className="text-lg font-bold text-black">
								{Math.round(progressPercentage)}%
							</span>
							<span className="text-xs text-gray-500 ml-1">Complete</span>
						</div>
					</div>
				</div>
				{
					assignedDevelopers.length > 0 && (
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4 text-gray-500" />
									<span className="text-sm font-medium text-gray-700">Team</span>
								</div>
								<span className="text-sm font-bold text-black">
									{assignedDevelopers.length} member{assignedDevelopers.length !== 1 ? 's' : ''}
								</span>
							</div>
							<div className="flex items-center gap-2">
								{
									assignedDevelopers.slice(0, 4).map((developer) => (
										<Avatar key={developer?.id} className="h-8 w-8 border-2 border-white ring-2 ring-gray-200">
											<AvatarImage src={developer?.image || "/placeholder.svg"} alt={developer?.name || "Developer"} />
											<AvatarFallback className="text-xs bg-gray-100 text-gray-800 font-medium">
												{developer?.name?.split(" ").map(n => n[0]).join("") || "D"}
											</AvatarFallback>
										</Avatar>
									))
								}
								{
									assignedDevelopers.length > 4 && (
										<div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white ring-2 ring-gray-200 flex items-center justify-center">
											<span className="text-xs font-medium text-gray-700">
												+{assignedDevelopers.length - 4}
											</span>
										</div>
									)
								}
							</div>
						</div>
					)
				}
				<div className="pt-4 border-t border-gray-100">
					<Link href={`/projects/${project.slug}`}>
						<Button className="w-full bg-black hover:bg-gray-800 text-white transition-colors group-hover:bg-gray-900">
							View Project
							<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
} 