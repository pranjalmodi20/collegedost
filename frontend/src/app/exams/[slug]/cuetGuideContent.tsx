"use client";

import React from 'react';
import { FaInfoCircle, FaCalendarAlt, FaQuestionCircle, FaHistory, FaUserGraduate, FaListUl, FaBookOpen, FaClipboardCheck, FaUniversity, FaPoll, FaHandshake, FaCut, FaPhoneAlt } from 'react-icons/fa';

const CUETGuideContent: React.FC = () => {
    return (
        <article className="max-w-4xl mx-auto space-y-16 py-12 px-6 bg-white rounded-3xl shadow-2xl shadow-purple-50 border border-gray-100">

            {/* Table of Contents Section */}
            <nav className="p-8 bg-purple-50 rounded-2xl border border-purple-100">
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <FaListUl className="text-purple-600" />
                    Table of Contents
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm font-bold text-gray-600">
                    {[
                        "CUET UG Highlights", "CUET 2026 Exam Dates & Schedule", "What is CUET?", "What Is CUET Full Form?",
                        "CUET UG Exam: Over the Years", "Who Can Appear for CUET Exam?", "CUET UG Application Process",
                        "CUET UG Subjects List", "CUET Syllabus", "CUET Exam Pattern", "CUET Admission Process",
                        "CUET UG Participating Universities", "CUET UG Result", "What After CUET Results?",
                        "CUET UG Counselling Process", "CUET 2026 Cut Off", "NTA CUET Contact Information", "Other FAQs"
                    ].map((item, i) => (
                        <li key={i} className="hover:text-purple-600 transition cursor-pointer flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-300"></div>
                            {item}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* 1. Highlights */}
            <section id="highlights" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaInfoCircle />
                    </div>
                    CUET UG Highlights
                </h2>
                <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { key: "Exam Name", value: "Common University Entrance Test (CUET UG)" },
                                { key: "Conducting Body", value: "National Testing Agency (NTA)" },
                                { key: "Exam Level", value: "National" },
                                { key: "Frequency", value: "Once a year" },
                                { key: "Exam Mode", value: "Computer Based Test (CBT)" },
                                { key: "Languages", value: "13 Languages" },
                                { key: "Official Website", value: "cuet.samarth.ac.in" }
                            ].map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                    <td className="px-6 py-4 font-bold text-gray-900 w-1/3">{row.key}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 2. Dates */}
            <section id="dates" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaCalendarAlt />
                    </div>
                    CUET 2026 Exam Dates & Schedule
                </h2>
                <div className="grid gap-6">
                    {[
                        { event: "CUET 2026 Registration Re-opened", date: "Feb 24 - Feb 26, 2026", status: "Closed" },
                        { event: "Release of CUET City Intimation Slip", date: "First Week of May 2026", status: "Upcoming" },
                        { event: "Release of CUET Admit Card", date: "Second Week of May 2026", status: "Upcoming" },
                        { event: "CUET UG 2026 Exam Window", date: "May 11 - May 31, 2026", status: "Upcoming" },
                        { event: "Declaration of CUET Result", date: "June 30, 2026 (Tentative)", status: "Upcoming" }
                    ].map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition group">
                            <div>
                                <h4 className="font-black text-gray-900 group-hover:text-purple-600 transition">{d.event}</h4>
                                <span className="text-sm font-medium text-gray-500">{d.date}</span>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${d.status === 'Closed' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                }`}>
                                {d.status}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3 & 4. Intro & Full Form */}
            <section id="intro" className="scroll-mt-20 space-y-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <FaQuestionCircle />
                        </div>
                        What is CUET?
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        The <strong>Common University Entrance Test (CUET)</strong> is an all-India test organized by the National Testing Agency for admission to various Undergraduate, Integrated, Postgraduate, Diploma, Certification, and Research programmes in 45 Central Universities of India. It has replaced several individual university entrance exams to provide a level playing field for students across the country.
                    </p>
                </div>
                <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">What Is CUET Full Form?</h3>
                    <p className="text-blue-800 font-medium">
                        The full form of CUET is <strong>Common University Entrance Test</strong>. It was previously known as CUCET (Central Universities Common Entrance Test).
                    </p>
                </div>
            </section>

            {/* 5. Evolution */}
            <section id="evolution" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaHistory />
                    </div>
                    CUET UG Exam: Over the Years
                </h2>
                <div className="relative border-l-2 border-indigo-100 pl-8 space-y-12 py-4">
                    {[
                        { year: "2010 - 2020", title: "CUCET Origins", desc: "Started as a small-scale exam for 7-10 participating central universities." },
                        { year: "2021", title: "NTA Takes Over", desc: "NTA assumed responsibility for conducting CUCET to ensure a more standardized process." },
                        { year: "2022", title: "The CUET Revolution", desc: "Mandated for all Central Universities. Reached 10 lakh+ applicants instantly." },
                        { year: "2024 - 2026", title: "Scale and Refinement", desc: "Hybrid mode (OMR + CBT) introduced, 300+ universities joining, surpassing JEE and NEET in candidate count." }
                    ].map((step, i) => (
                        <div key={i} className="relative">
                            <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow"></div>
                            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest block mb-2">{step.year}</span>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Who can appear */}
            <section id="eligibility" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaUserGraduate />
                    </div>
                    Who Can Appear for CUET Exam?
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 bg-gray-50 rounded-3xl">
                        <h4 className="font-black text-gray-900 mb-4">Educational Qualification</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex gap-2"><span className="text-green-500">✔</span> Completed Class 12 or appearing in the current year.</li>
                            <li className="flex gap-2"><span className="text-green-500">✔</span> Any stream (Science/Commerce/Arts) can apply for relevant domain subjects.</li>
                        </ul>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-3xl">
                        <h4 className="font-black text-gray-900 mb-4">Age Limit</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex gap-2"><span className="text-green-500">✔</span> There is no age limit for appeared candidates in CUET UG.</li>
                            <li className="flex gap-2"><span className="text-green-500">✔</span> However, candidates must fulfill the age criteria of their target university.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 7. Application */}
            <section id="application" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaClipboardCheck />
                    </div>
                    CUET UG Application Process
                </h2>
                <div className="space-y-6">
                    {[
                        { step: "1", title: "Registration", desc: "Visit cuet.samarth.ac.in and register with basic details like name, email, and mobile number." },
                        { step: "2", title: "Application Form", desc: "Fill in academic details, personal info, and choose your preferred exam centers." },
                        { step: "3", title: "Document Upload", desc: "Upload scanned photograph (10kb-200kb) and signature (4kb-30kb) in JPG/JPEG format." },
                        { step: "4", title: "Slot/Subject Selection", desc: "Choose your Language, Domain subjects, and General Test based on university requirements." },
                        { step: "5", title: "Fee Payment", desc: "Pay the application fee via online mode (UPI, Net Banking, Credit/Debit Card)." }
                    ].map((s, i) => (
                        <div key={i} className="flex gap-6 items-start">
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-purple-200">
                                {s.step}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 8 & 9. Subjects & Syllabus */}
            <section id="syllabus" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaBookOpen />
                    </div>
                    CUET Syllabus & Subject List
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100">
                        <h4 className="font-black text-pink-900 mb-3">Section IA & IB</h4>
                        <p className="text-xs text-pink-700 leading-relaxed">
                            <strong>Languages:</strong> 13 in IA and 20 in IB. Proficiency tested through Reading Comprehension, Literary Aptitude, and Vocabulary.
                        </p>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <h4 className="font-black text-indigo-900 mb-3">Section II (Domains)</h4>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                            <strong>27 Domain Subjects:</strong> Based on NCERT Class 12 syllabus only. Common subjects include Physics, Maths, Accountancy, Sociology, etc.
                        </p>
                    </div>
                    <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                        <h4 className="font-black text-orange-900 mb-3">Section III (General)</h4>
                        <p className="text-xs text-orange-700 leading-relaxed">
                            <strong>General Knowledge:</strong> Current Affairs, Mental Ability, Numerical Ability, Logical & Analytical Reasoning.
                        </p>
                    </div>
                </div>
            </section>

            {/* 10. Pattern */}
            <section id="pattern" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaClipboardCheck />
                    </div>
                    CUET Exam Pattern
                </h2>
                <div className="bg-gray-900 text-white p-10 rounded-3xl shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-orange-400 font-black mb-4 tracking-wider text-sm uppercase">Marking Scheme</h4>
                            <ul className="space-y-4">
                                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                                    <span className="font-bold">Correct Answer</span>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg">+5 Marks</span>
                                </li>
                                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                                    <span className="font-bold">Wrong Answer</span>
                                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg">-1 Mark</span>
                                </li>
                                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                                    <span className="font-bold">Unanswered</span>
                                    <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-lg">0 Marks</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-blue-400 font-black mb-4 tracking-wider text-sm uppercase">Quick Stats</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Candidates can choose a maximum of 6 subjects (4-5 domain subjects, or 3 domain + General Test). The exam is usually conducted in hybrid mode.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 11 & 12 Universities */}
            <section id="universities" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaUniversity />
                    </div>
                    Participating Universities
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { type: "Central", count: "45+", color: "bg-emerald-50", text: "text-emerald-700" },
                        { type: "State", count: "37+", color: "bg-blue-50", text: "text-blue-700" },
                        { type: "Deemed", count: "32+", color: "bg-purple-50", text: "text-purple-700" },
                        { type: "Private", count: "130+", color: "bg-pink-50", text: "text-pink-700" }
                    ].map((item, i) => (
                        <div key={i} className={`p-6 ${item.color} rounded-2xl border hover:shadow-md transition text-center`}>
                            <h4 className={`text-sm uppercase font-black tracking-widest ${item.text} mb-2`}>{item.type}</h4>
                            <span className="text-2xl font-black text-gray-900">{item.count}</span>
                        </div>
                    ))}
                </div>
                <p className="mt-8 text-sm text-gray-500 text-center italic">
                    Major names: DU, BHU, JNU, AMU, JMI, University of Hyderabad, Visva-Bharati, etc.
                </p>
            </section>

            {/* 13 & 14 Results */}
            <section id="result" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaPoll />
                    </div>
                    CUET UG Result
                </h2>
                <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h4 className="font-bold text-amber-900 mb-2">Announcement & Normalization</h4>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            Results are declared in percentile scores. Since the exam is held in multiple shifts, the Equipercentile Method is used for normalization to ensure fairness across difficulty levels.
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 shrink-0">
                        <span className="block text-xs font-bold text-gray-400 mb-1">Check at</span>
                        <span className="font-black text-amber-600">exams.nta.ac.in/CUET-UG/</span>
                    </div>
                </div>
            </section>

            {/* 15. Counselling */}
            <section id="counselling" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaHandshake />
                    </div>
                    CUET UG Counselling Process
                </h2>
                <div className="space-y-4">
                    <div className="p-6 border-l-4 border-cyan-500 bg-gray-50 rounded-r-2xl">
                        <h4 className="font-bold text-gray-900 mb-1">Phase 1: Registration</h4>
                        <p className="text-sm text-gray-600">Candidates must register separately on individual university portals (e.g., DU CSAS portal) using their CUET application number.</p>
                    </div>
                    <div className="p-6 border-l-4 border-cyan-300 bg-gray-50 rounded-r-2xl">
                        <h4 className="font-bold text-gray-900 mb-1">Phase 2: Preference Filling</h4>
                        <p className="text-sm text-gray-600">Selecting college and course combinations in order of priority.</p>
                    </div>
                    <div className="p-6 border-l-4 border-cyan-100 bg-gray-50 rounded-r-2xl">
                        <h4 className="font-bold text-gray-900 mb-1">Phase 3: Allocation & Admission</h4>
                        <p className="text-sm text-gray-600">Seat allocation based on merit, availability, and preferences. Acceptance and fee payment follow.</p>
                    </div>
                </div>
            </section>

            {/* 16. Cut Off */}
            <section id="cutoff" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaCut />
                    </div>
                    CUET 2026 Cut Off
                </h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                        <h4 className="font-black text-gray-900">Determining Factors:</h4>
                        <ul className="grid gap-2 text-gray-600 font-medium">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-rose-400"></div> Difficulty Level of Exam</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-rose-400"></div> Total Number of Applicants</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-rose-400"></div> Availability of Seats in Universities</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-rose-400"></div> Category-wise Reservation Policies</li>
                        </ul>
                    </div>
                    <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                        <p className="font-medium text-rose-900 italic">
                            "Popular colleges like SRCC or Hindu College (DU) typically see cutoffs as high as 99+ percentile or 780+/800 marks for top courses like B.Com (Hons) or Economics (Hons)."
                        </p>
                    </div>
                </div>
            </section>

            {/* 17. Contact */}
            <section id="contact" className="scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaPhoneAlt />
                    </div>
                    NTA CUET Contact Information
                </h2>
                <div className="p-8 bg-gray-100 rounded-3xl grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Official Channels</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex flex-col">
                                <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Helpline Number</span>
                                <span className="text-gray-900">011-40759000 / 011-69227700</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Official Email</span>
                                <span className="text-gray-900">cuet-ug@nta.ac.in</span>
                            </li>
                        </ul>
                    </div>
                    <div className="text-xs text-gray-500 flex flex-col justify-end">
                        <p className="leading-relaxed">
                            NTA encourages candidates to only follow updates on the official website: <strong>https://cuet.samarth.ac.in</strong>. Avoid misinformation from unauthorized social media handles.
                        </p>
                    </div>
                </div>
            </section>

            {/* 18. FAQs */}
            <section id="faqs" className="scroll-mt-20 pb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaQuestionCircle />
                    </div>
                    Other FAQs on CUET UG
                </h2>
                <div className="space-y-4">
                    {[
                        { q: "Can I apply for CUET in offline mode?", a: "No, the application process is strictly online through the official website." },
                        { q: "Is the General Test compulsory for everyone?", a: "No, it depends on the eligibility criteria of the specific university and course you are targeting." },
                        { q: "What is the medium of the CUET UG exam?", a: "The exam is conducted in 13 languages: English, Hindi, Assamese, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu, and Urdu." },
                        { q: "Is there any change in the syllabus for 2026?", a: "The syllabus continues to be based on NCERT Class 12 topics for domain subjects." }
                    ].map((faq, i) => (
                        <details key={i} className="group p-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition cursor-pointer">
                            <summary className="font-bold text-gray-900 flex justify-between items-center list-none">
                                {faq.q}
                                <span className="text-purple-600 transition group-open:rotate-180">▼</span>
                            </summary>
                            <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                                {faq.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

        </article>
    );
};

export default CUETGuideContent;
