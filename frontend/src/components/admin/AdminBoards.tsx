"use client";

import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaGlobe, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Board {
    _id: string;
    boardName: string;
    boardSlug: string;
    isTop: boolean;
    createdAt: string;
}

const AdminBoards: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async (): Promise<void> => {
        try {
            const res = await api.get('/boards');
            if (res.data.success) {
                setBoards(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching boards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string): Promise<void> => {
        if (window.confirm('Are you sure you want to delete this board?')) {
            try {
                await api.delete(`/boards/${id}`);
                setBoards(boards.filter(b => b._id !== id));
            } catch (error) {
                console.error('Error deleting board:', error);
                alert('Failed to delete board');
            }
        }
    };

    const filteredBoards = boards.filter(board =>
        (board.boardName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (board.boardSlug || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaGlobe className="text-blue-600" /> Boards Management
                    </h1>
                    <p className="text-gray-500 text-sm">Manage entries for "Top Boards" and board detail guides</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search boards..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue/20 w-full md:w-64"
                    />
                    <Link href="/admin/top-boards/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <FaPlus /> Add Board
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Board Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Slug</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-center">Featured</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredBoards.map((board, index) => (
                            <motion.tr
                                key={board._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{board.boardName}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-500">{board.boardSlug}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {board.isTop ? (
                                        <span className="text-amber-500 flex justify-center" title="Featured on home page">
                                            <FaStar />
                                        </span>
                                    ) : (
                                        <span className="text-gray-300 flex justify-center">
                                            <FaStar />
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link href={`/boards/${board.boardSlug}`} target="_blank" className="text-gray-400 hover:text-brand-blue" title="View Page">
                                            <FaExternalLinkAlt />
                                        </Link>
                                        <Link href={`/admin/top-boards/edit/${board._id}`} className="text-gray-400 hover:text-green-600" title="Edit">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(board._id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        {filteredBoards.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No boards found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminBoards;
