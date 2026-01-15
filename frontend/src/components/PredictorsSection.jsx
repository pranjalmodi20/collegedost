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
    <section className="mb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-brand-blue">{title}</h2>
          <a href="#" className="flex items-center gap-2 text-sm font-semibold text-brand-orange hover:translate-x-1 transition-transform">
             View All <FaArrowRight />
          </a>
        </div>

        <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Illustration Side */}
          <div className="lg:w-1/4 bg-brand-blue/5 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-brand-blue/10">
              <img 
                src={illustration}
                alt={title} 
                className="w-40 h-40 object-contain mix-blend-multiply"
              />
            </div>
            <h3 className="text-xl font-bold text-brand-blue mb-2">{mainTitle}</h3>
            <p className="text-sm text-gray-500">{subText}</p>
          </div>

          {/* Content Side */}
          <div className="lg:w-3/4 p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            {data.map((group, idx) => (
              <div key={idx}>
                <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6 border-b pb-2">
                  {idx === 0 ? <FaUniversity className="text-brand-orange" /> : <FaTrophy className="text-brand-orange" />}
                  {group.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.items.map((item, index) => (
                    <a 
                      key={index} 
                      href={item.link}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-blue hover:font-semibold transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-brand-orange transition-colors"></span>
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PredictorsSection;
