"use client";

import React from 'react';
import Link from 'next/link';

const courses = [
    { name: 'After 12th - Science', link: '/courses/after-12th-science' },
    { name: 'After 12th - Arts', link: '/courses/after-12th-arts' },
    { name: 'After 12th - Commerce', link: '/courses/after-12th-commerce' },
    { name: 'B.Ed', link: '/courses/bed' },
    { name: 'D.El.Ed (Diploma in Elementary Education)', link: '/courses/deled' },
    { name: 'Early Childhood Care & Education (ECCE)', link: '/courses/ecce' },
    { name: 'B Tech (Bachelor of Technology)', link: '/courses/btech' },
    { name: 'MBA (Masters of Business Administration)', link: '/courses/mba' },
    { name: 'Company Secretary', link: '/courses/cs' },
    { name: 'BCA (Bachelor of Computer Applications)', link: '/courses/bca' },
    { name: 'BBA (Bachelor of Business Administration)', link: '/courses/bba' },
    { name: 'B.Sc Nursing', link: '/courses/bsc-nursing' },
    { name: 'Nursery Teacher Training (NTT)', link: '/courses/ntt' },
    { name: 'B.A (Bachelor of Arts)', link: '/courses/ba' },
    { name: 'LL.B.', link: '/courses/llb' },
    { name: 'D.Ed (Diploma in Education)', link: '/courses/ded' },
    { name: 'BSc', link: '/courses/bsc' },
    { name: 'MSW (Master of Social Work)', link: '/courses/msw' },
    { name: 'Chartered Accountancy', link: '/courses/ca' },
    { name: 'B.P.Ed (Bachelor of Physical Education)', link: '/courses/bped' }
];

const TrendingCourses: React.FC = () => {
    return (
        <section className="mt-16 mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Courses</h2>
            <div className="flex flex-wrap gap-3">
                {courses.map((course, index) => (
                    <Link
                        key={index}
                        href={course.link}
                        className="px-6 py-2.5 rounded-full border border-blue-400 text-blue-600 font-medium hover:bg-blue-50 transition-colors whitespace-nowrap text-sm"
                    >
                        {course.name}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TrendingCourses;
