import { formatDate, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Status } from "@prisma/client";

interface Project {
    id: string;
    title: string;
    description: string | null;
    status: Status;
    budget: number;
    startDate: Date;
    endDate: Date | null;
    tasks: {
        id: string;
        title: string;
        status: string;
        assignedDeveloper: {
            id: string;
            name: string | null;
            image: string | null;
        } | null;
    }[];
}

interface ProjectListProps {
    projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
    const getStatusColor = (status: Status) => {
        switch (status) {
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "COMPLETED":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "ON_HOLD":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "CANCELLED":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    return (
        <div className="grid gap-4">
            {
                projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">{project.title}</CardTitle>
                                <Badge className={getStatusColor(project.status)}>
                                    {project.status.replace("_", " ")}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{project.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div>
                                        <p className="text-sm font-medium">Budget</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatCurrency(project.budget)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Start Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(project.startDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Tasks</p>
                                        <p className="text-sm text-muted-foreground">
                                            {project.tasks.length} total
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Completion</p>
                                        <p className="text-sm text-muted-foreground">
                                            {Math.round((project.tasks.filter(t => t.status === "COMPLETED").length / project.tasks.length) * 100)}%
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Link href={`/projects/${project.id}`}>
                                        <Button variant="outline">View Details</Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    );
} 