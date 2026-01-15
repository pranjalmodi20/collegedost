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
    <section className="bg-brand-blue py-12 mb-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || FaUniversity;
            return (
              <div key={index} className="flex items-center justify-center gap-4 border-r last:border-r-0 border-white/10">
                <div className="text-4xl text-brand-orange opacity-80">
                  <Icon />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl md:text-3xl font-bold leading-none mb-1">{item.count}</h3>
                  <p className="text-sm text-white/70 uppercase tracking-wider">{item.label}</p>
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
