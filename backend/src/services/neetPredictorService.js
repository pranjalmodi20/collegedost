/**
 * NEET College Predictor Service
 * Predicts medical colleges based on NEET score/percentile, category, and state
 */

// NEET Score to Approximate AIR conversion (based on ~24 lakh candidates in 2024)
const scoreToRank = (score) => {
    // NEET 2024 had approximately 24 lakh candidates
    // Max score: 720, Cutoff varies by category
    const totalCandidates = 2400000;
    
    // Approximate rank calculation based on score distribution
    if (score >= 700) return Math.round((720 - score) * 10);
    if (score >= 650) return Math.round(200 + (700 - score) * 100);
    if (score >= 600) return Math.round(5200 + (650 - score) * 300);
    if (score >= 550) return Math.round(20200 + (600 - score) * 600);
    if (score >= 500) return Math.round(50200 + (550 - score) * 1200);
    if (score >= 450) return Math.round(110200 + (500 - score) * 2400);
    if (score >= 400) return Math.round(230200 + (450 - score) * 4800);
    if (score >= 350) return Math.round(470200 + (400 - score) * 9600);
    if (score >= 300) return Math.round(950200 + (350 - score) * 15000);
    return Math.round(1700200 + (300 - score) * 20000);
};

// Government Medical Colleges data with approximate cutoffs
const MEDICAL_COLLEGES = {
    AIIMS: [
        { name: "AIIMS Delhi", state: "Delhi", fees: "₹1,628/year", type: "Central", cutoff: { General: 50, OBC: 100, SC: 800, ST: 2000, EWS: 150 } },
        { name: "AIIMS Jodhpur", state: "Rajasthan", fees: "₹1,628/year", type: "Central", cutoff: { General: 200, OBC: 400, SC: 2000, ST: 4000, EWS: 500 } },
        { name: "AIIMS Bhopal", state: "Madhya Pradesh", fees: "₹1,628/year", type: "Central", cutoff: { General: 250, OBC: 500, SC: 2500, ST: 5000, EWS: 600 } },
        { name: "AIIMS Rishikesh", state: "Uttarakhand", fees: "₹1,628/year", type: "Central", cutoff: { General: 300, OBC: 600, SC: 3000, ST: 6000, EWS: 700 } },
        { name: "AIIMS Patna", state: "Bihar", fees: "₹1,628/year", type: "Central", cutoff: { General: 350, OBC: 700, SC: 3500, ST: 7000, EWS: 800 } },
        { name: "AIIMS Raipur", state: "Chhattisgarh", fees: "₹1,628/year", type: "Central", cutoff: { General: 400, OBC: 800, SC: 4000, ST: 8000, EWS: 900 } },
        { name: "AIIMS Bhubaneswar", state: "Odisha", fees: "₹1,628/year", type: "Central", cutoff: { General: 450, OBC: 900, SC: 4500, ST: 9000, EWS: 1000 } },
        { name: "AIIMS Nagpur", state: "Maharashtra", fees: "₹1,628/year", type: "Central", cutoff: { General: 500, OBC: 1000, SC: 5000, ST: 10000, EWS: 1100 } },
        { name: "AIIMS Mangalagiri", state: "Andhra Pradesh", fees: "₹1,628/year", type: "Central", cutoff: { General: 550, OBC: 1100, SC: 5500, ST: 11000, EWS: 1200 } },
        { name: "AIIMS Kalyani", state: "West Bengal", fees: "₹1,628/year", type: "Central", cutoff: { General: 600, OBC: 1200, SC: 6000, ST: 12000, EWS: 1300 } }
    ],
    
    GMCs: [
        { name: "Maulana Azad Medical College", state: "Delhi", fees: "₹10,000/year", type: "State Govt", cutoff: { General: 100, OBC: 200, SC: 1500, ST: 3500, EWS: 250 } },
        { name: "VMMC & Safdarjung Hospital", state: "Delhi", fees: "₹20,000/year", type: "Central", cutoff: { General: 150, OBC: 300, SC: 2000, ST: 4500, EWS: 350 } },
        { name: "Lady Hardinge Medical College", state: "Delhi", fees: "₹10,000/year", type: "State Govt", cutoff: { General: 200, OBC: 400, SC: 2500, ST: 5500, EWS: 450 } },
        { name: "University College of Medical Sciences", state: "Delhi", fees: "₹15,000/year", type: "State Govt", cutoff: { General: 250, OBC: 500, SC: 3000, ST: 6500, EWS: 550 } },
        { name: "Grant Medical College, Mumbai", state: "Maharashtra", fees: "₹25,000/year", type: "State Govt", cutoff: { General: 1000, OBC: 2000, SC: 8000, ST: 15000, EWS: 2500 } },
        { name: "Seth GS Medical College, Mumbai", state: "Maharashtra", fees: "₹30,000/year", type: "State Govt", cutoff: { General: 1200, OBC: 2400, SC: 9000, ST: 17000, EWS: 3000 } },
        { name: "King George's Medical University", state: "Uttar Pradesh", fees: "₹50,000/year", type: "State Govt", cutoff: { General: 2000, OBC: 4000, SC: 12000, ST: 22000, EWS: 4500 } },
        { name: "BHU Institute of Medical Sciences", state: "Uttar Pradesh", fees: "₹10,000/year", type: "Central", cutoff: { General: 800, OBC: 1600, SC: 7000, ST: 14000, EWS: 1800 } },
        { name: "SMS Medical College, Jaipur", state: "Rajasthan", fees: "₹40,000/year", type: "State Govt", cutoff: { General: 3000, OBC: 6000, SC: 15000, ST: 28000, EWS: 6500 } },
        { name: "GMC Thiruvananthapuram", state: "Kerala", fees: "₹35,000/year", type: "State Govt", cutoff: { General: 2500, OBC: 5000, SC: 13000, ST: 25000, EWS: 5500 } },
        { name: "Stanley Medical College, Chennai", state: "Tamil Nadu", fees: "₹15,000/year", type: "State Govt", cutoff: { General: 1500, OBC: 3000, SC: 10000, ST: 20000, EWS: 3500 } },
        { name: "Bangalore Medical College", state: "Karnataka", fees: "₹45,000/year", type: "State Govt", cutoff: { General: 2000, OBC: 4000, SC: 12000, ST: 22000, EWS: 4500 } },
        { name: "Osmania Medical College", state: "Telangana", fees: "₹60,000/year", type: "State Govt", cutoff: { General: 4000, OBC: 8000, SC: 18000, ST: 32000, EWS: 8500 } },
        { name: "IGMC Shimla", state: "Himachal Pradesh", fees: "₹55,000/year", type: "State Govt", cutoff: { General: 5000, OBC: 10000, SC: 20000, ST: 35000, EWS: 10500 } },
        { name: "GMC Amritsar", state: "Punjab", fees: "₹70,000/year", type: "State Govt", cutoff: { General: 6000, OBC: 12000, SC: 22000, ST: 38000, EWS: 12500 } },
        { name: "Pt. BD Sharma PGIMS, Rohtak", state: "Haryana", fees: "₹80,000/year", type: "State Govt", cutoff: { General: 7000, OBC: 14000, SC: 25000, ST: 42000, EWS: 14500 } },
        { name: "GMC Patiala", state: "Punjab", fees: "₹75,000/year", type: "State Govt", cutoff: { General: 8000, OBC: 16000, SC: 28000, ST: 48000, EWS: 16500 } },
        { name: "PMCH Patna", state: "Bihar", fees: "₹30,000/year", type: "State Govt", cutoff: { General: 10000, OBC: 20000, SC: 35000, ST: 55000, EWS: 20500 } },
        { name: "GMC Nagpur", state: "Maharashtra", fees: "₹50,000/year", type: "State Govt", cutoff: { General: 12000, OBC: 24000, SC: 40000, ST: 60000, EWS: 24500 } },
        { name: "BJMC Ahmedabad", state: "Gujarat", fees: "₹15,000/year", type: "State Govt", cutoff: { General: 4500, OBC: 9000, SC: 19000, ST: 34000, EWS: 9500 } }
    ],

    JIPMER: [
        { name: "JIPMER Puducherry", state: "Puducherry", fees: "₹1,730/year", type: "Central", cutoff: { General: 80, OBC: 160, SC: 1200, ST: 3000, EWS: 200 } },
        { name: "JIPMER Karaikal", state: "Puducherry", fees: "₹1,730/year", type: "Central", cutoff: { General: 500, OBC: 1000, SC: 5000, ST: 10000, EWS: 1100 } }
    ],

    Private: [
        { name: "CMC Vellore", state: "Tamil Nadu", fees: "₹25,000/year", type: "Private", cutoff: { General: 500, OBC: 1000, SC: 5000, ST: 10000, EWS: 1100 } },
        { name: "Kasturba Medical College, Manipal", state: "Karnataka", fees: "₹18,00,000/year", type: "Private", cutoff: { General: 15000, OBC: 30000, SC: 60000, ST: 100000, EWS: 32000 } },
        { name: "Amrita Institute of Medical Sciences", state: "Kerala", fees: "₹14,00,000/year", type: "Private", cutoff: { General: 20000, OBC: 40000, SC: 70000, ST: 110000, EWS: 42000 } },
        { name: "JSS Medical College, Mysore", state: "Karnataka", fees: "₹15,00,000/year", type: "Private", cutoff: { General: 25000, OBC: 50000, SC: 80000, ST: 120000, EWS: 52000 } },
        { name: "SRM Medical College", state: "Tamil Nadu", fees: "₹20,00,000/year", type: "Private", cutoff: { General: 35000, OBC: 70000, SC: 100000, ST: 150000, EWS: 72000 } },
        { name: "MS Ramaiah Medical College", state: "Karnataka", fees: "₹17,00,000/year", type: "Private", cutoff: { General: 30000, OBC: 60000, SC: 90000, ST: 140000, EWS: 62000 } },
        { name: "Bharati Vidyapeeth Medical College", state: "Maharashtra", fees: "₹19,00,000/year", type: "Private", cutoff: { General: 40000, OBC: 80000, SC: 110000, ST: 160000, EWS: 82000 } },
        { name: "SDM College of Medical Sciences", state: "Karnataka", fees: "₹16,00,000/year", type: "Private", cutoff: { General: 45000, OBC: 90000, SC: 120000, ST: 170000, EWS: 92000 } },
        { name: "DY Patil Medical College, Pune", state: "Maharashtra", fees: "₹18,50,000/year", type: "Private", cutoff: { General: 50000, OBC: 100000, SC: 130000, ST: 180000, EWS: 102000 } },
        { name: "Saveetha Medical College", state: "Tamil Nadu", fees: "₹22,00,000/year", type: "Private", cutoff: { General: 55000, OBC: 110000, SC: 140000, ST: 190000, EWS: 112000 } }
    ],

    Dental: [
        { name: "Maulana Azad Institute of Dental Sciences", state: "Delhi", fees: "₹10,000/year", type: "Govt", cutoff: { General: 50000, OBC: 100000, SC: 200000, ST: 400000, EWS: 105000 } },
        { name: "Government Dental College, Mumbai", state: "Maharashtra", fees: "₹25,000/year", type: "Govt", cutoff: { General: 60000, OBC: 120000, SC: 220000, ST: 420000, EWS: 125000 } },
        { name: "SDM College of Dental Sciences", state: "Karnataka", fees: "₹8,00,000/year", type: "Private", cutoff: { General: 150000, OBC: 300000, SC: 500000, ST: 700000, EWS: 310000 } },
        { name: "Manipal College of Dental Sciences", state: "Karnataka", fees: "₹10,00,000/year", type: "Private", cutoff: { General: 180000, OBC: 360000, SC: 550000, ST: 750000, EWS: 370000 } }
    ]
};

