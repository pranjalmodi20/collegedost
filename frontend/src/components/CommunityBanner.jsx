import React from 'react';
import { FaUserPlus, FaArrowRight } from 'react-icons/fa';

const CommunityBanner = () => {
  return (
    <section className="mb-16">
      <div className="container mx-auto px-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center text-3xl">
              <FaUserPlus />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Join the Community</h2>
              <p className="text-gray-600 max-w-xl">
                Be part of India's largest student community. Ask questions, get answers, and connect with peers and experts.
              </p>
            </div>
          </div>
          
          <button className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all flex items-center gap-3">
            Join Now <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunityBanner;
