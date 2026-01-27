import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CollegesPage = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 20;

    // Main Filters
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        state: searchParams.get('state') || '',
        city: searchParams.get('city') || '',
        type: searchParams.get('type') || '',
        branch: searchParams.get('branch') || '', 
        exam: searchParams.get('exam') || '',
        maxFees: searchParams.get('maxFees') || '',
        nirfCategory: searchParams.get('nirfCategory') || '',
        sort: 'nirfRank'
    });

    // Autocomplete State
    const [query, setQuery] = useState(filters.search);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Fetch on Filters or Page Change
    useEffect(() => {
        fetchColleges();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters, page]); 

    // Sync URL Params (e.g. Navbar clicks) to State
    useEffect(() => {
        const newFilters = {
            search: searchParams.get('search') || '',
            state: searchParams.get('state') || '',
            city: searchParams.get('city') || '',
            type: searchParams.get('type') || '',
            branch: searchParams.get('branch') || '', 
            exam: searchParams.get('exam') || '',
            maxFees: searchParams.get('maxFees') || '',
            nirfCategory: searchParams.get('nirfCategory') || '',
            sort: 'nirfRank'
        };
        // Only update if different to avoid potential loops (though React batches)
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, [searchParams]); 

    // Handle Click Outside Suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch Suggestions (Debounced)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/colleges/search?q=${query}`);
                    if (res.data.success) {
                        setSuggestions(res.data.data);
                        setShowSuggestions(true);
                    }
                } catch (err) {
                    console.error("Suggestion Error", err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const fetchColleges = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if(filters[key]) params.append(key, filters[key]);
            });
            // Add Pagination
            params.append('page', page);
            params.append('limit', LIMIT);

            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/colleges?${params.toString()}`);
            if (res.data.success) {
                setColleges(res.data.data);
                // Update Pagination Info from Backend
                if(res.data.pagination) {
                    setTotalPages(res.data.pagination.pages);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({...filters, [e.target.name]: e.target.value});
        setPage(1); // Reset to page 1 on filter change
    };

    const handleSearchSubmit = (e) => {
        if(e.key === 'Enter' || e.type === 'click') {
             setFilters({...filters, search: query});
             setPage(1);
             setShowSuggestions(false);
        }
    };

    const handlePageChange = (newPage) => {
        if(newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            
            <div className="bg-brand-deep-bg text-white py-10 mb-8">
                 <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 font-heading">Find Your Dream College</h1>
                    
                    {/* TOP SEARCH & FILTER BAR */}
                    <div className="bg-white rounded-lg p-4 max-w-5xl mx-auto text-gray-800 shadow-lg mt-8 text-left z-20 relative">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            
                            {/* Search with Autocomplete */}
                            <div className="col-span-2 relative" ref={searchRef}>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Search College / City</label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-3 text-gray-400 cursor-pointer" onClick={handleSearchSubmit} />
                                    <input 
                                        type="text" 
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleSearchSubmit}
                                        onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                                        placeholder="Type name, city..." 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:border-brand-blue outline-none"
                                    />
                                </div>
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg border border-gray-100 mt-1 z-50 overflow-hidden max-h-80 overflow-y-auto">
                                        {suggestions.map((item) => (
                                            <div 
                                                key={item._id} 
                                                onClick={() => navigate(`/colleges/${item.slug}`)} 
                                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.location?.city}</p>
                                                </div>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Branch */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Degree / Branch</label>
                                <input 
                                    type="text" name="branch" value={filters.branch}
                                    onChange={handleFilterChange}
                                    placeholder="e.g. Engineering, MBA" 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-brand-blue outline-none"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                                <select name="state" value={filters.state} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-200 rounded-md outline-none bg-white">
                                    <option value="">All States</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Telangana">Telangana</option>
                                </select>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
                             <div>
                                <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-2 py-2 text-sm border border-gray-200 rounded hover:border-brand-blue outline-none bg-white">
                                    <option value="">Ownership: All</option>
                                    <option value="Private">Private</option>
                                    <option value="Government">Government</option>
                                </select>
                            </div>
                             <div>
                                <select name="exam" value={filters.exam} onChange={handleFilterChange} className="w-full px-2 py-2 text-sm border border-gray-200 rounded hover:border-brand-blue outline-none bg-white">
                                    <option value="">Exam: Any</option>
                                    <option value="JEE Main">JEE Main</option>
                                    <option value="NEET">NEET</option>
                                    <option value="CAT">CAT</option>
                                    <option value="GATE">GATE</option>
                                </select>
                            </div>
                             <div>
                                <select name="maxFees" value={filters.maxFees} onChange={handleFilterChange} className="w-full px-2 py-2 text-sm border border-gray-200 rounded hover:border-brand-blue outline-none bg-white">
                                    <option value="">Max Fees: Any</option>
                                    <option value="100000">{'< 1 Lakh'}</option>
                                    <option value="200000">{'< 2 Lakhs'}</option>
                                    <option value="500000">{'< 5 Lakhs'}</option>
                                    <option value="1000000">{'< 10 Lakhs'}</option>
                                </select>
                            </div>
                            <div>
                                <select name="sort" value={filters.sort} onChange={handleFilterChange} className="w-full px-2 py-2 text-sm border border-gray-200 rounded hover:border-brand-blue outline-none bg-white">
                                    <option value="nirfRank">Sort: Top Ranked</option>
                                    <option value="fees_low">Fees: Low to High</option>
                                    <option value="fees_high">Fees: High to Low</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => {
                                    setFilters({search:'', state:'', city:'', type:'', branch:'', exam:'', maxFees:'', sort:'nirfRank'});
                                    setQuery('');
                                    setPage(1);
                                }} className="text-sm text-red-500 font-bold hover:underline">
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Result Count */}
                {!loading && (
                    <div className="mb-4 text-gray-500 text-sm">
                        Showing {(page-1)*LIMIT + 1}-{Math.min(page*LIMIT, colleges.length + (page-1)*LIMIT)} results
                    </div>
                )}

                {/* College Listing */}
                {loading ? (
                    <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-blue border-t-transparent"></div></div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {colleges.length > 0 ? (
                            colleges.map(college => (
                                <div key={college._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                                    <div className="w-full md:w-32 h-32 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl font-bold text-gray-300 overflow-hidden">
                                        {college.name.charAt(0)}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{college.name}</h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                                    <FaMapMarkerAlt /> {college.location.city}, {college.location.state}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {college.nirfRank && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">NIRF #{college.nirfRank}</span>}
                                                <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded">{college.type}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                            {college.fees && college.fees.tuition ? (
                                                <div className="bg-gray-50 px-3 py-2 rounded border border-gray-100">
                                                    <span className="block text-xs text-gray-500">Fees (Annual)</span>
                                                    <span className="font-semibold text-gray-800">₹ {(college.fees.tuition/100000).toFixed(2)} Lakhs</span>
                                                </div>
                                            ) : (
                                                 <div className="bg-gray-50 px-3 py-2 rounded border border-gray-100">
                                                    <span className="block text-xs text-gray-500">Fees</span>
                                                    <span className="font-semibold text-gray-400">Not Available</span>
                                                </div>
                                            )}

                                            {college.placements && (
                                                <div className="bg-gray-50 px-3 py-2 rounded border border-gray-100">
                                                    <span className="block text-xs text-gray-500">Avg Package</span>
                                                    <span className="font-semibold text-gray-800 text-green-600">{college.placements.averagePackage || 'N/A'}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="text-xs text-gray-500">
                                                {college.coursesOffered?.length > 0 ? (
                                                     `Courses: ${college.coursesOffered.slice(0, 3).map(c => c.courseName).join(', ')}...`
                                                ) : <span>View courses & details</span>}
                                            </div>
                                            <Link to={`/colleges/${college.slug}`} className="text-brand-blue font-bold text-sm hover:underline">
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <h3 className="text-lg font-medium text-gray-600">No colleges found matching criteria.</h3>
                                <p className="text-gray-400">Try adjusting your filters or search term.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* PAGINATION CONTROLS */}
                {!loading && colleges.length > 0 && (
                    <div className="flex justify-center items-center mt-10 gap-4">
                        <button 
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-brand-blue border-brand-blue hover:bg-blue-50'}`}
                        >
                            <FaChevronLeft size={12} /> Previous
                        </button>
                        
                        <div className="flex items-center gap-2">
                             <span className="px-3 py-1 bg-brand-blue text-white rounded-md font-bold">{page}</span>
                             <span className="text-gray-400">of</span>
                             <span className="text-gray-600 font-medium">{totalPages}</span>
                        </div>

                        <button 
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-brand-blue border-brand-blue hover:bg-blue-50'}`}
                        >
                            Next <FaChevronRight size={12} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollegesPage;
