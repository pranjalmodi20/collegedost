/**
 * JEE Main College Predictor Service
 * Predicts colleges based on percentile, category, and home state
 */

// Percentile to Approximate AIR conversion (based on ~12 lakh candidates)
const percentileToRank = (percentile) => {
    const totalCandidates = 1200000; // ~12 lakh candidates
    const rank = Math.round((100 - percentile) * totalCandidates / 100);
    return Math.max(1, rank);
};

// NIT Cutoff Data (OBC-NCL, 2025 JoSAA Round 6 Closing Ranks)
const NIT_CUTOFFS = {
    // Top NITs
    "NIT Trichy": {
        "CSE": { hs: 1200, os: 2800, fees: "₹1.5L/year" },
        "ECE": { hs: 2500, os: 5500, fees: "₹1.5L/year" },
        "EE": { hs: 4000, os: 8000, fees: "₹1.5L/year" },
        "Mechanical": { hs: 6000, os: 12000, fees: "₹1.5L/year" }
    },
    "NIT Warangal": {
        "CSE": { hs: 1500, os: 3500, fees: "₹1.5L/year" },
        "ECE": { hs: 3000, os: 6500, fees: "₹1.5L/year" },
        "EE": { hs: 5000, os: 10000, fees: "₹1.5L/year" },
        "Mechanical": { hs: 7000, os: 14000, fees: "₹1.5L/year" }
    },
    "NIT Surathkal": {
        "CSE": { hs: 1800, os: 4000, fees: "₹1.8L/year" },
        "ECE": { hs: 3500, os: 7500, fees: "₹1.8L/year" },
        "EE": { hs: 5500, os: 11000, fees: "₹1.8L/year" },
        "Mechanical": { hs: 8000, os: 15000, fees: "₹1.8L/year" }
    },
    "NIT Rourkela": {
        "CSE": { hs: 2000, os: 5000, fees: "₹1.4L/year" },
        "ECE": { hs: 4000, os: 9000, fees: "₹1.4L/year" },
        "EE": { hs: 6000, os: 12000, fees: "₹1.4L/year" },
        "Mechanical": { hs: 9000, os: 17000, fees: "₹1.4L/year" }
    },
    "NIT Calicut": {
        "CSE": { hs: 2200, os: 5500, fees: "₹1.5L/year" },
        "ECE": { hs: 4500, os: 10000, fees: "₹1.5L/year" },
        "EE": { hs: 7000, os: 14000, fees: "₹1.5L/year" },
        "Mechanical": { hs: 10000, os: 19000, fees: "₹1.5L/year" }
    },
    "MNIT Jaipur": {
        "CSE": { hs: 3000, os: 6000, fees: "₹1.5L/year" },
        "ECE": { hs: 5000, os: 11000, fees: "₹1.5L/year" },
        "EE": { hs: 7500, os: 15000, fees: "₹1.5L/year" },
        "Mechanical": { hs: 11000, os: 20000, fees: "₹1.5L/year" }
    },
    "NIT Allahabad": {
        "CSE": { hs: 3500, os: 7000, fees: "₹1.4L/year" },
        "ECE": { hs: 6000, os: 12000, fees: "₹1.4L/year" },
        "EE": { hs: 9000, os: 17000, fees: "₹1.4L/year" },
        "Mechanical": { hs: 13000, os: 24000, fees: "₹1.4L/year" }
    },
    "NIT Durgapur": {
        "CSE": { hs: 5000, os: 10000, fees: "₹1.3L/year" },
        "ECE": { hs: 8000, os: 16000, fees: "₹1.3L/year" },
        "EE": { hs: 12000, os: 22000, fees: "₹1.3L/year" },
        "Mechanical": { hs: 16000, os: 28000, fees: "₹1.3L/year" }
    },
    "NIT Kurukshetra": {
        "CSE": { hs: 5500, os: 11000, fees: "₹1.4L/year" },
        "ECE": { hs: 9000, os: 18000, fees: "₹1.4L/year" },
        "EE": { hs: 13000, os: 24000, fees: "₹1.4L/year" },
        "Mechanical": { hs: 18000, os: 32000, fees: "₹1.4L/year" }
    },
    "NIT Jamshedpur": {
        "CSE": { hs: 6000, os: 12000, fees: "₹1.3L/year" },
        "ECE": { hs: 10000, os: 20000, fees: "₹1.3L/year" },
        "EE": { hs: 14000, os: 26000, fees: "₹1.3L/year" },
        "Mechanical": { hs: 20000, os: 35000, fees: "₹1.3L/year" }
    },
    "NIT Silchar": {
        "CSE": { hs: 8000, os: 15000, fees: "₹1.2L/year" },
        "ECE": { hs: 14000, os: 26000, fees: "₹1.2L/year" },
        "EE": { hs: 18000, os: 32000, fees: "₹1.2L/year" },
        "Mechanical": { hs: 25000, os: 42000, fees: "₹1.2L/year" }
    },
    "NIT Hamirpur": {
        "CSE": { hs: 10000, os: 18000, fees: "₹1.2L/year" },
        "ECE": { hs: 16000, os: 30000, fees: "₹1.2L/year" },
        "EE": { hs: 22000, os: 38000, fees: "₹1.2L/year" },
        "Mechanical": { hs: 30000, os: 50000, fees: "₹1.2L/year" }
    },
    "NIT Jalandhar": {
        "CSE": { hs: 9000, os: 17000, fees: "₹1.3L/year" },
        "ECE": { hs: 15000, os: 28000, fees: "₹1.3L/year" },
        "EE": { hs: 20000, os: 36000, fees: "₹1.3L/year" },
        "Mechanical": { hs: 28000, os: 48000, fees: "₹1.3L/year" }
    },
    "NIT Patna": {
        "CSE": { hs: 7000, os: 14000, fees: "₹1.3L/year" },
        "ECE": { hs: 12000, os: 24000, fees: "₹1.3L/year" },
        "EE": { hs: 16000, os: 30000, fees: "₹1.3L/year" },
        "Mechanical": { hs: 22000, os: 40000, fees: "₹1.3L/year" }
    },
    "NIT Raipur": {
        "CSE": { hs: 11000, os: 20000, fees: "₹1.2L/year" },
        "ECE": { hs: 18000, os: 34000, fees: "₹1.2L/year" },
        "EE": { hs: 24000, os: 42000, fees: "₹1.2L/year" },
        "Mechanical": { hs: 32000, os: 55000, fees: "₹1.2L/year" }
    },
    "NIT Srinagar": {
        "CSE": { hs: 15000, os: 28000, fees: "₹1.1L/year" },
        "ECE": { hs: 25000, os: 45000, fees: "₹1.1L/year" },
        "EE": { hs: 32000, os: 55000, fees: "₹1.1L/year" },
        "Mechanical": { hs: 40000, os: 70000, fees: "₹1.1L/year" }
    },
    "NIT Nagpur": {
        "CSE": { hs: 8000, os: 16000, fees: "₹1.4L/year" },
        "ECE": { hs: 14000, os: 28000, fees: "₹1.4L/year" },
        "EE": { hs: 19000, os: 35000, fees: "₹1.4L/year" },
        "Mechanical": { hs: 26000, os: 45000, fees: "₹1.4L/year" }
    },
    "NIT Agartala": {
        "CSE": { hs: 18000, os: 35000, fees: "₹1.1L/year" },
        "ECE": { hs: 30000, os: 55000, fees: "₹1.1L/year" },
        "EE": { hs: 40000, os: 70000, fees: "₹1.1L/year" },
        "Mechanical": { hs: 50000, os: 85000, fees: "₹1.1L/year" }
    },
    "NIT Goa": {
        "CSE": { hs: 12000, os: 22000, fees: "₹1.3L/year" },
        "ECE": { hs: 20000, os: 38000, fees: "₹1.3L/year" },
        "EE": { hs: 28000, os: 50000, fees: "₹1.3L/year" },
        "Mechanical": { hs: 36000, os: 62000, fees: "₹1.3L/year" }
    },
    "NIT Delhi": {
        "CSE": { hs: 6000, os: 12000, fees: "₹1.5L/year" },
        "ECE": { hs: 10000, os: 20000, fees: "₹1.5L/year" },
        "EE": { hs: 14000, os: 28000, fees: "₹1.5L/year" }
    }
};

