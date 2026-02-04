"use client";
import React from 'react';
// @ts-expect-error - Legacy component without types
import AdminUsers from '@/app/pages/admin/AdminUsers';

export default function Page() {
    return <AdminUsers />;
}
