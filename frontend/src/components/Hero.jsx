import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Hero = ({ 
  title = <>Empowering Students. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Building Futures.</span></>,
  subtitle = "Explore 30,000+ Colleges, exams, and courses to make the informed career choice.",
  bgImage = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85",
  trending = [
    { text: "JEE Main 2026", link: "#" },
    { text: "NEET PG", link: "#" },
    { text: "IIM Ahmedabad", link: "#" },
    { text: "Computer Science", link: "#" }
  ]
}) => {

  return (
    <section className="relative h-[580px] flex items-center justify-center text-center text-white overflow-hidden mb-12 pt-32">
       {/* Background Element */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('${bgImage}')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/95 to-blue-900/90 z-10"></div>

      <div className="relative z-20 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light">
            {subtitle}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/20 shadow-2xl"
        >
          <div className="bg-white rounded-xl p-1.5 mb-6 shadow-xl transform transition-transform focus-within:-translate-y-0.5">
            <div className="flex items-center w-full">
              <FaSearch className="text-gray-400 text-lg ml-4 mr-3" />
              <input 
                type="text" 
                className="flex-1 border-none py-3 md:py-3.5 text-base outline-none font-sans text-gray-800 placeholder-gray-400" 
                placeholder="Search for Colleges, Exams, Courses and more..." 
              />
              <button className="hidden md:block bg-brand-orange text-white px-8 py-3 rounded-md font-bold text-sm tracking-wide hover:bg-orange-600 transition-all">
                Search
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-white/90">
             <span className="text-white/60 font-medium mr-1">Trending:</span> 
             {trending.map((item, index) => (
                <a key={index} href={item.link} className="bg-white/10 px-3 py-1 rounded-full hover:bg-white/25 hover:text-white transition-colors border border-white/10">
                  {item.text}
                </a>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
