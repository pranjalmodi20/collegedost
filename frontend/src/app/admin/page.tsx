"use client";
import React from 'react';
// @ts-expect-error - Legacy component without types
import AdminDashboard from '@/app/pages/admin/AdminDashboard';

export default function AdminPage() {
  return <AdminDashboard />;
}
