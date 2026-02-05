"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/api/axios';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShareAlt } from 'react-icons/fa';

const NewsDetailContent: React.FC = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!slug) return;
            
            setLoading(true);
            try {
                const res = await api.get(`/articles/${slug}`);
                if (res.data.success) {
                    setArticle(res.data.data);
                    
                    // Fetch related articles in the same category
                    if (res.data.data.category) {
                        const relatedRes = await api.get('/articles');
                        if (relatedRes.data.success) {
                            const related = relatedRes.data.data
                                .filter((a: any) => a.category === res.data.data.category && a._id !== res.data.data._id)
                                .slice(0, 3);
                            setRelatedArticles(related);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-blue border-t-transparent"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h1>
                <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
                <Link href="/tools/news" className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition">
                    Back to News
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Back Button */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/tools/news" className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-dark font-medium transition">
                        <FaArrowLeft /> Back to News
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Article Header */}
                <div className="mb-8">
                    {/* <div className="inline-block bg-brand-blue/10 text-brand-blue px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                        {article.category}
                    </div> */}
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6 leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                        <span className="flex items-center gap-2">
                            <FaCalendarAlt className="text-brand-orange" />
                            {new Date(article.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </span>
                        <span className="flex items-center gap-2">
                            <FaUser className="text-brand-orange" />
                            {article.author || 'CollegeDost Team'}
                        </span>
                        <button className="ml-auto flex items-center gap-2 text-brand-blue hover:text-brand-blue-dark transition">
                            <FaShareAlt /> Share
                        </button>
                    </div>
                </div>

                {/* Featured Image */}
                {article.image ? (
                    <div className="mb-10 rounded-2xl overflow-hidden shadow-lg bg-linear-to-br from-brand-blue/10 to-brand-orange/10">
                        <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-auto max-h-125 object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.parentElement) {
                                    const placeholder = document.createElement('div');
                                    placeholder.className = 'flex items-center justify-center py-20';
                                    placeholder.innerHTML = `
                                        <div class="text-center">
                                            <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p class="text-gray-400 font-medium">Image not available</p>
                                        </div>
                                    `;
                                    e.currentTarget.parentElement.appendChild(placeholder);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="mb-10 rounded-2xl overflow-hidden shadow-lg bg-linear-to-br from-brand-blue/10 to-brand-orange/10">
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-400 font-medium">Image not available</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Article Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    {article.summary && (
                        <p className="text-xl text-gray-700 font-medium mb-8 leading-relaxed border-l-4 border-brand-orange pl-6 italic">
                            {article.summary}
                        </p>
                    )}
                    
                    <div 
                        className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: article.content || article.description || '' }}
                    />
                </div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map(related => (
                                <Link 
                                    key={related._id} 
                                    href={`/tools/news/${related.slug}`}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group"
                                >
                                    <div className="h-40 overflow-hidden bg-linear-to-br from-brand-blue/10 to-brand-orange/10">
                                        {related.image ? (
                                            <>
                                                <img 
                                                    src={related.image} 
                                                    alt={related.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        if (e.currentTarget.nextElementSibling) {
                                                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                                        }
                                                    }}
                                                />
                                                <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                                                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs text-brand-blue font-bold mb-2">{related.category}</div>
                                        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition">
                                            {related.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsDetailContent;
