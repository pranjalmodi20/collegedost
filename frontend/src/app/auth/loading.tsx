export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header area */}
            <div className="bg-white py-10 border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-4 space-y-5 text-center">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto" />
                    <div className="h-5 w-80 bg-gray-100 rounded-md animate-pulse mx-auto max-w-full" />
                </div>
            </div>
            {/* Form skeleton */}
            <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6 shadow-sm">
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                    </div>
                    <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
                    <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mx-auto" />
                </div>
            </div>
        </div>
    );
}