// Determine chance based on rank comparison
const getChance = (userRank, cutoffRank) => {
    if (userRank <= cutoffRank * 0.7) return 'Good Chances';
    if (userRank <= cutoffRank * 1.1) return 'May Get';
    if (userRank <= cutoffRank * 1.5) return 'Tough Chances';
    return null;
};

// Map category input to internal key
const mapCategory = (category) => {
    const mapping = {
        'General': 'General',
        'OBC': 'OBC',
        'OBC-NCL': 'OBC',
        'SC': 'SC',
        'ST': 'ST',
        'EWS': 'EWS'
    };
    return mapping[category] || 'General';
};

/**
 * Main prediction function for NEET
 * @param {number} score - NEET Score (out of 720)
 * @param {string} category - General, OBC, SC, ST, EWS
 * @param {string} homeState - Candidate's home state
 * @param {string} gender - Male/Female
 * @returns {Object} Prediction results
 */
const predictColleges = (score, category, homeState, gender) => {
    const estimatedRank = scoreToRank(score);
    const cat = mapCategory(category);
    
    const results = {
        AIIMS: { good_chances: [], may_get: [], tough_chances: [] },
        JIPMER: { good_chances: [], may_get: [], tough_chances: [] },
        Government_Medical: { good_chances: [], may_get: [], tough_chances: [] },
        Private_Medical: { good_chances: [], may_get: [], tough_chances: [] },
        Dental: { good_chances: [], may_get: [], tough_chances: [] }
    };

    // Process each category
    const processColleges = (colleges, resultKey) => {
        for (const college of colleges) {
            const cutoff = college.cutoff[cat] || college.cutoff.General;
            const chance = getChance(estimatedRank, cutoff);
            
            if (chance) {
                const collegeData = {
                    college_name: college.name,
                    course: resultKey.includes('Dental') ? 'BDS' : 'MBBS',
                    state: college.state,
                    ownership: college.type,
                    fees: college.fees,
                    last_year_cutoff: cutoff,
                    quota: homeState === college.state ? 'State Quota (85%)' : 'All India Quota (15%)',
                    chance: chance
                };

                if (chance === 'Good Chances') {
                    results[resultKey].good_chances.push(collegeData);
                } else if (chance === 'May Get') {
                    results[resultKey].may_get.push(collegeData);
                } else {
                    results[resultKey].tough_chances.push(collegeData);
                }
            }
        }
    };

    // Process all college types
    processColleges(MEDICAL_COLLEGES.AIIMS, 'AIIMS');
    processColleges(MEDICAL_COLLEGES.JIPMER, 'JIPMER');
    processColleges(MEDICAL_COLLEGES.GMCs, 'Government_Medical');
    processColleges(MEDICAL_COLLEGES.Private, 'Private_Medical');
    processColleges(MEDICAL_COLLEGES.Dental, 'Dental');

    // Calculate summary
    const countAll = (obj) => obj.good_chances.length + obj.may_get.length + obj.tough_chances.length;
    const summary = {
        good_chances: Object.values(results).reduce((sum, r) => sum + r.good_chances.length, 0),
        may_get: Object.values(results).reduce((sum, r) => sum + r.may_get.length, 0),
        tough_chances: Object.values(results).reduce((sum, r) => sum + r.tough_chances.length, 0)
    };

    return {
        input: {
            score,
            percentile: null,
            category,
            home_state: homeState,
            gender
        },
        estimated_rank: estimatedRank,
        summary,
        results
    };
};

module.exports = { predictColleges, scoreToRank };
