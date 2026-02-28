"use client";

import React, { useState, useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt, FaClock, FaHistory } from 'react-icons/fa';
import api from '@/api/axios';
import { motion, AnimatePresence } from 'framer-motion';

interface JourneyItem {
    url: string;
    timestamp: string;
}

interface UserJourneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
    userName: string | null;
}

const UserJourneyModal: React.FC<UserJourneyModalProps> = ({ isOpen, onClose, userId, userName }) => {
    const [journey, setJourney] = useState<JourneyItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen && userId) {
            fetchJourney();
        } else {
            setJourney([]);
        }
    }, [isOpen, userId]);

    const fetchJourney = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/users/${userId}/journey`);
            if (res.data.success) {
                // Reverse to show most recent first
                setJourney(res.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching user journey:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center">
                                <FaHistory />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Site Journey</h2>
                                <p className="text-sm text-gray-500">{userName || 'User'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mb-4"></div>
                                <p className="text-gray-500">Loading journey data...</p>
                            </div>
                        ) : journey.length > 0 ? (
                            <div className="space-y-6">
                                {journey.map((item, index) => (
                                    <div key={index} className="flex gap-4 relative">
                                        {index !== journey.length - 1 && (
                                            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-100 -mb-6" />
                                        )}
                                        <div className="z-10 bg-white p-1">
                                            <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-bold ring-4 ring-white">
                                                {journey.length - index}
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <FaClock className="text-xs" />
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </div>
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 bg-white text-gray-400 hover:text-brand-blue rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="View Page"
                                                >
                                                    <FaExternalLinkAlt size={12} />
                                                </a>
                                            </div>
                                            <div className="font-medium text-gray-900 break-all">
                                                {item.url}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                <div className="text-4xl mb-4">🚶</div>
                                <p>No journey data found for this user.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 text-right">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UserJourneyModal;
