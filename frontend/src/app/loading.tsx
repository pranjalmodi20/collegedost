import { HomePageSkeleton } from '@/components/ui';

/**
 * Global loading fallback for Next.js route transitions.
 * Shown automatically by Next.js when navigating between routes.
 */
export default function Loading() {
    return <HomePageSkeleton />;
}
