import React from 'react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

const AppDownload = () => {
  return (
    <section className="mb-16 bg-gradient-to-br from-brand-blue to-blue-900 text-white rounded-3xl overflow-hidden mx-4 md:mx-auto container shadow-2xl relative">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
       
       <div className="flex flex-col md:flex-row items-center px-8 md:px-16 py-12 md:py-0 relative z-10">
         <div className="flex-1 text-center md:text-left mb-8 md:mb-0">

           <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
             Get the Collegedost App <br />
             <span className="text-brand-orange">Stay Updated On The Go!</span>
           </h2>
           <p className="text-white/80 mb-8 max-w-lg mx-auto md:mx-0 text-lg">
             Get instant notifications for exam results, counselling dates, and college applications. Join 50K+ students today.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
             <button className="flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 hover:-translate-y-1 transition-all shadow-lg active:scale-95">
               <FaGooglePlay className="text-2xl text-green-600" />
               <div className="text-left">
                 <div className="text-[10px] uppercase font-semibold text-gray-500">Get it on</div>
                 <div className="text-sm leading-none">Google Play</div>
               </div>
             </button>
             <button className="flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 hover:-translate-y-1 transition-all shadow-lg active:scale-95">
               <FaApple className="text-2xl text-gray-900" />
               <div className="text-left">
                 <div className="text-[10px] uppercase font-semibold text-gray-500">Download on</div>
                 <div className="text-sm leading-none">App Store</div>
               </div>
             </button>
           </div>
         </div>
         
         <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
           <div className="w-64 md:w-80 h-[400px] md:h-[500px] bg-gray-900 rounded-t-3xl border-8 border-gray-800 border-b-0 shadow-2xl overflow-hidden relative top-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
             <img 
               src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
               alt="App Screenshot" 
               className="w-full h-full object-cover opacity-80" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-blue to-transparent opacity-80"></div>
             <div className="absolute bottom-8 left-0 right-0 text-center px-6">
                <h4 className="font-bold text-xl mb-2">Your Career Companion</h4>
                <p className="text-xs text-white/70">Everything you need in your pocket.</p>
             </div>
           </div>
         </div>
       </div>
    </section>
  );
};

export default AppDownload;