// IIIT Cutoff Data
const IIIT_CUTOFFS = {
    "IIIT Allahabad": {
        "IT": { os: 4500, fees: "₹2.0L/year" },
        "ECE": { os: 8000, fees: "₹2.0L/year" }
    },
    "IIIT Hyderabad": {
        "CSE": { os: 2500, fees: "₹2.5L/year" },
        "ECE": { os: 5000, fees: "₹2.5L/year" }
    },
    "IIIT Delhi": {
        "CSE": { os: 3500, fees: "₹3.2L/year" },
        "ECE": { os: 7000, fees: "₹3.2L/year" }
    },
    "IIIT Bangalore": {
        "CSE": { os: 4000, fees: "₹3.5L/year" },
        "ECE": { os: 8500, fees: "₹3.5L/year" }
    },
    "IIIT Guwahati": {
        "CSE": { os: 12000, fees: "₹1.5L/year" },
        "ECE": { os: 22000, fees: "₹1.5L/year" }
    },
    "IIIT Lucknow": {
        "CSE": { os: 10000, fees: "₹1.6L/year" },
        "IT": { os: 15000, fees: "₹1.6L/year" }
    },
    "IIIT Kota": {
        "CSE": { os: 14000, fees: "₹1.4L/year" },
        "ECE": { os: 25000, fees: "₹1.4L/year" }
    },
    "IIIT Vadodara": {
        "CSE": { os: 11000, fees: "₹1.5L/year" },
        "IT": { os: 18000, fees: "₹1.5L/year" }
    },
    "IIIT Sri City": {
        "CSE": { os: 13000, fees: "₹2.0L/year" },
        "ECE": { os: 24000, fees: "₹2.0L/year" }
    },
    "IIIT Kancheepuram": {
        "CSE": { os: 16000, fees: "₹1.4L/year" },
        "ECE": { os: 28000, fees: "₹1.4L/year" }
    },
    "IIIT Una": {
        "CSE": { os: 18000, fees: "₹1.3L/year" },
        "ECE": { os: 32000, fees: "₹1.3L/year" }
    },
    "IIIT Kalyani": {
        "CSE": { os: 20000, fees: "₹1.2L/year" },
        "IT": { os: 30000, fees: "₹1.2L/year" }
    }
};

