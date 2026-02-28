"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';

/**
 * Component that tracks the user's path changes and sends them to the backend.
 * Only tracks for logged-in users.
 */
export default function UserJourneyTracker() {
    const pathname = usePathname();
    const { user } = useAuth();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        // Only track if user is logged in and path has changed
        if (user && pathname && pathname !== lastTrackedPath.current) {
            const trackPath = async () => {
                try {
                    // Avoid tracking admin pages to keep journey clean or if specified
                    // For now, track everything as per requirement
                    await api.post('/users/journey', { url: pathname });
                    lastTrackedPath.current = pathname;
                } catch (error) {
                    console.error('Failed to track user journey:', error);
                }
            };

            trackPath();
        }
    }, [pathname, user]);

    return null; // This component doesn't render anything
}
