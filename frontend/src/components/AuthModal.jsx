import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const AuthModal = ({ isOpen, onClose, initialTab = 'signup' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    currentClass: '',
    interest: '',
    city: '',
    agree: false
  });

  const [error, setError] = useState('');

  const benefits = [
    "Exam And Admission Alerts",
    "Mock Tests & Sample Papers",
    "100+ Entrance Exam Preparation E-Books",
    "AI-Based College/Rank Prediction Tools",
    "College And Course Guides",
    "Large Community Of Like Minded Students",
    "Detailed Webinars And Online Sessions",
    "1 On 1 Counselling From Experts"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signup' && !formData.agree) {
        setError('Please agree to terms and conditions');
        return;
    }
    
    // Basic validation
    if (!formData.password) {
        setError('Please enter password');
        return;
    }

    setLoading(true);
    try {
        const endpoint = activeTab === 'signup' 
            ? 'http://localhost:5000/api/auth/register' 
            : 'http://localhost:5000/api/auth/login';

        const payload = activeTab === 'signup' 
            ? formData 
            : { mobile: formData.mobile, password: formData.password };

        const response = await axios.post(endpoint, payload);

        if (response.data.success) {
            // Save token
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // Close
            onClose();
            window.location.reload();
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Authentication failed');
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        setLoading(true);
        const res = await axios.post('http://localhost:5000/api/auth/google', {
            token: credentialResponse.credential
        });
        
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            onClose();
            window.location.reload();
        }
    } catch (err) {
        console.error("Google Login Error", err);
        setError('Google Login Failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl pointer-events-auto overflow-hidden flex flex-col md:flex-row min-h-[600px] relative">
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2"
              >
                <FaTimes />
              </button>

              {/* Left Side: Marketing (Hidden on mobile usually, but let's keep for larger screens) */}
              <div className="hidden md:flex md:w-5/12 bg-orange-50/50 p-10 flex-col justify-center relative overflow-hidden">
                 {/* Abstract Decor */}
                 <div className="absolute top-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                 <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                 <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">COLLEGE<span className="text-gray-500 font-light">DOST</span></h2>
                    
                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Unlock Your Future with CollegeDost</h3>
                    <p className="text-gray-600 mb-8 text-sm">Register now and get exclusive access to:</p>

                    <ul className="space-y-3">
                        {benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                <FaCheckCircle className="text-brand-orange mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-xs text-gray-500 ml-7">And much more!</p>
                 </div>
              </div>

              {/* Right Side: Form */}
              <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col">
                
                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-100 mb-8">
                    <button 
                        className={`pb-3 text-lg font-bold transition-colors relative ${activeTab === 'signup' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                        {activeTab === 'signup' && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange rounded-t-full"></div>}
                    </button>
                    <button 
                        className={`pb-3 text-lg font-bold transition-colors relative ${activeTab === 'login' ? 'text-brand-orange' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                        {activeTab === 'login' && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange rounded-t-full"></div>}
                    </button>


                    <div className="ml-auto">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            useOneTap
                            shape="pill"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {activeTab === 'signup' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        )}

                        <div>
                            {activeTab === 'signup' && <label className="block text-xs text-gray-500 mb-1 ml-1" hidden>Mobile Number</label>}
                            <input 
                                type="tel" 
                                placeholder="Mobile Number" 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                                value={formData.mobile}
                                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>

                        {activeTab === 'signup' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1 ml-1">Studying In</label>
                                        <select 
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-gray-700"
                                            value={formData.currentClass}
                                            onChange={(e) => setFormData({...formData, currentClass: e.target.value})}
                                        >
                                            <option value="">Select Class</option>
                                            <option value="Class 12th">Class 12th</option>
                                            <option value="Class 11th">Class 11th</option>
                                            <option value="Class 10th">Class 10th</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1 ml-1">City You Live In</label>
                                        <input 
                                            type="text" 
                                            placeholder="City" 
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                                            value={formData.city}
                                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">Course Interest for College</label>
                                    <select 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-gray-700"
                                        value={formData.interest}
                                        onChange={(e) => setFormData({...formData, interest: e.target.value})}
                                    >
                                        <option value="">Select Course</option>
                                        <option value="B.E/B.Tech">B.E/B.Tech</option>
                                        <option value="MBBS">MBBS</option>
                                        <option value="MBA">MBA</option>
                                        <option value="Law">Law</option>
                                    </select>
                                </div>

                                <div className="flex items-start gap-2 mt-2">
                                    <input 
                                        type="checkbox" 
                                        id="agree" 
                                        className="mt-1 w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange"
                                        checked={formData.agree}
                                        onChange={(e) => setFormData({...formData, agree: e.target.checked})}
                                    />
                                    <label htmlFor="agree" className="text-xs text-gray-500 leading-snug">
                                        I agree to CollegeDost's <a href="#" className="text-brand-blue underline">Privacy Policy</a> and <a href="#" className="text-brand-blue underline">Terms & Conditions</a> and provide consent to be contacted for promotion via mail, sms, whatsapp, etc.
                                    </label>
                                </div>
                            </>
                        )}
                        
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full max-w-xs mx-auto block bg-brand-orange text-white hover:bg-orange-600 font-bold py-3 rounded-lg transition-colors mt-6 shadow-lg shadow-orange-500/20"
                        >
                            {loading ? 'Processing...' : (activeTab === 'signup' ? 'Register' : 'Login')}
                        </button>

                        {/* Footer Switch */}
                        <div className="text-center mt-6 text-sm text-gray-600">
                            {activeTab === 'login' ? (
                                <>Don't have a CollegeDost account? <button type="button" onClick={() => setActiveTab('signup')} className="text-brand-blue font-bold hover:underline">Sign Up</button> to continue</>
                            ) : (
                                <>Already have a CollegeDost account? <button type="button" onClick={() => setActiveTab('login')} className="text-brand-blue font-bold hover:underline">Login</button> to continue</>
                            )}
                        </div>
                    </form>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
