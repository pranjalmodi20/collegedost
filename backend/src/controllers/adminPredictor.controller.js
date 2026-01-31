/**
 * Admin Predictor Settings Controller
 * Manages OpenAI configuration and predictor settings
 */

const PredictorSettings = require('../models/PredictorSettings.model');
const { testAIConnection, predictWithAI } = require('../services/aiPredictorService');
const { predictColleges: predictLocal } = require('../services/collegePredictorService');

// @desc    Get predictor settings (admin only)
// @route   GET /api/admin/predictor-settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
    try {
        const settings = await PredictorSettings.getSettings();
        
        // Don't expose full API key
        const safeSettings = {
            isEnabled: settings.isEnabled,
            useAI: settings.useAI,
            aiModel: settings.aiModel,
            hasApiKey: settings.hasApiKey(),
            apiKeyPreview: settings.openaiApiKey ? 
                `sk-...${settings.openaiApiKey.slice(-4)}` : 'Not configured',
            maxRequestsPerUser: settings.maxRequestsPerUser,
            cacheResultsMinutes: settings.cacheResultsMinutes,
            updatedAt: settings.updatedAt
        };

        res.status(200).json({
            success: true,
            data: safeSettings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update predictor settings (admin only)
// @route   PUT /api/admin/predictor-settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
    try {
        const {
            openaiApiKey,
            aiModel,
            isEnabled,
            useAI,
            maxRequestsPerUser,
            cacheResultsMinutes
        } = req.body;

        const settings = await PredictorSettings.getSettings();

        // Update fields if provided
        if (openaiApiKey !== undefined && openaiApiKey !== '') {
            settings.openaiApiKey = openaiApiKey;
        }
        if (aiModel !== undefined) {
            settings.aiModel = aiModel;
        }
        if (isEnabled !== undefined) {
            settings.isEnabled = isEnabled;
        }
        if (useAI !== undefined) {
            settings.useAI = useAI;
        }
        if (maxRequestsPerUser !== undefined) {
            settings.maxRequestsPerUser = maxRequestsPerUser;
        }
        if (cacheResultsMinutes !== undefined) {
            settings.cacheResultsMinutes = cacheResultsMinutes;
        }

        settings.updatedAt = new Date();
        settings.updatedBy = req.user?._id;

        await settings.save();

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: {
                isEnabled: settings.isEnabled,
                useAI: settings.useAI,
                aiModel: settings.aiModel,
                hasApiKey: settings.hasApiKey()
            }
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Test OpenAI connection (admin only)
// @route   POST /api/admin/predictor-settings/test
// @access  Private/Admin
exports.testConnection = async (req, res) => {
    try {
        const result = await testAIConnection();
        res.status(200).json({
            success: result.success,
            message: result.message,
            model: result.model
        });
    } catch (error) {
        console.error('Test connection error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Test predictor with sample input (admin only)
// @route   POST /api/admin/predictor-settings/test-predict
// @access  Private/Admin
exports.testPredict = async (req, res) => {
    try {
        const { percentile, category, homeState, gender } = req.body;

        const pct = parseFloat(percentile) || 95;
        const cat = category || 'General';
        const state = homeState || 'Delhi';
        const gen = gender || 'Male';

        const settings = await PredictorSettings.getSettings();

        let prediction;
        
        if (settings.useAI && settings.hasApiKey()) {
            // Use AI prediction
            prediction = await predictWithAI(pct, cat, state, gen);
        } else {
            // Use local algorithm
            prediction = predictLocal(pct, cat, state, gen);
            prediction.predictor_status = {
                enabled: settings.isEnabled,
                model: 'local-algorithm',
                powered_by: 'CollegeDost'
            };
        }

        res.status(200).json({
            success: true,
            ...prediction
        });
    } catch (error) {
        console.error('Test predict error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete/Reset API key (admin only)
// @route   DELETE /api/admin/predictor-settings/api-key
// @access  Private/Admin
exports.deleteApiKey = async (req, res) => {
    try {
        const settings = await PredictorSettings.getSettings();
        settings.openaiApiKey = '';
        settings.updatedAt = new Date();
        await settings.save();

        res.status(200).json({
            success: true,
            message: 'API key removed successfully'
        });
    } catch (error) {
        console.error('Delete API key error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