// GFTI Cutoff Data
const GFTI_CUTOFFS = {
    "IIEST Shibpur": {
        "CSE": { os: 8000, fees: "₹1.2L/year" },
        "ECE": { os: 14000, fees: "₹1.2L/year" },
        "EE": { os: 18000, fees: "₹1.2L/year" },
        "Mechanical": { os: 24000, fees: "₹1.2L/year" }
    },
    "BIT Mesra": {
        "CSE": { os: 15000, fees: "₹2.5L/year" },
        "ECE": { os: 25000, fees: "₹2.5L/year" },
        "EE": { os: 32000, fees: "₹2.5L/year" }
    },
    "NIT Puducherry": {
        "CSE": { os: 25000, fees: "₹1.2L/year" },
        "ECE": { os: 40000, fees: "₹1.2L/year" },
        "EE": { os: 50000, fees: "₹1.2L/year" }
    },
    "NIT Sikkim": {
        "CSE": { os: 35000, fees: "₹1.0L/year" },
        "ECE": { os: 55000, fees: "₹1.0L/year" }
    },
    "NIT Mizoram": {
        "CSE": { os: 40000, fees: "₹1.0L/year" },
        "ECE": { os: 65000, fees: "₹1.0L/year" }
    },
    "NIT Meghalaya": {
        "CSE": { os: 38000, fees: "₹1.0L/year" },
        "ECE": { os: 60000, fees: "₹1.0L/year" }
    },
    "NIT Manipur": {
        "CSE": { os: 42000, fees: "₹1.0L/year" },
        "ECE": { os: 68000, fees: "₹1.0L/year" }
    },
    "NIT Nagaland": {
        "CSE": { os: 45000, fees: "₹1.0L/year" },
        "ECE": { os: 72000, fees: "₹1.0L/year" }
    },
    "NIT Arunachal Pradesh": {
        "CSE": { os: 48000, fees: "₹1.0L/year" },
        "ECE": { os: 75000, fees: "₹1.0L/year" }
    }
};

