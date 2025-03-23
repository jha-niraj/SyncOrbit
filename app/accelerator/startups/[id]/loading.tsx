export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <div className="container max-w-6xl mx-auto px-4 py-12">
                <div className="animate-pulse">
                    <div className="h-4 w-32 bg-muted rounded mb-8"></div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                                    <div className="h-24 w-24 bg-muted rounded-full"></div>
                                    <div className="space-y-3 w-full">
                                        <div className="h-8 bg-muted rounded w-3/4"></div>
                                        <div className="h-4 bg-muted rounded w-full"></div>
                                        <div className="flex gap-2">
                                            <div className="h-6 w-20 bg-muted rounded"></div>
                                            <div className="h-6 w-24 bg-muted rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6 mt-8">
                                    <div className="space-y-3">
                                        <div className="h-6 bg-muted rounded w-1/4"></div>
                                        <div className="h-4 bg-muted rounded w-full"></div>
                                        <div className="h-4 bg-muted rounded w-full"></div>
                                        <div className="h-4 bg-muted rounded w-3/4"></div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="h-6 bg-muted rounded w-1/4"></div>
                                        <div className="h-4 bg-muted rounded w-full"></div>
                                        <div className="h-4 bg-muted rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                                <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                                <div className="space-y-4">
                                    {
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="h-4 w-4 bg-muted rounded-full"></div>
                                            <div className="space-y-1">
                                                <div className="h-3 bg-muted rounded w-16"></div>
                                                <div className="h-4 bg-muted rounded w-24"></div>
                                            </div>
                                        </div>
                                    ))
                                    }
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="h-10 bg-muted rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

