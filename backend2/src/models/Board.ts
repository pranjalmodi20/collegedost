import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBoard extends Document {
    boardName: string;
    boardSlug: string;
    isTop: boolean;
    aiGuideContent?: any;
    aiGuideGeneratedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const boardSchema = new Schema<IBoard>({
    boardName: {
        type: String,
        required: [true, 'Please add a board name'],
        trim: true
    },
    boardSlug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    isTop: {
        type: Boolean,
        default: false
    },
    aiGuideContent: {
        type: Schema.Types.Mixed,
        default: null
    },
    aiGuideGeneratedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Board: Model<IBoard> = mongoose.model<IBoard>('Board', boardSchema);
export default Board;
