import { Request, Response } from 'express';
import { generateBoardGuide } from '../services/gemini.service';
import Board from '../models/Board';

// @desc    Get all boards
// @route   GET /api/boards
// @access  Public
export const getBoards = async (req: Request, res: Response): Promise<void> => {
    try {
        const isTop = req.query.isTop === 'true';
        const filter = isTop ? { isTop: true } : {};

        const boards = await Board.find(filter).sort({ boardName: 1 });

        res.status(200).json({
            success: true,
            count: boards.length,
            data: boards
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get single board by ID
// @route   GET /api/boards/:id
// @access  Private/Admin
export const getBoardById = async (req: Request, res: Response): Promise<void> => {
    try {
        const board = await Board.findById(req.params.id);

        if (!board) {
            res.status(404).json({
                success: false,
                message: 'Board not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: board
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create new board
// @route   POST /api/boards
// @access  Private/Admin
export const createBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const board = await Board.create(req.body);

        res.status(201).json({
            success: true,
            data: board
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create board'
        });
    }
};

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private/Admin
export const updateBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!board) {
            res.status(404).json({
                success: false,
                message: 'Board not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: board
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update board'
        });
    }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private/Admin
export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const board = await Board.findByIdAndDelete(req.params.id);

        if (!board) {
            res.status(404).json({
                success: false,
                message: 'Board not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get AI-generated board guide
// @route   GET /api/boards/:slug/guide
// @access  Public
export const getBoardGuide = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('[Board Controller] Missing GEMINI_API_KEY in environment variables');
            res.status(500).json({
                success: false,
                message: 'Backend Configuration Error: Missing GEMINI_API_KEY on server.'
            });
            return;
        }

        const slug = req.params.slug as string;

        // Try to find the board in DB to get its official name
        let board = await Board.findOne({ boardSlug: slug });
        let boardName = board?.boardName;

        // Fallback for names if not in DB
        if (!boardName) {
            const slugToNameMap: Record<string, string> = {
                'gseb-hsc': 'GSEB HSC',
                'maharashtra-ssc': 'Maharashtra SSC',
                'karnataka-2nd-puc': 'Karnataka 2nd PUC',
                'gseb-ssc': 'GSEB SSC',
                'tamilnadu-12th': 'Tamilnadu 12th',
                'up-12th': 'UP 12th',
                'odisha-chse': 'Odisha CHSE',
                'pseb-12th': 'PSEB 12th',
                'maharashtra-hsc': 'Maharashtra HSC',
                'cbse-12th': 'CBSE 12th',
            };
            boardName = slugToNameMap[slug];
        }

        // Final dynamic formatting if still no name
        if (!boardName) {
            boardName = slug
                .split('-')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .replace(/\b(Hsc|Ssc|Puc|Chse|Cbse|Usp|Gseb|Pseb)\b/gi, (match: string) => match.toUpperCase());
        }

        // Caching Logic: If board exists and has guide content generated recently (e.g. within 7 days)
        const CACHE_STALE_DAYS = 7;
        const now = new Date();
        const staleDate = new Date(now.getTime() - CACHE_STALE_DAYS * 24 * 60 * 60 * 1000);

        if (board?.aiGuideContent && board.aiGuideGeneratedAt && board.aiGuideGeneratedAt > staleDate) {
            console.log(`[Gemini] Returning cached guide for Board: ${boardName} (slug: ${slug})`);
            res.status(200).json({
                success: true,
                cached: true,
                data: board.aiGuideContent
            });
            return;
        }

        console.log(`[Gemini] Generating guide for Board: ${boardName} (slug: ${slug})`);
        const guideData = await generateBoardGuide(boardName, slug);

        // Save to cache if board exists in DB
        if (board) {
            board.aiGuideContent = guideData;
            board.aiGuideGeneratedAt = now;
            await board.save();
        }

        res.status(200).json({
            success: true,
            cached: false,
            data: guideData
        });
    } catch (error: any) {
        console.error('[Gemini Board Guide Error]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate board guide. Please try again later.',
            error: error.message
        });
    }
};
