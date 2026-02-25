
import React, { Suspense } from 'react';
import PageContent from "./content";

export const metadata = {
    title: 'AIIMS INI-CET Predictor 2026 | CollegeDost',
    description: 'Estimate your seat chances for AIIMS and INI-CET colleges based on your rank or score.',
};

export default function AIIMSPredictorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent" /></div>}>
            <PageContent />
        </Suspense>
    );
}
