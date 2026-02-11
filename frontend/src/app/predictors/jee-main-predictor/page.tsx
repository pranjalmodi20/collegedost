
import React, { Suspense } from 'react';
import PageContent from "./content";

export const metadata = {
    title: 'JEE Main College Predictor 2026 | CollegeDost',
    description: 'Predict your admission chances in NITs, IIITs, GFTIs and Private Colleges based on JEE Main Percentile.',
};

export default function JEEMainPredictorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent" /></div>}>
            <PageContent />
        </Suspense>
    );
}
