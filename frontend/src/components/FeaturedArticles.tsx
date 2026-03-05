"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/api/axios';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendarAlt, FaUser } from 'react-icons/fa';

interface Article {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    image?: string;
    author: string;
    createdAt: string;
}

const FeaturedArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedArticles = async () => {
            try {
                const res = await api.get('/articles?isFeatured=true&limit=4');
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

    if (loading) return null;
    if (articles.length === 0) return null;

    return (
        <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-primary">Featured Articles</h2>
                    <p className="text-gray-500 text-sm mt-1">Handpicked news and insights for your career</p>
                </div>
                <Link href="/tools/news" className="text-brand-orange font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    View All Updates <FaArrowRight className="text-xs" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.map((article, index) => (
                    <motion.div
                        key={article._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                    >
                        <Link href={`/tools/news/${article.slug}`} className="block relative aspect-video overflow-hidden">
                            <img
                                src={article.image || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop'}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="bg-brand-orange/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                    {article.category}
                                </span>
                            </div>
                        </Link>

                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-3 font-medium uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                    <FaCalendarAlt className="text-brand-orange/70" /> {new Date(article.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaUser className="text-brand-orange/70" /> {article.author}
                                </span>
                            </div>

                            <Link href={`/tools/news/${article.slug}`}>
                                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
                                    {article.title}
                                </h3>
                            </Link>

                            <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                                {article.summary}
                            </p>

                            <Link
                                href={`/tools/news/${article.slug}`}
                                className="text-sm font-bold text-gray-900 group-hover:text-brand-orange flex items-center gap-1.5 transition-all mt-auto"
                            >
                                Read More <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedArticles;
