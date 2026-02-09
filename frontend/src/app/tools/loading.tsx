export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-start">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="space-y-8">
                    {/* Header skeleton */}
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-2/5" />
                        <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-3/5" />
                    </div>
                    {/* Grid skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                                <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
                                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                                <div className="h-4 bg-gray-100 rounded-md animate-pulse w-full" />
                                <div className="h-4 bg-gray-100 rounded-md animate-pulse w-2/3" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
