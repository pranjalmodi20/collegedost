import { Suspense } from "react";
import CollegeViewer from "@/components/college-viewer/CollegeViewer";

export default function CollegeDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><div className="animate-spin h-10 w-10 border-2 border-brand-orange rounded-full border-t-transparent"></div></div>}>
            <CollegeViewer />
        </Suspense>
    );
}
