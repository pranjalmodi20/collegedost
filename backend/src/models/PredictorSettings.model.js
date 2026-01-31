const mongoose = require('mongoose');
const crypto = require('crypto');

// Encryption helpers
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-char-key-for-dev-only!'; // Must be 32 chars
const IV_LENGTH = 16;

const encrypt = (text) => {
    if (!text) return '';
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (err) {
        console.error('Encryption error:', err);
        return '';
    }
};

const decrypt = (text) => {
    if (!text || !text.includes(':')) return '';
    try {
        const parts = text.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const encryptedText = Buffer.from(parts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        console.error('Decryption error:', err);
        return '';
    }
};

const predictorSettingsSchema = new mongoose.Schema({
    // Singleton pattern - only one document
    _id: {
        type: String,
        default: 'predictor_settings'
    },
    
    // OpenAI Configuration
    openaiApiKey: {
        type: String,
        default: '',
        set: encrypt,
        get: decrypt
    },
    
    aiModel: {
        type: String,
        default: 'gpt-4o',
        enum: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
    },
    
    // Feature toggles
    isEnabled: {
        type: Boolean,
        default: false
    },
    
    useAI: {
        type: Boolean,
        default: true  // true = OpenAI, false = local algorithm
    },
    
    // Rate limiting
    maxRequestsPerUser: {
        type: Number,
        default: 10  // per day
    },
    
    // Cache settings
    cacheResultsMinutes: {
        type: Number,
        default: 60
    },
    
    // Last updated
    updatedAt: {
        type: Date,
        default: Date.now
    },
    
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Static method to get settings (singleton)
predictorSettingsSchema.statics.getSettings = async function() {
    let settings = await this.findById('predictor_settings');
    if (!settings) {
        settings = await this.create({ _id: 'predictor_settings' });
    }
    return settings;
};

// Method to check if API key is configured
predictorSettingsSchema.methods.hasApiKey = function() {
    return this.openaiApiKey && this.openaiApiKey.length > 10;
};

module.exports = mongoose.model('PredictorSettings', predictorSettingsSchema);
