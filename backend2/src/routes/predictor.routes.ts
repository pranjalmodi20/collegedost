import express from 'express';
import {
    predictByPercentile,
    getPredictionById
} from '../controllers/predictor.controller';

const router = express.Router();

router.post('/predict-by-percentile', predictByPercentile);
router.get('/prediction/:id', getPredictionById);

export default router;
