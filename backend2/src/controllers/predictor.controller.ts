import { Request, Response } from 'express';
import Prediction from '../models/Prediction';
import College from '../models/College';

// @desc    Predict colleges based on JEE Main Percentile
// @route   POST /api/predictor/predict-by-percentile
// @access  Public
export const predictByPercentile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { percentile, category, homeState, gender, exam = 'JEE Main' } = req.body;

        if (!percentile || !category || !homeState || !gender) {
            res.status(400).json({ success: false, message: 'Please provide all details' });
            return;
        }

        // Logic to calculate expected rank from percentile (approximate)
        // Total candidates ~12 Lakhs
        const totalCandidates = 1200000;
        const expectedRank = Math.floor((100 - percentile) * totalCandidates / 100);

        // Fetch colleges based on cutoffs
        // We will categorize them into Good, May Get, Tough

        // Good: Closing Rank > Rank * 1.2
        // May Get: Closing Rank between Rank * 0.8 and Rank * 1.2
        // Tough: Closing Rank < Rank * 0.8

        const colleges = await College.find({
            cutoffs: {
                $elemMatch: {
                    exam: exam,
                    category: category
                }
            }
        }).select('name location type cutoffs coursesOffered');

        const results: Record<string, Record<string, any[]>> = {
            NITs: { good_chances: [], may_get: [], tough_chances: [] },
            IIITs: { good_chances: [], may_get: [], tough_chances: [] },
            GFTIs: { good_chances: [], may_get: [], tough_chances: [] },
            Private_Deemed: { good_chances: [], may_get: [], tough_chances: [] }
        };

        const summary: Record<string, number> = { good_chances: 0, may_get: 0, tough_chances: 0 };

        for (const college of colleges) {
            // Find best matching cutoff for this user
            // In reality, we should match by state quota (HS vs OS)
            // matchingCutoff = college.cutoffs.find(...)

            // For now, simplify: use the max closing rank for the category
            // TODO: Refine this with Home State logic
            const relevantCutoffs = college.cutoffs.filter(c => c.exam === exam && c.category === category);
            if (!relevantCutoffs.length) continue;

            // Take the best branch (highest closing rank) just for eligibility check
            // or iterate all branches

            for (const seat of relevantCutoffs) {
                const closingRank = seat.closingRank;
                let chanceType = '';

                if (closingRank > expectedRank * 1.1) chanceType = 'good_chances';
                else if (closingRank > expectedRank * 0.9) chanceType = 'may_get';
                else chanceType = 'tough_chances';

                const collegeType = determineCollegeType(college.name, college.type); // Helper to categorize into NIT/IIIT etc.

                // Add to results
                // Avoid duplicates if multiple branches match? 
                // Front end expects list of colleges with "course" field.

                const entry = {
                    college_name: college.name,
                    course: seat.branch,
                    quota: 'AI', // Defaulting to All India for simplicity
                    ownership: college.type,
                    last_year_cutoff: closingRank,
                    fees: college.coursesOffered[0]?.fee ? `₹${(college.coursesOffered[0].fee / 100000).toFixed(1)}L` : 'N/A'
                };

                if (results[collegeType]) {
                    results[collegeType][chanceType].push(entry);
                    summary[chanceType]++;
                }
            }
        }

        // Save prediction? Optional.
        const newPrediction = await Prediction.create({
            input: { percentile, category, homeState, gender, exam },
            results: results, // Note: This might be large
            // user: req.user.id // if authenticated
        });

        res.status(200).json({
            success: true,
            predictionId: newPrediction._id,
            input: newPrediction.input,
            estimated_rank: expectedRank,
            summary,
            results,
            iit_eligibility: {
                eligible_for_jee_advanced: percentile > 90, // Rough check
                note: percentile > 90 ? "You are likely eligible." : "You might miss the cutoff."
            }
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper function
function determineCollegeType(name: string, type: string): string {
    if (name.includes('National Institute of Technology') || name.includes('NIT')) return 'NITs';
    if (name.includes('Indian Institute of Information Technology') || name.includes('IIIT')) return 'IIITs';
    if (type === 'Government') return 'GFTIs';
    return 'Private_Deemed';
}

// @desc    Get prediction by ID
// @route   GET /api/predictor/prediction/:id
// @access  Public
export const getPredictionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            res.status(404).json({ success: false, message: 'Prediction not found' });
            return;
        }
        res.status(200).json({ success: true, ...prediction.toObject() });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
