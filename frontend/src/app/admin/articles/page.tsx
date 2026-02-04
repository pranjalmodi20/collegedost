"use client";
import React from 'react';
// @ts-expect-error - Legacy component without types
import AdminArticles from '@/app/pages/admin/AdminArticles';

export default function Page() {
    return <AdminArticles />;
}
