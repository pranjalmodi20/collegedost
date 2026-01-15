import React from 'react';
import { FaChartLine, FaArrowRight, FaUniversity, FaTrophy } from 'react-icons/fa';

const PredictorsSection = ({ 
  data, 
  title = "Predictors", 
  mainTitle = "Know Your Chances", 
  subText = "Enter your rank or score to predict your college.",
  illustration = "https://img.freepik.com/free-vector/predictive-analytics-illustration_23-2149206689.jpg"
}) => {
  return (
    <section className="mb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-brand-orange pl-3">{title}</h2>
          <a href="#" className="flex items-center gap-2 text-sm font-bold text-brand-orange bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors group">
            View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
          {/* Illustration Side */}
          <div className="lg:w-[28%] bg-brand-blue/5 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent"></div>
            <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-brand-blue/10 relative z-10 p-6">
              <img 
                src={illustration}
                alt={title} 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">{mainTitle}</h3>
            <p className="text-gray-500 max-w-[200px] leading-relaxed relative z-10">{subText}</p>
          </div>

          {/* Content Side */}
          <div className="lg:w-[72%] p-10 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {data.map((group, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <span className="text-2xl text-brand-orange">
                       {idx === 0 ? <FaUniversity /> : <FaTrophy />}
                    </span>
                    <h4 className="text-xl font-bold text-gray-800 tracking-tight">
                      {group.title}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    {group.items.map((item, index) => (
                      <a 
                        key={index} 
                        href={item.link}
                        className="flex items-center gap-3 text-[15px] font-medium text-gray-500 hover:text-brand-orange transition-colors group py-1"
                      >
                        <span className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-brand-orange transition-colors shadow-sm"></span>
                        <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PredictorsSection;
