import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

import { Calendar, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Project } from "@/types/project";

interface CompletedProjectsProps {
	projects: Project[];
}

export function CompletedProjects({ projects }: CompletedProjectsProps) {
	const formatCurrencyAmount = (amount: number, currency: string) => {
		const symbols = {
			USD: '$',
			INR: '₹',
			NPR: 'Rs.'
		};
		return `${symbols[currency as keyof typeof symbols] || currency} ${amount.toLocaleString()}`;
	}

	if (projects.length === 0) {
		return (
			<div className="text-center py-8">
				<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
					<CheckCircle className="w-8 h-8 text-gray-400" />
				</div>
				<p className="text-gray-500 dark:text-gray-400">No completed projects yet</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{
				projects.map((project) => (
					<Card key={project.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<CardTitle className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
										{project.title}
									</CardTitle>
									<CardDescription className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
										{project.description || "No description provided"}
									</CardDescription>
								</div>
								<Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
									<CheckCircle className="w-3 h-3 mr-1" />
									Done
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="grid grid-cols-2 gap-3 text-xs">
								<div className="flex items-center gap-2">
									<DollarSign className="h-3 w-3 text-green-600" />
									<span className="text-gray-900 dark:text-white font-medium">
										{formatCurrencyAmount(project.budget, project.currency)}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-3 w-3 text-gray-500" />
									<span className="text-gray-600 dark:text-gray-400">
										{formatDate(project.startDate)}
									</span>
								</div>
							</div>
							<Link href={`/projects/${project.slug}`}>
								<Button variant="outline" size="sm" className="w-full text-xs">
									View Details
									<ArrowRight className="ml-1 h-3 w-3" />
								</Button>
							</Link>
						</CardContent>
					</Card>
				))
			}
		</div>
	);
} 