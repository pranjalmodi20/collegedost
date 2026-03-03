"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/api/axios';
import {
    FaBook, FaInfoCircle, FaCheckCircle, FaChevronDown,
    FaChevronUp, FaLightbulb, FaGraduationCap, FaMapMarkerAlt,
    FaArrowRight, FaFilter, FaSearch, FaHistory
} from 'react-icons/fa';

interface CourseSection {
    id: string;
    title: string;
    content: string;
}

interface CourseGuideData {
    courseName: string;
    sections: CourseSection[];
    highlights: { key: string; value: string }[];
    faqs: { question: string; answer: string }[];
}

export default function CourseContent() {
    const params = useParams();
    const slug = params?.slug as string;

    const [activeTab, setActiveTab] = useState('guide');
    const [guideData, setGuideData] = useState<CourseGuideData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [isSticky, setIsSticky] = useState(false);

    const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/courses/${slug}/guide`, { timeout: 60000 });
                if (response.data.success) {
                    setGuideData(response.data.data);
                }
            } catch (err: any) {
                console.error('Error fetching course guide:', err);
                setError(err.response?.data?.message || 'Failed to load course information.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchGuide();
        }
    }, [slug]);

    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) {
                const offset = navRef.current.getBoundingClientRect().top;
                setIsSticky(offset <= 80);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = sectionsRef.current[id];
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">Generating Your Course Guide...</h3>
                    <p className="text-gray-500 mt-2 max-w-md">Our AI is researching the latest updates for this course. This usually takes 15-30 seconds.</p>
                </div>
            </div>
        );
    }

    if (error || !guideData) {
        return (
            <div className="py-20 text-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl inline-block max-w-lg">
                    <FaInfoCircle className="text-3xl mx-auto mb-4" />
                    <h3 className="text-lg font-bold">Something went wrong</h3>
                    <p className="mt-2">{error || 'Could not load guide content.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* sticky sidebar container */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">

                    {/* Hero Intro */}
                    <div className="mb-10">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            {guideData.courseName} Guide 2025-2026
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Comprehensive information about {guideData.courseName} in India: Admissions, Eligibility, Top Colleges, Fees, and Career Prospects.
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <div ref={navRef} className="border-b border-gray-200 mb-8 sticky top-[72px] bg-white z-40 py-2">
                        <div className="flex gap-8 overflow-x-auto no-scrollbar">
                            {['guide', 'colleges', 'reviews', 'questions'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${activeTab === tab
                                        ? 'border-purple-600 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab === 'guide' ? 'Complete Guide' : tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'guide' ? (
                        <div className="space-y-12">
                            {/* Table of Contents Pill Box */}
                            <div className="bg-purple-50 rounded-2xl p-6 lg:p-8 border border-purple-100 shadow-sm mb-12">
                                <h2 className="text-lg font-bold text-purple-900 mb-6 flex items-center gap-2">
                                    <FaBook /> Table of Contents
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {guideData.sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className="text-left text-purple-700 hover:text-purple-900 hover:underline text-[15px] leading-snug truncate"
                                        >
                                            {section.title}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => scrollToSection('faqs')}
                                        className="text-left text-purple-700 hover:text-purple-900 hover:underline text-[15px] leading-snug truncate"
                                    >
                                        Frequently Asked Questions
                                    </button>
                                </div>
                            </div>

                            {/* Highlights Table */}
                            <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm mb-12">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <FaLightbulb className="text-yellow-500" /> Course Highlights
                                    </h3>
                                </div>
                                <table className="w-full text-left border-collapse">
                                    <tbody className="divide-y divide-gray-200">
                                        {guideData.highlights.map((h, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                <td className="px-6 py-4 font-bold text-gray-700 text-sm whitespace-nowrap w-1/3 border-r border-gray-200">
                                                    {h.key}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-sm">
                                                    {h.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Main Content Sections */}
                            <div className="space-y-16">
                                {guideData.sections.map((section) => (
                                    <div
                                        key={section.id}
                                        ref={(el) => { sectionsRef.current[section.id] = el }}
                                        className="scroll-mt-32"
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-100 flex items-center gap-3">
                                            <span className="w-2 h-8 bg-purple-600 rounded-full hidden md:block"></span>
                                            {section.title}
                                        </h3>
                                        <div
                                            className="prose prose-purple max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900"
                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* FAQS Section */}
                            <div
                                ref={(el) => { sectionsRef.current['faqs'] = el }}
                                className="scroll-mt-32 pt-8"
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-purple-600 rounded-full hidden md:block"></span>
                                    Frequently Asked Questions regarding {guideData.courseName}
                                </h3>
                                <div className="space-y-4">
                                    {guideData.faqs.map((faq, i) => (
                                        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
                                            <button
                                                className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            >
                                                <span className="font-bold text-gray-800 leading-tight">{faq.question}</span>
                                                {openFaq === i ? <FaChevronUp className="text-purple-600 flex-shrink-0" /> : <FaChevronDown className="text-gray-400 flex-shrink-0" />}
                                            </button>
                                            {openFaq === i && (
                                                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4 bg-gray-50/30 anim-fade-in">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium italic">Content for this tab is coming soon...</p>
                        </div>
                    )}
                </div>

                {/* Sidebar - Quick Nav & Top Colleges */}
                <aside className="lg:w-80 flex-shrink-0 space-y-8">

                    {/* Quick navigation - Sticky on Desktop */}
                    <div className="sticky top-24">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
                            <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <FaFilter className="text-purple-600 size-3" /> Quick Navigation
                            </h4>
                            <div className="space-y-3">
                                {guideData.sections.slice(0, 8).map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => scrollToSection(s.id)}
                                        className="w-full text-left text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 p-2.5 rounded-lg transition-all flex items-center gap-2 group"
                                    >
                                        <FaCheckCircle className="text-gray-300 group-hover:text-purple-500 size-3 transition-colors" />
                                        <span className="truncate">{s.title.replace(`${guideData.courseName} `, '')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Top Colleges Ad/Widget */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <h4 className="font-bold text-lg mb-2 relative z-10">Searching for Colleges?</h4>
                            <p className="text-purple-100 text-sm mb-6 relative z-10 font-medium">Get a list of top-ranked colleges for {guideData.courseName} matching your score.</p>
                            <button className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 relative z-10">
                                View Top Colleges <FaArrowRight size={12} />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
