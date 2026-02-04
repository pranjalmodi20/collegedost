"use client";
import React from 'react';
// @ts-expect-error - Legacy component without types
import PostArticle from '@/app/pages/admin/PostArticle';

export default function Page() {
    return <PostArticle />;
}
