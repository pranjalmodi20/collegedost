/**
 * JEE Main College Predictor Service
 * Predicts colleges based on percentile, category, and home state
 * Fetches real data from MongoDB 'College' collection
 */

const College = require('../models/College.model');

// Percentile to Approximate AIR conversion (based on ~14 lakh candidates for 2025/26)
const percentileToRank = (percentile) => {
    const totalCandidates = 1400000;
    const rank = Math.round((100 - percentile) * totalCandidates / 100);
    return Math.max(1, rank);
};

/**
 * Determine chance based on rank vs cutoff
 */
const getChance = (rank, cutoff) => {
    if (rank <= cutoff) return "Good Chances"; // <= Closing Rank
    if (rank <= cutoff * 1.15) return "May Get"; // Within 15% buffer
    if (rank <= cutoff * 1.30) return "Tough Chances"; // Within 30% buffer
    return null; // Not eligible
};

/**
 * Main prediction function (Async)
 */
const predictColleges = async (percentile, category, homeState, gender = "Male") => {
    const estimatedRank = percentileToRank(percentile);
    const userCategory = category || 'General';
    const userGender = gender || 'Male';
    const userHomeState = homeState || '';

    // Initialize Result Structure
    const results = {
        NITs: { good_chances: [], may_get: [], tough_chances: [] },
        IIITs: { good_chances: [], may_get: [], tough_chances: [] },
        GFTIs: { good_chances: [], may_get: [], tough_chances: [] },
        Private_Deemed: { good_chances: [], may_get: [], tough_chances: [] }
    };

    try {
        // Fetch all colleges with relevant fields
        // We fetch all because complex logic is needed for filtering branches inside
        const allColleges = await College.find({
            cutoff: { $exists: true, $ne: [] }
        }).select('name type location cutoff fees website ownership').lean();

        for (const college of allColleges) {

            // Normalize College Type for grouping
            let resultGroup = 'Private_Deemed';
            const typeUpper = (college.type || '').toUpperCase();

            if (typeUpper.includes('NIT') || typeUpper.includes('NATIONAL INSTITUTE OF TECHNOLOGY')) resultGroup = 'NITs';
            else if (typeUpper.includes('IIIT') || typeUpper.includes('INFORMATION TECHNOLOGY')) resultGroup = 'IIITs';
            else if (typeUpper.includes('GFTI') || typeUpper.includes('GOVERNMENT')) resultGroup = 'GFTIs';
            else if (typeUpper.includes('PRIVATE') || typeUpper.includes('DEEMED')) resultGroup = 'Private_Deemed';

            // Check Home State Match
            const collegeState = college.location?.state ? college.location.state.toLowerCase().trim() : '';
            const isHomeState = userHomeState && collegeState &&
                (collegeState.includes(userHomeState.toLowerCase()) || userHomeState.toLowerCase().includes(collegeState));

            // Iterate Cutoffs
            if (!college.cutoff) continue;

            const validBranches = [];

            for (const cut of college.cutoff) {
                // 1. Basic Filters
                if (cut.exam !== 'JEE Main') continue;

                // 2. Category Match
                // DB Categories: "Open", "General", "OBC-NCL", "SC", "ST", "EWS"
                // User Input: "General", "OBC-NCL", "SC", "ST", "EWS"
                const cutCat = (cut.category || '').toLowerCase();
                const userCat = userCategory.toLowerCase();

                let isCatMatch = false;
                if (userCat === 'general') {
                    if (cutCat.includes('open') || cutCat.includes('general')) isCatMatch = true;
                } else if (userCat.includes('obc')) {
                    if (cutCat.includes('obc')) isCatMatch = true;
                } else {
                    if (cutCat === userCat) isCatMatch = true;
                }
                if (!isCatMatch) continue;

                // 3. Quota Check
                // Scraped Quotas: "AI" (All India), "HS" (Home State), "OS" (Other State)
                const quota = (cut.quota || '').toUpperCase();

                // Logic: 
                // If Quota is HS, User MUST be HS.
                // If Quota is OS, User MUST be OS (Not HS).
                // If Quota is AI, Anyone can take.

                if (quota === 'HS' && !isHomeState) continue;
                if (quota === 'OS' && isHomeState) continue;
                if (quota.includes('HOME STATE') && !isHomeState) continue;
                if (quota.includes('OTHER STATE') && isHomeState) continue;

                // 4. Gender Check (Simplified)
                // Assuming most cutoffs are Gender-Neutral unless specified "Female"
                // If DB has explicit gender field in cutoff, check it.
                // For now, assuming "Gender-Neutral" refers to everyone.
                // If cut.category includes "Female", only Females.
                if (cutCat.includes('female') && userGender.toLowerCase() !== 'female') continue;

                // 5. Rank Check
                const closingRank = cut.closing;
                if (!closingRank) continue;

                const chance = getChance(estimatedRank, closingRank);

                if (chance) {
                    validBranches.push({
                        college_name: college.name,
                        course: cut.branch,
                        quota: quota || (isHomeState ? 'HS' : 'OS'),
                        ownership: college.type || 'Private',
                        fees: college.fees?.tuition ? `₹${(college.fees.tuition / 100000).toFixed(1)}L/yr` : 'TBD',
                        last_year_cutoff: closingRank,
                        chance: chance
                    });
                }
            }

            // Deduplicate branches (keep best chance or just all?)
            // Usually we show unique branch entries.
            // Let's sort by closing rank (descending -> higher cutoff = easier to get?) 
            // Actually lowest closing rank is toughest. 
            // We want to group by chance.

            for (const branch of validBranches) {
                if (branch.chance === 'Good Chances') results[resultGroup].good_chances.push(branch);
                else if (branch.chance === 'May Get') results[resultGroup].may_get.push(branch);
                else results[resultGroup].tough_chances.push(branch);
            }
        }

        // Sort results
        const sortByRank = (a, b) => a.last_year_cutoff - b.last_year_cutoff; // Lower rank = Better college (usually), but for "toughness" higher rank is easier? 
        // For display: "Closing Rank" - User wants to know if they cleared it.
        // Let's sort simply by valid branches.

        // Actually, users prefer to see "Best" colleges first. 
        // Best college = Lowest Closing Rank (e.g. Rank 100 is better than 1000).
        // So Ascending sort of Closing Rank.

        Object.keys(results).forEach(group => {
            results[group].good_chances.sort(sortByRank);
            results[group].may_get.sort(sortByRank);
            results[group].tough_chances.sort(sortByRank);
        });

    } catch (error) {
        console.error("Predictor Service Error:", error);
        // Fallback or empty return?
        // We return empty results structure to avoid crashing
    }

    // Calculate Summary
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
            category: userCategory,
            home_state: userHomeState,
            gender: userGender
        },
        estimated_rank: estimatedRank,
        summary,
        results
    };
};

module.exports = { predictColleges, percentileToRank };
