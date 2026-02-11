import { Request, Response } from 'express';
import Review from '../models/Review';
import College from '../models/College';

// @desc    Get reviews for a college
// @route   GET /api/reviews/college/:collegeId
// @access  Public
export const getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { collegeId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ college: collegeId })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ college: collegeId });

        res.status(200).json({
            success: true,
            count: reviews.length,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                total
            },
            data: reviews
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req: any, res: Response): Promise<void> => {
    try {
        const { collegeId, rating, comment } = req.body;

        const college = await College.findById(collegeId);
        if (!college) {
            res.status(404).json({ success: false, message: 'College not found' });
            return;
        }

        const alreadyReviewed = await Review.findOne({
            user: req.user.id,
            college: collegeId
        });

        if (alreadyReviewed) {
            res.status(400).json({ success: false, message: 'You have already reviewed this college' });
            return;
        }

        const review = await Review.create({
            user: req.user.id,
            college: collegeId,
            rating,
            comment
        });

        // Update college rating
        // Calculate new average
        const stats = await Review.aggregate([
            { $match: { college: college._id } },
            {
                $group: {
                    _id: '$college',
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        if (stats.length > 0) {
            await College.findByIdAndUpdate(collegeId, {
                rating: stats[0].avgRating
            });
        }

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
