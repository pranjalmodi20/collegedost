import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaHospital, FaSearch, FaTrophy, FaMapMarkerAlt, FaFilter, FaCheckCircle, FaExclamationCircle, FaRobot, FaGraduationCap, FaBuilding, FaStar, FaChevronDown, FaChevronUp, FaStethoscope, FaTooth } from 'react-icons/fa';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const NEETPredictor = ({ onOpenAuthModal }) => {
    const [searchParams] = useSearchParams();
    const [score, setScore] = useState('');
    const [category, setCategory] = useState('General');
    const [homeState, setHomeState] = useState('');
    const [gender, setGender] = useState('Male');
    
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');
    const [expandedSections, setExpandedSections] = useState({
        AIIMS: true,
        JIPMER: true,
        Government_Medical: true,
        Private_Medical: false,
        Dental: false
    });

    const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
        "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Puducherry"
    ];

    // Load prediction from URL if predictionId exists
    useEffect(() => {
        const predictionId = searchParams.get('id');
        if (predictionId) {
            loadPrediction(predictionId);
        }
    }, [searchParams]);

    const loadPrediction = async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/predictor/neet-prediction/${id}`);
            if (response.data.success) {
                setPrediction(response.data);
                setScore(response.data.input?.score?.toString() || '');
                setCategory(response.data.input?.category || 'General');
                setHomeState(response.data.input?.homeState || '');
                setGender(response.data.input?.gender || 'Male');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load prediction');
        } finally {
            setLoading(false);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();

        if (!score || parseInt(score) < 0 || parseInt(score) > 720) {
            setError('Please enter a valid NEET Score (0-720)');
            return;
        }
        if (!homeState) {
            setError('Please select your Home State');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        try {
            const response = await api.post('/predictor/neet-predict', {
                score: parseInt(score),
                category,
                homeState,
                gender
            });

            if (response.data.success) {
                setPrediction(response.data);
                // Update URL with prediction ID for sharing
                if (response.data.predictionId) {
                    window.history.replaceState({}, '', `/neet-predictor?id=${response.data.predictionId}`);
                }
                // Scroll to results
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 503) {
                setError('NEET College Predictor is currently disabled. Please try again later.');
            } else {
                setError('Failed to fetch predictions. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getSectionIcon = (type) => {
        switch (type) {
            case 'AIIMS': return <FaHospital className="text-blue-600" />;
            case 'JIPMER': return <FaStethoscope className="text-purple-600" />;
            case 'Government_Medical': return <FaBuilding className="text-green-600" />;
            case 'Private_Medical': return <FaStar className="text-orange-500" />;
            case 'Dental': return <FaTooth className="text-pink-500" />;
            default: return <FaHospital />;
        }
    };

    const getSectionTitle = (type) => {
        switch (type) {
            case 'AIIMS': return 'All India Institute of Medical Sciences (AIIMS)';
            case 'JIPMER': return 'JIPMER (Jawaharlal Institute)';
            case 'Government_Medical': return 'Government Medical Colleges';
            case 'Private_Medical': return 'Private Medical Colleges';
            case 'Dental': return 'Dental Colleges (BDS)';
            default: return type;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const CollegeCard = ({ college }) => (
        <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 group"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors text-sm md:text-base truncate">
                        {college.college_name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{college.course} • {college.state}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {college.quota && (
                            <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded font-medium">
                                {college.quota}
                            </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {college.ownership}
                        </span>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-gray-400 uppercase">Cutoff Rank</div>
                    <div className="font-bold text-green-600 text-lg">{college.last_year_cutoff?.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">{college.fees}</div>
                </div>
            </div>
        </motion.div>
    );

    const ResultSection = ({ title, icon, data, type }) => {
        const isExpanded = expandedSections[type];
        const totalCount = (data?.good_chances?.length || 0) + (data?.may_get?.length || 0) + (data?.tough_chances?.length || 0);
        
        if (totalCount === 0) return null;

        return (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                <button
                    onClick={() => toggleSection(type)}
                    className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                            {icon}
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500">{totalCount} options available</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-xs">
                            {data?.good_chances?.length > 0 && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">{data.good_chances.length} Good</span>
                            )}
                            {data?.may_get?.length > 0 && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">{data.may_get.length} Medium</span>
                            )}
                            {data?.tough_chances?.length > 0 && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">{data.tough_chances.length} Low</span>
                            )}
                        </div>
                        {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </div>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="p-5 pt-0 space-y-6">
                                {/* Good Chances */}
                                {data?.good_chances?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            Good Chances ({data.good_chances.length})
                                        </h4>
                                        <motion.div 
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                                        >
                                            {data.good_chances.map((college, idx) => (
                                                <CollegeCard key={idx} college={college} />
                                            ))}
                                        </motion.div>
                                    </div>
                                )}

                                {/* May Get */}
                                {data?.may_get?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-yellow-700 mb-3 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                            May Get ({data.may_get.length})
                                        </h4>
                                        <motion.div 
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                                        >
                                            {data.may_get.map((college, idx) => (
                                                <CollegeCard key={idx} college={college} />
                                            ))}
                                        </motion.div>
                                    </div>
                                )}

                                {/* Tough Chances */}
                                {data?.tough_chances?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            Tough Chances ({data.tough_chances.length})
                                        </h4>
                                        <motion.div 
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                                        >
                                            {data.tough_chances.map((college, idx) => (
                                                <CollegeCard key={idx} college={college} />
                                            ))}
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 overflow-x-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 relative overflow-hidden text-white pt-24 pb-20 mb-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] z-0 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-4"
                    >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                            <FaStethoscope className="text-2xl text-green-300" />
                        </div>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight"
                    >
                        NEET College Predictor 2026
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-green-100/80 max-w-2xl mx-auto font-light"
                    >
                        AI-powered predictions for AIIMS, JIPMER, Government & Private Medical Colleges
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Input Form Card */}
                    <div className="bg-white rounded-2xl shadow-premium overflow-hidden mb-12 border border-white/40 relative z-20">
                        <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500"></div>
                        <div className="p-8 md:p-10">
                            <form onSubmit={handlePredict} className="grid grid-cols-1 gap-6">
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2 border-b border-gray-100 pb-4">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                                            <FaFilter className="text-sm" /> 
                                        </div>
                                        Enter Your Details
                                    </h3>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* NEET Score */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">NEET-UG Score (Out of 720)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="720"
                                            placeholder="e.g. 580"
                                            value={score}
                                            onChange={(e) => setScore(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-bold text-2xl text-green-600 placeholder:font-normal placeholder:text-gray-400"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Enter your NEET-UG 2025 score. We'll estimate your All India Rank.</p>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <div className="relative">
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all appearance-none text-gray-700 font-medium"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                        </div>
                                    </div>

                                    {/* Home State */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Home State (Domicile)</label>
                                        <div className="relative">
                                            <select
                                                value={homeState}
                                                onChange={(e) => setHomeState(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all appearance-none text-gray-700 font-medium"
                                                required
                                            >
                                                <option value="">Select State</option>
                                                {states.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                                    <div className="flex items-center gap-4">
                                        {['Male', 'Female'].map((opt) => (
                                            <label key={opt} className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition-all ${gender === opt ? 'bg-green-50 border-green-500 text-green-600 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                                <input type="radio" name="gender" value={opt} className="hidden" onChange={() => setGender(opt)} checked={gender === opt} />
                                                {opt}
                                                {gender === opt && <FaCheckCircle />}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all disabled:opacity-70 disabled:shadow-none min-h-[56px] flex items-center justify-center gap-3 text-lg"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>Predict My Medical Colleges <FaSearch className="text-sm" /></>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                            
                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 text-red-700"
                                    >
                                        <FaExclamationCircle className="flex-shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div id="results-section">
                        <AnimatePresence>
                            {prediction && (
                                <motion.div 
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                    className="pb-20"
                                >
                                    {/* Summary Card */}
                                    <div className="bg-gradient-to-br from-green-900 to-emerald-800 text-white rounded-2xl p-6 md:p-8 mb-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h2 className="text-2xl font-bold mb-2">Your NEET Prediction Results</h2>
                                                <p className="text-green-200">
                                                    Score: <span className="font-bold text-white">{prediction.input?.score}/720</span> | 
                                                    Estimated Rank: <span className="font-bold text-white">~{prediction.estimated_rank?.toLocaleString()}</span>
                                                </p>
                                                {prediction.predictor_status && (
                                                    <p className="text-xs text-green-300 mt-2 flex items-center gap-2">
                                                        <FaRobot /> Powered by {prediction.predictor_status.powered_by} ({prediction.predictor_status.model})
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-4 text-center">
                                                <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[80px]">
                                                    <div className="text-3xl font-bold text-green-400">{prediction.summary?.good_chances || 0}</div>
                                                    <div className="text-xs text-green-200">Good</div>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[80px]">
                                                    <div className="text-3xl font-bold text-yellow-400">{prediction.summary?.may_get || 0}</div>
                                                    <div className="text-xs text-green-200">Medium</div>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[80px]">
                                                    <div className="text-3xl font-bold text-red-400">{prediction.summary?.tough_chances || 0}</div>
                                                    <div className="text-xs text-green-200">Low</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AIIMS Eligibility */}
                                        {prediction.aiims_eligibility && (
                                            <div className={`mt-6 p-4 rounded-xl ${prediction.aiims_eligibility.eligible ? 'bg-green-500/20 border border-green-400/30' : 'bg-yellow-500/20 border border-yellow-400/30'}`}>
                                                <div className="flex items-start gap-3">
                                                    <FaHospital className="text-2xl mt-1" />
                                                    <div>
                                                        <h4 className={`font-bold ${prediction.aiims_eligibility.eligible ? 'text-green-300' : 'text-yellow-300'}`}>
                                                            {prediction.aiims_eligibility.eligible ? '✓ Strong AIIMS/JIPMER Chances' : 'AIIMS/Central Institute Status'}
                                                        </h4>
                                                        <p className="text-sm text-green-100 mt-1">{prediction.aiims_eligibility.note}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* College Results by Type */}
                                    {prediction.results && (
                                        <>
                                            <ResultSection 
                                                title={getSectionTitle('AIIMS')} 
                                                icon={getSectionIcon('AIIMS')} 
                                                data={prediction.results.AIIMS}
                                                type="AIIMS"
                                            />
                                            <ResultSection 
                                                title={getSectionTitle('JIPMER')} 
                                                icon={getSectionIcon('JIPMER')} 
                                                data={prediction.results.JIPMER}
                                                type="JIPMER"
                                            />
                                            <ResultSection 
                                                title={getSectionTitle('Government_Medical')} 
                                                icon={getSectionIcon('Government_Medical')} 
                                                data={prediction.results.Government_Medical}
                                                type="Government_Medical"
                                            />
                                            <ResultSection 
                                                title={getSectionTitle('Private_Medical')} 
                                                icon={getSectionIcon('Private_Medical')} 
                                                data={prediction.results.Private_Medical}
                                                type="Private_Medical"
                                            />
                                            <ResultSection 
                                                title={getSectionTitle('Dental')} 
                                                icon={getSectionIcon('Dental')} 
                                                data={prediction.results.Dental}
                                                type="Dental"
                                            />
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NEETPredictor;
