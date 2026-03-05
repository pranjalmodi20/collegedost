import express from 'express';
import {
    getBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardGuide
} from '../controllers/board.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getBoards)
    .post(protect, authorize('admin'), createBoard);

router.route('/:slug/guide')
    .get(getBoardGuide);

router.route('/:id')
    .get(protect, authorize('admin'), getBoardById)
    .put(protect, authorize('admin'), updateBoard)
    .delete(protect, authorize('admin'), deleteBoard);

export default router;
