import React from 'react';
import { latestNews } from '../data';
import { FaBolt } from 'react-icons/fa';

const NewsSection = () => {
  return (
    <div className="bg-[#0b1e3f] border-y border-white/10 py-3 overflow-hidden relative">
      <div className="container mx-auto px-4 flex items-center">
        <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 mr-6 flex-shrink-0 shadow-lg z-10 relative">
          <FaBolt /> LATEST NEWS
        </div>
        <div className="flex-1 overflow-hidden relative mask-linear-gradient">
          <div className="flex gap-8 animate-scroll w-max hover:paused">
            {[...latestNews, ...latestNews].map((news, idx) => (
              <a href="#" key={idx} className="text-sm text-gray-300 font-medium flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap">
                <span className="text-yellow-400 text-xs leading-none">●</span>
                {news}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
