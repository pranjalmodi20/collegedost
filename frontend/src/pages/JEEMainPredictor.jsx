import React, { useState } from 'react';
import { FaUniversity, FaSearch, FaTrophy, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import axios from 'axios';

const JEEMainPredictor = ({ onOpenAuthModal }) => {
    const [percentile, setPercentile] = useState('');
    const [category, setCategory] = useState('General');
    const [homeState, setHomeState] = useState('');
    const [gender, setGender] = useState('');
    const [isPwd, setIsPwd] = useState('No');
    const [mobile, setMobile] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState(null);
    const [error, setError] = useState('');

    const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
        "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
    ];

    const handlePredict = async (e) => {
        e.preventDefault();

        // Check Auth
        const token = localStorage.getItem('token');
        if (!token) {
            onOpenAuthModal();
            return;
        }

        if (!percentile || percentile < 0 || percentile > 100) {
            setError('Please enter a valid JEE Main Percentile (0-100)');
            return;
        }
        if (!homeState) {
            setError('Please select your Home State');
            return;
        }
        if (!gender) {
            setError('Please select your Gender');
            return;
        }
        if (!mobile || mobile.length < 10) {
             setError('Please enter a valid mobile number');
             return;
        }

        setLoading(true);
        setError('');
        setColleges(null);

        // Convert Percentile to Rank
        // Formula: Rank = (100 - P) * Total_Candidates / 100
        // Approx Total Candidates = 14,00,000 for 2024-25
        const totalCandidates = 1400000;
        const calculatedRank = ((100 - parseFloat(percentile)) * totalCandidates) / 100;
        const rank = Math.floor(calculatedRank);

        try {
            // Assuming backend is on localhost:5000
            const response = await axios.post('http://localhost:5000/api/predictor/jee-main', {
                rank: rank, // Send calculated rank to backend
                category,
                homeState,
                gender,
                isPwd
            });

            if (response.data.success) {
                setColleges(response.data.colleges);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch predictions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            {/* Header Section */}
            <div className="bg-brand-blue text-white py-12 mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">JEE Main College Predictor 2026</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Enter your JEE Main Percentile to find the best engineering colleges you can get into.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Input Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100">
                        <div className="p-1 bg-gradient-to-r from-brand-orange to-brand-blue"></div>
                        <div className="p-8 md:p-10">
                            <form onSubmit={handlePredict} className="grid grid-cols-1 gap-6">
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-4">
                                        <FaFilter className="text-brand-orange" /> Enter Your Details
                                    </h3>
                                </div>
                                
                                {/* Percentile */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">JEE Main Paper-1 Percentile</label>
                                    <input
                                        type="number"
                                        step="0.0000001"
                                        min="0"
                                        max="100"
                                        placeholder="e.g. 96.89"
                                        value={percentile}
                                        onChange={(e) => setPercentile(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-medium text-lg text-gray-800"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">We will convert this to an approximate Rank (Assuming ~14L candidates) for prediction.</p>
                                </div>

                                {/* Home State & Caste Group */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Select your Home State</label>
                                        <div className="relative">
                                            <select
                                                value={homeState}
                                                onChange={(e) => setHomeState(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all appearance-none text-gray-700"
                                            >
                                                <option value="">-- Select --</option>
                                                {states.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Caste Group</label>
                                        <div className="relative">
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all appearance-none text-gray-700"
                                            >
                                                <option value="">-- Select --</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-3">Gender</label>
                                    <div className="flex items-center gap-8">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${gender === 'Female' ? 'border-brand-orange' : 'border-gray-300'}`}>
                                                {gender === 'Female' && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange"></div>}
                                            </div>
                                            <input type="radio" name="gender" value="Female" className="hidden" onChange={() => setGender('Female')} />
                                            <span className="text-gray-700 group-hover:text-gray-900">Female</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${gender === 'Male' ? 'border-brand-orange' : 'border-gray-300'}`}>
                                                {gender === 'Male' && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange"></div>}
                                            </div>
                                            <input type="radio" name="gender" value="Male" className="hidden" onChange={() => setGender('Male')} />
                                            <span className="text-gray-700 group-hover:text-gray-900">Male</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Specially Abled */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-3">Are you Specially Abled?</label>
                                    <div className="flex items-center gap-8">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isPwd === 'No' ? 'border-brand-orange' : 'border-gray-300'}`}>
                                                {isPwd === 'No' && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange"></div>}
                                            </div>
                                            <input type="radio" name="pwd" value="No" className="hidden" onChange={() => setIsPwd('No')} />
                                            <span className="text-gray-700 group-hover:text-gray-900">No</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isPwd === 'Yes' ? 'border-brand-orange' : 'border-gray-300'}`}>
                                                {isPwd === 'Yes' && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange"></div>}
                                            </div>
                                            <input type="radio" name="pwd" value="Yes" className="hidden" onChange={() => setIsPwd('Yes')} />
                                            <span className="text-gray-700 group-hover:text-gray-900">Yes</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Mobile */}
                                <div>
                                    <p className="text-brand-purple font-medium text-sm mb-2">College predictor report will be sent to you on:</p>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Enter your Mobile Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-gray-800"
                                    />
                                </div>

                                {/* Submit */}
                                <div className="mt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 px-6 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none min-h-[54px] flex items-center justify-center gap-2 text-lg"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>Predict My Colleges</>
                                        )}
                                    </button>
                                </div>
                            </form>
                            {error && <p className="text-red-500 mt-4 text-sm font-medium bg-red-50 p-3 rounded border border-red-100">{error}</p>}
                        </div>
                    </div>

                    {/* Results Section */}
                    {colleges && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">{colleges.length} Colleges Found</span>
                                for {percentile} Percentile
                            </h2>

                            {colleges.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🤷‍♂️</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Colleges Found</h3>
                                    <p className="text-gray-500">Try adjusting your percentile or category filters.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {colleges.map((college, idx) => (
                                        <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                            <div className="p-6 md:flex gap-6">
                                                <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-lg flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform mb-4 md:mb-0">
                                                    <FaUniversity />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors">{college.name}</h3>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                                <div className="flex items-center gap-1"><FaMapMarkerAlt className="text-brand-orange/60" /> 
                                                                    {college.location && college.location.city ? `${college.location.city}, ${college.location.state}` : 'Location NA'}
                                                                </div>
                                                                <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-100"><FaTrophy className="text-xs" /> NIRF: {college.nirfRank || 'NA'}</span>
                                                                <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium text-xs">{college.type}</span>
                                                            </div>
                                                        </div>
                                                        <a href="#" className="px-4 py-2 text-sm font-semibold text-brand-blue bg-blue-50 hover:bg-brand-blue hover:text-white rounded-lg transition-colors">
                                                            View Details
                                                        </a>
                                                    </div>

                                                    <div className="mt-6 pt-4 border-t border-gray-50">
                                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Qualifying Branches</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {college.matchedBranches.map((branch, branchIdx) => (
                                                                <div key={branchIdx} className={`p-3 rounded border text-sm flex flex-col justify-between ${branch.chance === 'High' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-yellow-50 border-yellow-100 text-yellow-800'}`}>
                                                                    <div className="flex justify-between w-full mb-1">
                                                                        <span className="font-medium truncate mr-2" title={branch.branch}>{branch.branch}</span>
                                                                        <span className="font-bold whitespace-nowrap">{branch.chance}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-end w-full text-xs opacity-80 mt-1">
                                                                        <span>{branch.category}</span>
                                                                        <span>Closing: {branch.closingRank}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JEEMainPredictor;
