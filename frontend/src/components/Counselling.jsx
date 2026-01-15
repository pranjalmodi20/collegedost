import React from 'react';
import { FaUserMd, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';

const Counselling = ({ items, onOpenAskModal }) => {
  return (
    <section className="mb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="rounded-3xl p-0 flex flex-col md:flex-row items-center relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-white border border-gray-100 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-transparent z-10"></div>
              <div className={`absolute right-0 top-0 bottom-0 w-1/2 ${item.color} opacity-20`}></div>
              
              <div className="flex-1 z-20 p-8 md:pr-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-orange transition-colors">{item.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">{item.description}</p>
                {item.cta === "Ask Now" ? (
                  <button 
                    onClick={onOpenAskModal}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-orange text-white text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:gap-3 transition-all"
                  >
                    {item.cta} <FaArrowRight />
                  </button>
                ) : (
                  <a 
                    href={item.link} 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand-orange border border-brand-orange text-sm font-bold shadow-md hover:bg-orange-50 hover:gap-3 transition-all"
                  >
                    {item.cta} <FaArrowRight />
                  </a>
                )}
              </div>
              
              <div className="w-full md:w-1/2 h-48 md:h-64 relative z-0">
                 <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white md:via-white/20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counselling;
