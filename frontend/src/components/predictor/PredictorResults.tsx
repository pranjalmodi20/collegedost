"use client";

import React from 'react';
import { FaArrowDown, FaSearch } from 'react-icons/fa';
import { CollegeResultCard } from './CollegeResultCard';
import type { PredictorResultsProps, SortOption } from './types';

export const PredictorResults: React.FC<PredictorResultsProps> = ({
  colleges,
  totalResults,
  sortBy,
  onSortChange,
  sortOptions,
  hasMore,
  onLoadMore,
  loading,
}) => {
  if (loading) {
    return (
      <section className="space-y-6" id="predictor-results" role="status" aria-label="Analyzing colleges for you">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Analyzing colleges for you...</p>
        </div>
      </section>
    );
  }

  if (totalResults === 0 && colleges.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6" id="predictor-results">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-800">
          Found {totalResults} College{totalResults !== 1 ? 's' : ''} for you
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent border-0 text-sm font-bold text-indigo-600 focus:ring-0 cursor-pointer outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* College Cards */}
      {colleges.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {colleges.map((college) => (
            <CollegeResultCard key={college.id} college={college} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <FaSearch className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            No matches with current filters
          </h3>
          <p className="text-sm text-slate-500">
            Try adjusting your filters or search criteria to see more results.
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={onLoadMore}
            className="bg-white border border-gray-200 px-8 py-3 rounded-2xl font-bold text-slate-800 hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            Load More Colleges <FaArrowDown className="text-xs" />
          </button>
        </div>
      )}
    </section>
  );
};
