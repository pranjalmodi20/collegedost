import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICourse {
    name: string;
    fee: number;
    duration: string;
    type: 'Full-time' | 'Part-time' | 'Distance';
}

export interface IPlacement {
    averagePackage: number;
    highestPackage: number;
    placementPercentage: number;
}

export interface ICutoff {
    exam: string;
    branch: string;
    category: string;
    closingRank: number;
    year: number;
}

export interface IScholarship {
    name: string;
    amount: number;
    eligibility: string;
}

export interface ICollege extends Document {
    name: string;
    slug: string;
    logo: string;
    backgroundImg: string;
    location: {
        city: string;
        state: string;
        country: string;
    };
    type: string; // e.g., Private, Government
    nirfRank?: number;
    rating?: number;
    coursesOffered: ICourse[];
    placements: IPlacement;
    gallery: string[];
    brochureUrl?: string;
    website?: string;
    description?: string;
    cutoffs: ICutoff[];
    facilities: string[];
    scholarships: IScholarship[];
    createdAt: Date;
    updatedAt: Date;
}

const collegeSchema = new Schema<ICollege>({
    name: {
        type: String,
        required: [true, 'Please add a college name'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    logo: String,
    backgroundImg: String,
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, default: 'India' }
    },
    type: String,
    nirfRank: Number,
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    coursesOffered: [{
        name: String,
        fee: Number,
        duration: String,
        type: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Distance'],
            default: 'Full-time'
        }
    }],
    placements: {
        averagePackage: Number,
        highestPackage: Number,
        placementPercentage: Number
    },
    gallery: [String],
    brochureUrl: String,
    website: String,
    description: String,
    cutoffs: [{
        exam: String,
        branch: String,
        category: String,
        closingRank: Number,
        year: Number
    }],
    facilities: [String],
    scholarships: [{
        name: String,
        amount: Number,
        eligibility: String
    }]
}, {
    timestamps: true
});

// Index for search
collegeSchema.index({ name: 'text', 'location.city': 'text', 'location.state': 'text' });

const College: Model<ICollege> = mongoose.model<ICollege>('College', collegeSchema);
export default College;
