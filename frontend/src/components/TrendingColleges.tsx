"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/api/axios';

interface TrendingCollege {
    _id: string;
    name: string;
    slug: string;
}

const TrendingColleges: React.FC = () => {
    const [colleges, setColleges] = useState<TrendingCollege[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingColleges = async () => {
            try {
                const res = await api.get('/colleges?trending=true&limit=20');
                if (res.data.success) {
                    setColleges(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching trending colleges:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrendingColleges();
    }, []);

    if (loading) {
        return (
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Trending Colleges &amp; Universities</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-10 w-36 bg-gray-100 animate-pulse rounded-full"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (colleges.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Trending Colleges &amp; Universities</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {colleges.map((college) => (
                    <Link
                        key={college._id}
                        href={`/colleges/${college.slug}`}
                        className="px-6 py-2 rounded-full border border-emerald-400 text-emerald-700 hover:bg-emerald-50 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                        {college.name}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TrendingColleges;
