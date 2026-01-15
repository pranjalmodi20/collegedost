import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const PillSection = ({ title, items, color = "border-gray-200" }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <a href="#" className="flex items-center gap-2 text-sm font-semibold text-brand-orange hover:translate-x-1 transition-transform">
          View All <FaArrowRight />
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <a 
            key={index} 
            href={item.link}
            className={`flex items-center justify-center text-center px-4 py-3 bg-white border ${color} rounded-lg text-sm font-medium text-gray-700 hover:border-brand-orange hover:text-brand-orange hover:shadow-md transition-all duration-300`}
          >
            {item.name}
          </a>
        ))}
      </div>
    </section>
  );
};

export default PillSection;
