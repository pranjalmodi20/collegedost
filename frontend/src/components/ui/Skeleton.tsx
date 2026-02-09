import React from 'react';

/* ─── Base Skeleton Primitives ─────────────────────────────────────────── */

interface SkeletonProps {
    className?: string;
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const roundedClassMap: Record<NonNullable<SkeletonProps['rounded']>, string> = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
};

/** Base shimmer block — pass width/height via className */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', rounded = 'lg' }) => (
    <div
        className={`animate-pulse bg-gray-200 ${roundedClassMap[rounded]} ${className}`}
        aria-hidden="true"
    />
);

/** Circle shimmer (avatar / logo placeholder) */
export const SkeletonCircle: React.FC<{ size?: string; className?: string }> = ({
    size = 'w-12 h-12',
    className = '',
}) => (
    <div className={`animate-pulse bg-gray-200 rounded-full ${size} ${className}`} aria-hidden="true" />
);

/* ─── College Card Skeleton ────────────────────────────────────────────── */

export const CollegeCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex gap-5">
            {/* Logo */}
            <div className="shrink-0">
                <div className="w-28 h-28 rounded-xl bg-gray-200 animate-pulse" />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0 space-y-4">
                {/* Title */}
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                {/* Info grid 3-col */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-100 rounded-md animate-pulse" style={{ width: `${65 + (i % 3) * 12}%` }} />
                    ))}
                </div>
                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                    <div className="h-9 w-40 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-9 w-28 bg-gray-100 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    </div>
);

/* ─── College Page Full Skeleton ───────────────────────────────────────── */

export const CollegesPageSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gray-50 antialiased">
        {/* Hero skeleton */}
        <div className="bg-white pt-8 pb-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse mb-8" />
                <div className="max-w-3xl space-y-4">
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-2/3" />
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-1/2" />
                </div>
            </div>
        </div>
        {/* Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex gap-8">
                {/* Sidebar */}
                <aside className="hidden lg:block w-72 shrink-0 space-y-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4">
                            <div className="h-4 bg-gray-200 rounded-md animate-pulse w-24" />
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, j) => (
                                    <div key={j} className="flex items-center gap-2.5">
                                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3.5 bg-gray-100 rounded animate-pulse" style={{ width: `${50 + j * 10}%` }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </aside>
                {/* Cards */}
                <div className="flex-1 space-y-4">
                    {/* Search bar skeleton */}
                    <div className="h-14 bg-white rounded-2xl border border-gray-200 animate-pulse mb-6" />
                    {/* Count */}
                    <div className="h-4 w-44 bg-gray-200 rounded-md animate-pulse mb-6" />
                    {/* Cards */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <CollegeCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* ─── Featured College Card Skeleton (Carousel) ───────────────────────── */

export const FeaturedCardSkeleton: React.FC = () => (
    <div className="shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-md">
        <div className="h-48 bg-gray-200 animate-pulse" />
        <div className="p-5 space-y-3">
            <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded-md animate-pulse w-1/2" />
            <div className="flex gap-2 mt-2">
                <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
            </div>
        </div>
    </div>
);

/* ─── Stream Page Skeleton ─────────────────────────────────────────────── */

export const StreamPageSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl space-y-5">
                    <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-4/5" />
                    <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-3/5" />
                    <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-2/5" />
                </div>
            </div>
        </div>
        {/* Content blocks */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            {/* College cards grid */}
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1 bg-gray-300 rounded-full" />
                    <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="h-40 bg-gray-200 animate-pulse" />
                            <div className="p-5 space-y-3">
                                <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                                <div className="h-4 bg-gray-100 rounded-md animate-pulse w-1/2" />
                                <div className="flex gap-2">
                                    <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
                                    <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Pill section skeleton */}
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1 bg-gray-300 rounded-full" />
                    <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-14 bg-white rounded-xl border border-gray-100 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* ─── Homepage Skeleton ────────────────────────────────────────────────── */

export const HomePageSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="relative bg-white pt-20 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl space-y-6">
                    <div className="h-6 w-36 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-14 bg-gray-200 rounded-xl animate-pulse w-5/6" />
                    <div className="h-14 bg-gray-200 rounded-xl animate-pulse w-3/5" />
                    <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-4/6" />
                    {/* Search bar */}
                    <div className="h-16 bg-gray-100 rounded-2xl animate-pulse mt-8" />
                </div>
            </div>
        </div>
        {/* Featured Colleges row  */}
        <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1 bg-gray-300 rounded-full" />
                    <div className="h-7 w-52 bg-gray-200 rounded-lg animate-pulse" />
                </div>
                <div className="flex gap-6 overflow-hidden">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <FeaturedCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
        {/* Content blocks */}
        <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-4">
                    <div className="h-8 w-80 bg-gray-200 rounded-lg animate-pulse mx-auto" />
                    <div className="h-5 w-96 bg-gray-100 rounded-md animate-pulse mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                    <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                </div>
            </div>
        </div>
    </div>
);

export default Skeleton;
