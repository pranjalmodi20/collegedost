import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const PillSection = ({ title, items, color = "border-gray-200" }) => {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-brand-orange pl-3">{title}</h2>
        <a href="#" className="flex items-center gap-2 text-sm font-bold text-brand-orange bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors group">
          View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, index) => (
          <a 
            key={index} 
            href={item.link}
            className="group relative flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-orange/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="relative z-10 font-semibold text-gray-700 group-hover:text-brand-blue transition-colors text-sm md:text-base pr-4">
              {item.name}
            </span>
            
            <span className="relative z-10 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-sm">
               <FaArrowRight className="text-xs" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PillSection;
