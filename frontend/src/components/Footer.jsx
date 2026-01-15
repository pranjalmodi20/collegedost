import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white pt-16 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="flex flex-col">
            <h4 className="text-2xl font-bold mb-6">Collegedost</h4>
            <p className="text-sm text-white/70 mb-8 leading-relaxed max-w-xs">
              The Education Hub. Helping students make informed career decisions with data-driven insights.
            </p>
            <div className="flex gap-4 text-xl text-white/80">
              <a href="#" className="hover:text-brand-orange transition-colors"><FaFacebook /></a>
              <a href="#" className="hover:text-brand-orange transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-brand-orange transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-brand-orange transition-colors"><FaLinkedin /></a>
              <a href="#" className="hover:text-brand-orange transition-colors"><FaYoutube /></a>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h5 className="text-base font-semibold mb-6 text-white">Top Colleges</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">MBA Colleges</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">Engineering Colleges</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">Medical Colleges</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">Law Colleges</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col">
            <h5 className="text-base font-semibold mb-6 text-white">Top Exams</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">CAT 2025</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">JEE Main 2026</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">NEET 2026</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">GATE 2026</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col">
            <h5 className="text-base font-semibold mb-6 text-white">Resources</h5>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">College Predictors</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">Rank Predictors</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">QnA</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white hover:underline transition-colors">E-Books</a></li>
            </ul>
          </div>
        </div>
        
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>&copy; 2026 Collegedost. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
