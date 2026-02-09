
import React, { Suspense } from 'react';
import PageContent from "./content";
import { CollegesPageSkeleton } from '@/components/ui';

export const metadata = {
    title: 'CollegeDost | Find Best Colleges in India 2026',
    description: 'Search top colleges, exams, and courses. compare fees, placements, and reviews for Engineering, Medical, MBA, and more.',
};

export default function CollegesPage() {
    return (
        <Suspense fallback={<CollegesPageSkeleton />}>
            <PageContent />
        </Suspense>
    );
}
