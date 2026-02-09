export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-white py-16 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
                    <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse mx-auto" />
                    <div className="h-12 w-96 bg-gray-200 rounded-xl animate-pulse mx-auto max-w-full" />
                    <div className="h-5 w-80 bg-gray-100 rounded-lg animate-pulse mx-auto max-w-full" />
                    {/* Filter pills */}
                    <div className="flex justify-center gap-3 mt-8">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
            {/* Cards grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                            <div className="h-14 w-14 bg-gray-200 rounded-xl animate-pulse" />
                            <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-100 rounded-md animate-pulse w-full" />
                            <div className="h-4 bg-gray-100 rounded-md animate-pulse w-2/3" />
                            <div className="flex gap-4 mt-3">
                                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                            </div>
                            <div className="h-10 bg-gray-200 rounded-xl animate-pulse mt-4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
