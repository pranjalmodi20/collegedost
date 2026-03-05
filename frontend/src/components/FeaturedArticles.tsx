"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/api/axios';

interface Article {
    _id: string;
    title: string;
    slug: string;
    category: string;
}

const FeaturedArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedArticles = async () => {
            try {
                const res = await api.get('/articles?isFeatured=true&limit=10');
                if (res.data.success) {
                    setArticles(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching featured articles:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedArticles();
    }, []);

    if (loading) {
        return (
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Featured Articles</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-10 w-40 bg-gray-100 animate-pulse rounded-full"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (articles.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Featured Articles</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {articles.map((article) => (
                    <Link
                        key={article._id}
                        href={`/tools/news/${article.slug}`}
                        className="px-6 py-2 rounded-full border border-orange-400 text-orange-700 hover:bg-orange-50 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                        {article.title}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FeaturedArticles;
