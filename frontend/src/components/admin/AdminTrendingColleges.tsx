"use client";

import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FaPlus, FaTrash, FaUniversity, FaSearch, FaFire, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface College {
    _id: string;
    name: string;
    slug: string;
    location?: {
        city?: string;
        state?: string;
    };
    isTrending: boolean;
}

const AdminTrendingColleges: React.FC = () => {
    const [trendingColleges, setTrendingColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<College[]>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        fetchTrendingColleges();
    }, []);

    const fetchTrendingColleges = async (): Promise<void> => {
        try {
            setLoading(true);
            const res = await api.get('/colleges', { params: { trending: 'true', limit: 100 } });
            if (res.data.success) {
                setTrendingColleges(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching trending colleges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (val: string) => {
        setSearchQuery(val);
        if (val.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const res = await api.get('/colleges', { params: { search: val, limit: 10 } });
            if (res.data.success) {
                // Filter out those already in trendingColleges
                const filteredResults = res.data.data.filter(
                    (c: College) => !trendingColleges.some(tc => tc._id === c._id)
                );
                setSearchResults(filteredResults);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    const toggleTrending = async (college: College, status: boolean) => {
        try {
            const res = await api.put(`/colleges/${college._id}`, { isTrending: status });
            if (res.data.success) {
                if (status) {
                    setTrendingColleges(prev => [...prev, { ...college, isTrending: true }]);
                    setShowSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                } else {
                    setTrendingColleges(prev => prev.filter(c => c._id !== college._id));
                }
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update trending status');
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaFire className="text-orange-600" /> Trending Colleges
                    </h1>
                    <p className="text-gray-500 text-sm">Manage colleges appearing in the "Trending" section on homepage</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={() => setShowSearch(true)}
                        className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                        <FaPlus /> Add College
                    </button>
                </div>
            </div>

            {/* Search Modal Overlay */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSearch(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-lg">Search & Add College</h3>
                                <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600 uppercase text-xs font-bold flex items-center gap-1">
                                    <FaTimes /> Close
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="relative mb-6">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Type college name..."
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                    {searching ? (
                                        <div className="py-8 text-center text-gray-400">Searching...</div>
                                    ) : (
                                        searchResults.length > 0 ? (
                                            searchResults.map(college => (
                                                <div key={college._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-brand-orange/5 border border-gray-100 group transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                            <FaUniversity />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm text-gray-900 line-clamp-1">{college.name}</div>
                                                            <div className="text-xs text-gray-500">{college.location?.city}, {college.location?.state}</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleTrending(college, true)}
                                                        className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            searchQuery.length > 1 ? (
                                                <div className="py-8 text-center text-gray-500 italic">No colleges found</div>
                                            ) : (
                                                <div className="py-8 text-center text-gray-400 flex flex-col items-center gap-2">
                                                    <FaUniversity className="text-3xl opacity-20" />
                                                    <span className="text-sm">Enter at least 2 characters to search</span>
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">College Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Location</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {trendingColleges.map((college, index) => (
                                <motion.tr
                                    key={college._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{college.name}</div>
                                        <div className="text-xs text-gray-500">Slug: {college.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">{college.location?.city}, {college.location?.state}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => toggleTrending(college, false)}
                                                className="text-gray-400 hover:text-red-600 flex items-center gap-1 text-xs font-bold uppercase transition-all"
                                                title="Remove from Trending"
                                            >
                                                <FaTrash /> Remove
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {trendingColleges.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <FaFire className="text-3xl opacity-10" />
                                            <span>No trending colleges found. Add some to get started!</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminTrendingColleges;
