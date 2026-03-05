"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/api/axios';

interface Board {
    _id: string;
    boardName: string;
    boardSlug: string;
}

const TopBoards: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const res = await api.get('/boards?isTop=true');
                if (res.data.success) {
                    setBoards(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching top boards:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBoards();
    }, []);

    if (loading) return null;
    if (boards.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Top Boards in India</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {boards.map((board) => (
                    <Link
                        key={board._id}
                        href={`/boards/${board.boardSlug}`}
                        className="px-6 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium whitespace-nowrap bg-white shadow-sm hover:shadow-md hover:border-brand-orange/30"
                    >
                        {board.boardName}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TopBoards;
