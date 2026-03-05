"use client";

import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { FaListUl, FaInfoCircle, FaQuestionCircle, FaSpinner } from 'react-icons/fa';

interface GuideSection {
    id: string;
    title: string;
    content: string;
}

interface GuideHighlight {
    key: string;
    value: string;
}

interface GuideFAQ {
    question: string;
    answer: string;
}

interface GuideData {
    collegeName: string;
    sections: GuideSection[];
    highlights: GuideHighlight[];
    faqs: GuideFAQ[];
}

interface CollegeGuideProps {
    slug: string;
    collegeName: string;
    sectionRef: React.RefObject<HTMLDivElement | null>;
}

const CollegeGuideSection: React.FC<CollegeGuideProps> = ({ slug, collegeName, sectionRef }) => {
    const [guide, setGuide] = useState<GuideData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTocId, setActiveTocId] = useState<string>('');
    const [tocCollapsed, setTocCollapsed] = useState(false);

    useEffect(() => {
        const fetchGuide = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/colleges/${slug}/guide`, { timeout: 120000 });
                if (res.data.success) {
                    setGuide(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching college guide:', err);
                setError('Failed to generate college guide');
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchGuide();
    }, [slug]);

    const scrollToSection = (id: string) => {
        setActiveTocId(id);
        const el = document.getElementById(`college-section-${id}`);
        if (el) {
            const offset = 160;
            const elementPosition = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div ref={sectionRef} id="college-guide" className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
                <div className="flex flex-col items-center justify-center py-16 gap-5">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                        <FaSpinner className="absolute inset-0 m-auto text-blue-600 text-xl animate-pulse" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Generating {collegeName} Guide...</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            Our AI is crafting a comprehensive, detailed guide for {collegeName}. This may take 15-30 seconds on first load.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !guide) {
        return (
            <div ref={sectionRef} id="college-guide" className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
                <p className="text-gray-500 text-center py-10">Failed to load the guide. Please try refreshing the page.</p>
            </div>
        );
    }

    return (
        <div ref={sectionRef} id="college-guide" className="space-y-10">
            {/* Main Guide Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
                <article className="space-y-10">

                    {/* ═══ Table of Contents ═══ */}
                    <nav className="p-5 md:p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <button
                            onClick={() => setTocCollapsed(!tocCollapsed)}
                            className="w-full text-left flex items-center justify-between"
                        >
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-3">
                                <FaListUl className="text-blue-600" />
                                Table of Contents
                            </h2>
                            <span className={`text-blue-600 text-sm transition-transform ${tocCollapsed ? '' : 'rotate-180'}`}>▲</span>
                        </button>
                        {!tocCollapsed && (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm mt-5">
                                {guide.sections.map((section) => (
                                    <li
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`cursor-pointer flex items-center gap-2 transition hover:text-blue-600 ${activeTocId === section.id ? 'text-blue-600 font-bold' : 'text-gray-600 font-medium'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTocId === section.id ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
                                        {section.title}
                                    </li>
                                ))}
                                {guide.faqs && guide.faqs.length > 0 && (
                                    <li
                                        onClick={() => scrollToSection('faqs')}
                                        className="cursor-pointer flex items-center gap-2 transition hover:text-blue-600 text-gray-600 font-medium"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0"></div>
                                        {collegeName} FAQs
                                    </li>
                                )}
                            </ul>
                        )}
                    </nav>

                    {/* ═══ Highlights Table ═══ */}
                    {guide.highlights && guide.highlights.length > 0 && (
                        <section id="college-section-highlights">
                            <h2 className="text-2xl font-black text-gray-900 mb-5 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg text-sm">
                                    <FaInfoCircle />
                                </div>
                                {collegeName} Highlights
                            </h2>
                            <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-gray-100">
                                        {guide.highlights.map((row, i) => (
                                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                                <td className="px-6 py-4 font-bold text-gray-900 w-1/3">{row.key}</td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* ═══ All AI-Generated Sections ═══ */}
                    {guide.sections.map((section, i) => (
                        <section key={section.id} id={`college-section-${section.id}`} className="scroll-mt-40">
                            <h2 className="text-2xl font-black text-gray-900 mb-5 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg text-sm ${['bg-blue-600', 'bg-indigo-500', 'bg-orange-500', 'bg-green-500', 'bg-pink-500', 'bg-purple-500', 'bg-red-500', 'bg-cyan-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-teal-500', 'bg-violet-500', 'bg-lime-500', 'bg-sky-500', 'bg-gray-700', 'bg-fuchsia-500'][i % 17]
                                    }`}>
                                    {i + 1}
                                </div>
                                {section.title}
                            </h2>
                            <div
                                className="prose prose-blue max-w-none text-gray-700 leading-relaxed
                                    prose-headings:text-gray-900 prose-headings:font-bold
                                    prose-p:mb-4 prose-p:leading-relaxed
                                    prose-ul:space-y-2 prose-ol:space-y-2
                                    prose-li:text-gray-600
                                    prose-strong:text-gray-900
                                    prose-table:border prose-table:border-gray-200 prose-table:rounded-xl prose-table:overflow-hidden
                                    prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-100
                                    prose-th:px-4 prose-th:py-3 prose-th:bg-blue-50 prose-th:text-blue-900 prose-th:font-bold"
                                dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                        </section>
                    ))}

                    {/* ═══ FAQs ═══ */}
                    {guide.faqs && guide.faqs.length > 0 && (
                        <section id="college-section-faqs" className="scroll-mt-40">
                            <h2 className="text-2xl font-black text-gray-900 mb-5 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center text-white shadow-lg text-sm">
                                    <FaQuestionCircle />
                                </div>
                                {collegeName} FAQs
                            </h2>
                            <div className="space-y-4">
                                {guide.faqs.map((faq, i) => (
                                    <details key={i} className="group p-5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition cursor-pointer">
                                        <summary className="font-bold text-gray-900 flex justify-between items-center list-none">
                                            {faq.question}
                                            <span className="text-blue-600 transition group-open:rotate-180 shrink-0 ml-4">▼</span>
                                        </summary>
                                        <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                                            {faq.answer}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </div>
        </div>
    );
};

export default CollegeGuideSection;
