import express from 'express';
import { getReviews, addReview } from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .post(protect, addReview);

router.route('/college/:collegeId')
    .get(getReviews);

export default router;
