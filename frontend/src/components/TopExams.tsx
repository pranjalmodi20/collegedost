"use client";

import React from 'react';
import Link from 'next/link';

const exams = [
    { name: 'CUET', href: '/exams/cuet' },
    { name: 'MHT CET', href: '/exams/mht-cet' },
    { name: 'RRB Group D', href: '/exams/rrb-group-d' },
    { name: 'MAT', href: '/exams/mat' },
    { name: 'NEET', href: '/exams/neet' },
    { name: 'MHCET Law', href: '/exams/mhcet-law' },
    { name: 'UP B.Ed JEE', href: '/exams/up-bed-jee' },
    { name: 'SAT India', href: '/exams/sat-india' },
    { name: 'AIIMS Nursing', href: '/exams/aiims-nursing' },
    { name: 'MAH MCA CET', href: '/exams/mah-mca-cet' },
    { name: 'CA Final', href: '/exams/ca-final' },
    { name: 'JEE Main', href: '/exams/jee-main' },
    { name: 'JMI Entrance Exam', href: '/exams/jmi-entrance-exam' },
    { name: 'CUET-PG', href: '/exams/cuet-pg' },
    { name: 'CFA Exam', href: '/exams/cfa-exam' },
    { name: 'CUCET Chandigarh University', href: '/exams/cucet' },
    { name: 'CTET', href: '/exams/ctet' },
    { name: 'MAH CET', href: '/exams/mah-cet' },
    { name: 'NEET SS', href: '/exams/neet-ss' },
    { name: 'TSLAWCET', href: '/exams/tslawcet' },
    { name: 'MAH B.Ed CET', href: '/exams/mah-bed-cet' },
    { name: 'NIFT Entrance Exam', href: '/exams/nift' },
    { name: 'YCMOU', href: '/exams/ycmou' },
    { name: 'UP CNET', href: '/exams/up-cnet' },
    { name: 'NATA', href: '/exams/nata' },
    { name: 'CT SET', href: '/exams/ct-set' },
    { name: 'PUBDET', href: '/exams/pubdet' },
    { name: 'AMU Entrance Exam', href: '/exams/amu' },
    { name: 'IISER Entrance Exam', href: '/exams/iiser' },
    { name: 'AP POLYCET', href: '/exams/ap-polycet' },
];

const TopExams: React.FC = () => {
    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Exams this month</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {exams.map((exam) => (
                    <Link
                        key={exam.name}
                        href={exam.href}
                        className="px-6 py-2 rounded-full border border-purple-400 text-purple-700 hover:bg-purple-50 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                        {exam.name}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TopExams;
