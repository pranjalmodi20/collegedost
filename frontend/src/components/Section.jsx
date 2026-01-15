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
                (() => {
                  const Component = item.link ? 'a' : 'div';
                  const props = item.link ? { href: item.link } : {};
                  return (
                    <Component 
                      className="bg-white rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-sm border border-transparent hover:border-brand-orange/20 flex flex-col items-center justify-center relative overflow-hidden group h-full cursor-pointer"
                      style={{ '--hover-color': item.color }}
                      {...props}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-100 group-hover:opacity-0 transition-opacity"></div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[var(--hover-color)] opacity-0 group-hover:opacity-10 opacity-5 transition-opacity pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--hover-color)] opacity-5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                      
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm relative z-10" 
                        style={{ background: `${item.color}10`, color: item.color }}
                      >
                        <item.icon />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 relative z-10">{item.title}</h3>
                      {item.subtext && <p className="text-xs text-gray-500 relative z-10">{item.subtext}</p>}
                    </Component>
                  );
                })()
              ) : (
                <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-500/10 group border border-gray-100/50">
                  <div className="p-5 flex gap-4 items-start relative bg-gradient-to-b from-white to-gray-50/50">
                    <div className="w-14 h-14 rounded-xl p-0.5 bg-white shadow-sm border border-gray-100 flex-shrink-0">
                       <img src={item.logo} alt={item.name} className="w-full h-full rounded-lg object-contain" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold mb-1 text-gray-900 pr-10 line-clamp-2 leading-tight group-hover:text-brand-orange transition-colors">{item.name}</h3>
                      <div className="text-xs flex items-center gap-1 text-gray-500 font-medium">
                        <FaMapMarkerAlt className="text-brand-orange/60" /> {item.location}
                      </div>
                    </div>
                    <span className="absolute top-5 right-5 bg-gradient-to-r from-amber-50 to-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-orange-100 shadow-sm">
                      <FaStar className="text-[9px]" /> {item.rating}
                    </span>
                  </div>
                  
                  <div className="px-5 pb-5 flex-1 flex flex-col bg-white">
                    <div className="flex justify-between mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                       <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Fees</span>
                          <span className="text-sm font-bold text-gray-900">{item.fees}</span>
                       </div>
                       <div className="flex flex-col text-right">
                          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Avg Package</span>
                          <span className="text-sm font-bold text-emerald-600">{item.placement}</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-auto">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-white text-gray-600 text-[10px] px-2.5 py-1 rounded-full font-semibold border border-gray-200 shadow-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white border-t border-gray-100 flex gap-3 mt-auto">
                    <button className="flex-1 py-3 rounded-xl text-xs font-bold border border-brand-orange/30 text-brand-orange bg-orange-50/50 hover:bg-orange-50 transition-colors">Download Brochure</button>
                    <button className="flex-1 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-orange to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/30 transition-all transform active:scale-95">Apply Now</button>
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
