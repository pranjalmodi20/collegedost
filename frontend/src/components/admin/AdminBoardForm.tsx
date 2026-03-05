"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaSave, FaArrowLeft, FaGlobe } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import api from '@/api/axios';

interface BoardFormData {
    boardName: string;
    boardSlug: string;
    isTop: boolean;
}

const AdminBoardForm: React.FC = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEditMode = !!id;
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<BoardFormData>({
        boardName: '',
        boardSlug: '',
        isTop: false
    });

    useEffect(() => {
        if (isEditMode) {
            fetchBoard();
        }
    }, [id]);

    const fetchBoard = async (): Promise<void> => {
        try {
            setLoading(true);
            const res = await api.get(`/boards/${id}`);
            if (res.data.success) {
                const board = res.data.data;
                setFormData({
                    boardName: board.boardName,
                    boardSlug: board.boardSlug,
                    isTop: !!board.isTop
                });
            }
        } catch (error) {
            console.error('Error fetching board:', error);
            alert('Failed to fetch details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await api.put(`/boards/${id}`, formData);
                alert('Board updated successfully!');
            } else {
                await api.post('/boards', formData);
                alert('Board added successfully!');
            }

            router.push('/admin/top-boards');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to save board');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/top-boards" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Board' : 'Add New Board'}</h1>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold">Board Name</label>
                                <input
                                    type="text"
                                    name="boardName"
                                    required
                                    value={formData.boardName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                    placeholder="e.g. CBSE 12th"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold">Board Slug</label>
                                <input
                                    type="text"
                                    name="boardSlug"
                                    required
                                    value={formData.boardSlug}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                    placeholder="e.g. cbse-12th"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <input
                                type="checkbox"
                                id="isTop"
                                name="isTop"
                                checked={formData.isTop}
                                onChange={handleChange}
                                className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange border-gray-300 shadow-xs"
                            />
                            <label htmlFor="isTop" className="text-sm font-bold text-gray-800 cursor-pointer">
                                Featured Board (Show on home page)
                            </label>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-brand-orange text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : <><FaSave /> {isEditMode ? 'Update Board' : 'Save Board'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminBoardForm;
