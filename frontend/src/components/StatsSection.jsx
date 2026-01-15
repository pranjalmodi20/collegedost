import React from 'react';
import { FaUniversity, FaBookOpen, FaTabletAlt, FaUsers } from 'react-icons/fa';

const iconMap = {
  FaUniversity: FaUniversity,
  FaBookOpen: FaBookOpen,
  FaTabletAlt: FaTabletAlt,
  FaUsers: FaUsers
};

const StatsSection = ({ items }) => {
  return (
    <section className="relative py-16 mb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || FaUniversity;
            return (
              <div key={index} className="flex items-center gap-5 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-2xl text-white shadow-lg shadow-orange-500/30">
                  <Icon />
                </div>
                <div className="text-left">
                  <h3 className="text-3xl font-bold leading-none mb-1 text-white">{item.count}</h3>
                  <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
