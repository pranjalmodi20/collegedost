import React from 'react';
import { FaStar, FaMapMarkerAlt, FaLocationArrow, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Section = ({ title, items, type = 'card' }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue">{title}</h2>
          <a href="#" className="flex items-center gap-2 text-sm font-semibold text-brand-orange hover:translate-x-1 transition-transform">
            View All <FaArrowRight />
          </a>
        </div>
        
        <div className={`grid gap-6 ${type === 'category' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {items.map((item, index) => (
            <motion.div 
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              {type === 'category' ? (
                <div 
                  className="bg-white border border-gray-100 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg flex flex-col items-center justify-center relative overflow-hidden group h-full cursor-pointer"
                  style={{ '--hover-color': item.color }}
                >
                  <div className="absolute inset-0 rounded-2xl border-2 border-[var(--hover-color)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
                    style={{ background: `${item.color}15`, color: item.color }}
                  >
                    <item.icon />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  {item.subtext && <p className="text-xs text-gray-500">{item.subtext}</p>}
                </div>
              ) : (
                <div className="bg-white rounded-xl overflow-hidden h-full flex flex-col border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-transparent group">
                  <div className="p-5 flex gap-4 items-start relative">
                    <img src={item.logo} alt={item.name} className="w-14 h-14 rounded-lg object-contain bg-white border border-gray-100 p-1" />
                    <div>
                      <h3 className="text-base font-bold mb-1 text-brand-blue pr-10 line-clamp-2">{item.name}</h3>
                      <div className="text-xs flex items-center gap-1 text-gray-500">
                        <FaMapMarkerAlt /> {item.location}
                      </div>
                    </div>
                    <span className="absolute top-5 right-5 bg-yellow-50 text-yellow-600 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <FaStar /> {item.rating}
                    </span>
                  </div>
                  
                  <div className="px-5 pb-5 flex-1 flex flex-col">
                    <div className="flex justify-between mb-4">
                       <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Fees</span>
                          <span className="text-sm font-semibold text-gray-900">{item.fees}</span>
                       </div>
                       <div className="flex flex-col text-right">
                          <span className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Avg Package</span>
                          <span className="text-sm font-semibold text-green-700">{item.placement}</span>
                       </div>
                    </div>
                    
                    <div className="h-px bg-gray-100 mb-4"></div>
                    
                    <div className="flex flex-wrap gap-2 mb-auto">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-slate-50 text-brand-blue text-[10px] px-2 py-1 rounded font-semibold border border-blue-900/10">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border-t border-gray-100 flex gap-3 mt-auto">
                    <button className="flex-1 py-2.5 rounded-lg text-xs font-semibold border border-brand-orange text-brand-orange bg-white hover:bg-orange-50 transition-colors">Download Brochure</button>
                    <button className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-brand-orange text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all">Apply Now</button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section;
