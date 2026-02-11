"use client";

import React from 'react';
import type { PredictorHeaderProps } from './types';

export const PredictorHeader: React.FC<PredictorHeaderProps> = ({
  title,
  subtitle,
  icon,
}) => (
  <header className="bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-800">
              {title}
            </h1>
            <p className="text-slate-500 mt-1">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Updates
          </div>
        </div>
      </div>
    </div>
  </header>
);
