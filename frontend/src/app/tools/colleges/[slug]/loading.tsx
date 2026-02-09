export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner Skeleton */}
            <div className="relative h-120 w-full bg-gray-800">
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/40 to-gray-700/30" />
                <div className="absolute bottom-0 left-0 w-full z-10 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl border border-white/10">
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="h-7 w-28 bg-white/20 rounded-full animate-pulse" />
                                    <div className="h-7 w-36 bg-white/15 rounded-full animate-pulse" />
                                </div>
                                <div className="h-12 bg-white/20 rounded-xl animate-pulse w-3/4" />
                                <div className="h-4 bg-white/15 rounded-lg animate-pulse w-full max-w-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 h-14">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded-md animate-pulse" style={{ width: `${60 + (i % 3) * 16}px` }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 space-y-5">
                            <div className="h-7 bg-gray-200 rounded-lg animate-pulse w-40" />
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-100 rounded-md animate-pulse w-full" />
                                <div className="h-4 bg-gray-100 rounded-md animate-pulse w-11/12" />
                                <div className="h-4 bg-gray-100 rounded-md animate-pulse w-4/5" />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
                                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 space-y-5">
                            <div className="h-7 bg-gray-200 rounded-lg animate-pulse w-44" />
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="space-y-2 flex-1">
                                        <div className="h-5 bg-gray-200 rounded animate-pulse w-48" />
                                        <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
                                    </div>
                                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-32" />
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
