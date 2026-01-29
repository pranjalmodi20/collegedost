import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaBalanceScale, FaUniversity } from 'react-icons/fa';

const CompareColleges = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Helmet>
                <title>Compare Colleges | CollegeDost</title>
                <meta name="description" content="Compare top colleges in India based on ranking, fees, placements, and courses." />
            </Helmet>

            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-12">
                     <span className="bg-blue-100 text-brand-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Comparison Tool</span>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Compare Colleges Side by Side</h1>
                    <p className="text-gray-600">Select colleges to compare their fees, placements, rankings, and facilities to make the best decision for your future.</p>
                </div>

                {/* Placeholder UI for Comparison */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center py-20">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaBalanceScale className="text-4xl text-brand-blue" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Comparison Tool Coming Soon!</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">We are building an advanced comparison engine to help you analyze colleges detailedly. Stay tuned!</p>
                    
                    <div className="flex justify-center gap-4">
                        <Link to="/colleges" className="px-6 py-3 bg-brand-orange text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition flex items-center gap-2">
                           <FaUniversity /> Browse Colleges
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompareColleges;