// Private/Deemed Universities
const PRIVATE_CUTOFFS = {
    "BITS Pilani (Pilani)": {
        "CSE": { cutoff: 5000, fees: "₹5.0L/year" },
        "ECE": { cutoff: 10000, fees: "₹5.0L/year" },
        "EE": { cutoff: 12000, fees: "₹5.0L/year" }
    },
    "BITS Pilani (Hyderabad)": {
        "CSE": { cutoff: 8000, fees: "₹5.0L/year" },
        "ECE": { cutoff: 15000, fees: "₹5.0L/year" }
    },
    "BITS Pilani (Goa)": {
        "CSE": { cutoff: 10000, fees: "₹5.0L/year" },
        "ECE": { cutoff: 18000, fees: "₹5.0L/year" }
    },
    "VIT Vellore": {
        "CSE": { cutoff: 20000, fees: "₹2.5L/year" },
        "ECE": { cutoff: 40000, fees: "₹2.5L/year" }
    },
    "Thapar Institute": {
        "CSE": { cutoff: 25000, fees: "₹3.0L/year" },
        "ECE": { cutoff: 45000, fees: "₹3.0L/year" }
    },
    "Manipal Institute of Technology": {
        "CSE": { cutoff: 30000, fees: "₹4.5L/year" },
        "ECE": { cutoff: 55000, fees: "₹4.5L/year" }
    },
    "SRM Chennai": {
        "CSE": { cutoff: 40000, fees: "₹3.0L/year" },
        "ECE": { cutoff: 70000, fees: "₹3.0L/year" }
    },
    "Amity University": {
        "CSE": { cutoff: 60000, fees: "₹3.5L/year" },
        "ECE": { cutoff: 90000, fees: "₹3.5L/year" }
    }
};

// State to Home State Quota mapping for NITs
const STATE_NIT_MAP = {
    "Rajasthan": "MNIT Jaipur",
    "Tamil Nadu": "NIT Trichy",
    "Telangana": "NIT Warangal",
    "Karnataka": "NIT Surathkal",
    "Odisha": "NIT Rourkela",
    "Kerala": "NIT Calicut",
    "Uttar Pradesh": "NIT Allahabad",
    "West Bengal": "NIT Durgapur",
    "Haryana": "NIT Kurukshetra",
    "Jharkhand": "NIT Jamshedpur",
    "Assam": "NIT Silchar",
    "Himachal Pradesh": "NIT Hamirpur",
    "Punjab": "NIT Jalandhar",
    "Bihar": "NIT Patna",
    "Chhattisgarh": "NIT Raipur",
    "Jammu and Kashmir": "NIT Srinagar",
    "Maharashtra": "NIT Nagpur",
    "Tripura": "NIT Agartala",
    "Goa": "NIT Goa",
    "Delhi": "NIT Delhi"
};

/**
 * Determine chance based on rank vs cutoff
 */
const getChance = (rank, cutoff) => {
    if (rank <= cutoff * 0.85) return "Good Chances";
    if (rank <= cutoff * 1.1) return "May Get";
    if (rank <= cutoff * 1.3) return "Tough Chances";
    return null; // Not eligible
};

/**
 * Main prediction function
 */
