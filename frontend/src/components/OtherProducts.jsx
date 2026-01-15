import React from 'react';
import { motion } from 'framer-motion';
import {
  FaUniversity, FaBookOpen, FaLaptopCode, FaStethoscope,
  FaBalanceScale, FaChartLine, FaDraftingCompass, FaGlobeAmericas,
  FaListUl, FaRegComments
} from 'react-icons/fa';

const otherProducts = [
  { id: 1, title: 'College Compare', icon: <FaBalanceScale />, color: '#4a90e2' },
  { id: 2, title: 'College Reviews', icon: <FaRegComments />, color: '#f5a623' },
  { id: 3, title: 'B.Tech Companion', icon: <FaDraftingCompass />, color: '#7ed321' },
  { id: 4, title: 'NEET Companion', icon: <FaStethoscope />, color: '#bd10e0' },
  { id: 5, title: 'List of Courses', icon: <FaListUl />, color: '#50e3c2' },
  { id: 6, title: 'College Applications', icon: <FaLaptopCode />, color: '#9013fe' }
];

const OtherProducts = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue">Other Products</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {otherProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              className="bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div 
                className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
                style={{ color: product.color }}
              >
                {product.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-brand-blue transition-colors">{product.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherProducts;
