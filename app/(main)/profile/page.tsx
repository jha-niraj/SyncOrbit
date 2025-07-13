import { getProfile } from "@/actions/(client)/profile.action"
import { getPMProfile } from "@/actions/(productmanager)/pm.action"
import { SettingsForm } from "./_components/settingsform"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Settings, Shield, Mail, Calendar, Building2, Users } from "lucide-react"
import { ProfileForm } from "./_components/profileform"
import { PMProfileForm } from "./_components/pmprofileform"
import { auth } from "@/auth"

export default async function ProfilePage() {
	const session = await auth()

	if (!session?.user) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
					<p className="text-gray-600 mt-2">Please sign in to continue</p>
				</div>
			</div>
		)
	}

	// Get profile data based on user role
	const profileData = session.user.role === 'PRODUCTMANAGER'
		? await getPMProfile()
		: await getProfile()

	if (!profileData.success || !profileData.user) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600">Error loading profile</h1>
					<p className="text-gray-600 mt-2">Please try again later</p>
				</div>
			</div>
		)
	}

	const { user } = profileData
	const userRole = user.role || session.user.role
	const isPM = userRole === 'PRODUCTMANAGER'
	const isDeveloper = userRole === 'DEVELOPER'

	// Type the user object properly
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const pmUser = user as any // PM user with managedCompany
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const regularUser = user as any // Regular user with projects/totalSpent/assignedTasks

	return (
		<div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black">
			<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
				<div className="flex flex-col lg:flex-row gap-8">
					<div className="lg:w-1/3">
						<Card className="sticky top-8">
							<CardHeader className="text-center">
								<div className="relative mx-auto">
									<Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-lg">
										<AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "User"} />
										<AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold">
											{user.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
										</AvatarFallback>
									</Avatar>
								</div>
								<CardTitle className="text-2xl font-bold mt-4">{user.name}</CardTitle>
								<CardDescription className="text-lg">{user.email}</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-center">
									<Badge variant="outline" className="flex items-center gap-2">
										<Shield className="h-4 w-4" />
										{userRole}
									</Badge>
								</div>

								<Separator />

								<div className="space-y-3">
									<div className="flex items-center gap-3 text-sm text-muted-foreground">
										<Mail className="h-4 w-4" />
										<span>{user.email}</span>
									</div>
									<div className="flex items-center gap-3 text-sm text-muted-foreground">
										<Calendar className="h-4 w-4" />
										{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
										<span>Member since {new Date((user as any).createdAt || new Date()).toLocaleDateString()}</span>
									</div>
								</div>

								<Separator />

								{
									isPM && pmUser.managedCompany && (
										<>
											<div className="space-y-3">
												<h4 className="font-semibold text-sm flex items-center gap-2">
													<Building2 className="h-4 w-4" />
													Company Information
												</h4>
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<span className="text-sm font-medium">Name:</span>
														<span className="text-sm text-muted-foreground">{pmUser.managedCompany.name}</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="text-sm font-medium">Short Name:</span>
														<span className="text-sm text-muted-foreground">{pmUser.managedCompany.shortName}</span>
													</div>
													<div className="flex items-center gap-2">
														<Users className="h-4 w-4" />
														<span className="text-sm text-muted-foreground">
															{pmUser.managedCompany.users?.length || 0} team members
														</span>
													</div>
												</div>
											</div>
											<Separator />
										</>
									)
								}
								<div className="space-y-2">
									<h4 className="font-semibold text-sm">
										{isPM ? "Company Statistics" : "Account Statistics"}
									</h4>
									<div className="grid grid-cols-2 gap-4 text-center">
										{
											isPM ? (
												<>
													<div>
														<p className="text-2xl font-bold text-blue-600">
															{pmUser.managedCompany?.users?.length || 0}
														</p>
														<p className="text-xs text-muted-foreground">Team Members</p>
													</div>
													<div>
														<p className="text-2xl font-bold text-green-600">
															{regularUser.projects?.length || 0}
														</p>
														<p className="text-xs text-muted-foreground">Projects</p>
													</div>
												</>
											) : isDeveloper ? (
												<>
													<div>
														<p className="text-2xl font-bold text-blue-600">
															{regularUser.assignedTasks?.length || 0}
														</p>
														<p className="text-xs text-muted-foreground">Tasks</p>
													</div>
													<div>
														<p className="text-2xl font-bold text-green-600">
															{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
															{regularUser.assignedTasks?.filter((t: any) => t.status === 'COMPLETED').length || 0}
														</p>
														<p className="text-xs text-muted-foreground">Completed</p>
													</div>
												</>
											) : (
												<>
													<div>
														<p className="text-2xl font-bold text-blue-600">{regularUser.projects?.length || 0}</p>
														<p className="text-xs text-muted-foreground">Projects</p>
													</div>
													<div>
														<p className="text-2xl font-bold text-green-600">${regularUser.totalSpent || 0}</p>
														<p className="text-xs text-muted-foreground">Total Spent</p>
													</div>
												</>
											)
										}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="lg:w-2/3">
						<Tabs defaultValue="profile" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="profile" className="flex items-center gap-2">
									<User className="h-4 w-4" />
									Profile
								</TabsTrigger>
								<TabsTrigger value="settings" className="flex items-center gap-2">
									<Settings className="h-4 w-4" />
									Settings
								</TabsTrigger>
							</TabsList>
							<TabsContent value="profile" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>
											{isPM ? "Company & Profile Information" : "Profile Information"}
										</CardTitle>
										<CardDescription>
											{
												isPM
													? "Update your profile and company information"
													: "Update your profile information and bio"
											}
										</CardDescription>
									</CardHeader>
									<CardContent>
										{
											isPM ? (
												// eslint-disable-next-line @typescript-eslint/no-explicit-any
												<PMProfileForm user={pmUser as any} />
											) : (
												<ProfileForm user={regularUser} />
											)
										}
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="settings" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>Account Settings</CardTitle>
										<CardDescription>
											Manage your account preferences and security settings
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SettingsForm user={user} />
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	)
}