const predictColleges = (percentile, category, homeState, gender = "Male") => {
    const estimatedRank = percentileToRank(percentile);
    
    // Category multiplier (OBC gets better cutoffs)
    const categoryMultiplier = {
        "General": 1,
        "EWS": 1.1,
        "OBC-NCL": 1.4,
        "SC": 2.0,
        "ST": 2.5
    }[category] || 1;

    const results = {
        NITs: { good_chances: [], may_get: [], tough_chances: [] },
        IIITs: { good_chances: [], may_get: [], tough_chances: [] },
        GFTIs: { good_chances: [], may_get: [], tough_chances: [] },
        Private_Deemed: { good_chances: [], may_get: [], tough_chances: [] }
    };

    // Home State NIT
    const homeNIT = STATE_NIT_MAP[homeState];

    // Process NITs
    for (const [college, courses] of Object.entries(NIT_CUTOFFS)) {
        const isHomeState = college === homeNIT;
        
        for (const [course, data] of Object.entries(courses)) {
            const baseCutoff = isHomeState ? data.hs : data.os;
            const adjustedCutoff = Math.round(baseCutoff * categoryMultiplier);
            const chance = getChance(estimatedRank, adjustedCutoff);
            
            if (chance) {
                const entry = {
                    college_name: college,
                    course: course,
                    quota: isHomeState ? "HS" : "OS",
                    ownership: "Government",
                    fees: data.fees,
                    last_year_cutoff: adjustedCutoff,
                    chance: chance
                };

                if (chance === "Good Chances") results.NITs.good_chances.push(entry);
                else if (chance === "May Get") results.NITs.may_get.push(entry);
                else results.NITs.tough_chances.push(entry);
            }
        }
    }

    // Process IIITs
    for (const [college, courses] of Object.entries(IIIT_CUTOFFS)) {
        for (const [course, data] of Object.entries(courses)) {
            const adjustedCutoff = Math.round(data.os * categoryMultiplier);
            const chance = getChance(estimatedRank, adjustedCutoff);
            
            if (chance) {
                const entry = {
                    college_name: college,
                    course: course,
                    quota: "AI",
                    ownership: "Government",
                    fees: data.fees,
                    last_year_cutoff: adjustedCutoff,
                    chance: chance
                };

                if (chance === "Good Chances") results.IIITs.good_chances.push(entry);
                else if (chance === "May Get") results.IIITs.may_get.push(entry);
                else results.IIITs.tough_chances.push(entry);
            }
        }
    }

    // Process GFTIs
    for (const [college, courses] of Object.entries(GFTI_CUTOFFS)) {
        for (const [course, data] of Object.entries(courses)) {
            const adjustedCutoff = Math.round(data.os * categoryMultiplier);
            const chance = getChance(estimatedRank, adjustedCutoff);
            
            if (chance) {
                const entry = {
                    college_name: college,
                    course: course,
                    quota: "AI",
                    ownership: "Government",
                    fees: data.fees,
                    last_year_cutoff: adjustedCutoff,
                    chance: chance
                };

                if (chance === "Good Chances") results.GFTIs.good_chances.push(entry);
                else if (chance === "May Get") results.GFTIs.may_get.push(entry);
                else results.GFTIs.tough_chances.push(entry);
            }
        }
    }

    // Process Private
    for (const [college, courses] of Object.entries(PRIVATE_CUTOFFS)) {
        for (const [course, data] of Object.entries(courses)) {
            const chance = getChance(estimatedRank, data.cutoff);
            
            if (chance) {
                const entry = {
                    college_name: college,
                    course: course,
                    quota: "AI",
                    ownership: "Private",
                    fees: data.fees,
                    last_year_cutoff: data.cutoff,
                    chance: chance
                };

                if (chance === "Good Chances") results.Private_Deemed.good_chances.push(entry);
                else if (chance === "May Get") results.Private_Deemed.may_get.push(entry);
                else results.Private_Deemed.tough_chances.push(entry);
            }
        }
    }

    // Sort by cutoff (higher cutoff = more competitive)
    const sortByCutoff = (a, b) => a.last_year_cutoff - b.last_year_cutoff;
    
    for (const type of Object.keys(results)) {
        results[type].good_chances.sort(sortByCutoff);
        results[type].may_get.sort(sortByCutoff);
        results[type].tough_chances.sort(sortByCutoff);
    }

    // Summary
    const summary = {
        good_chances: 
            results.NITs.good_chances.length +
            results.IIITs.good_chances.length +
            results.GFTIs.good_chances.length +
            results.Private_Deemed.good_chances.length,
        may_get:
            results.NITs.may_get.length +
            results.IIITs.may_get.length +
            results.GFTIs.may_get.length +
            results.Private_Deemed.may_get.length,
        tough_chances:
            results.NITs.tough_chances.length +
            results.IIITs.tough_chances.length +
            results.GFTIs.tough_chances.length +
            results.Private_Deemed.tough_chances.length
    };

    return {
        input: {
            percentile,
            category,
            home_state: homeState,
            gender
        },
        estimated_rank: estimatedRank,
        summary,
        results
    };
};

module.exports = { predictColleges, percentileToRank };
