import type { PredictorConfig, FlatCollege, NormalizedPrediction } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
];

interface RankRawResponse {
  success: boolean;
  predictionId?: string;
  prediction?: {
    expectedRank?: number;
    rankRange?: { low?: number; high?: number };
    confidence?: string;
  };
  eligibility?: Record<string, boolean>;
  collegePossibilities?: Array<{
    name?: string;
    type?: string;
    branches?: string[];
    location?: string;
    chance?: string;
  }>;
  tips?: string[];
  input?: { percentile?: number; marks?: number; category?: string };
}

function getAbbrev(type: string): string {
  const t = (type || '').toLowerCase();
  if (t.includes('iit') && !t.includes('iiit')) return 'IIT';
  if (t.includes('iiit')) return 'IIIT';
  if (t.includes('nit')) return 'NIT';
  if (t.includes('gfti')) return 'GFTI';
  if (t.includes('private') || t.includes('deemed')) return 'PVT';
  return type?.slice(0, 3).toUpperCase() || 'COL';
}

function parseRankResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as RankRawResponse;
  const colleges: FlatCollege[] = [];

  for (const col of raw.collegePossibilities || []) {
    const chanceLower = (col.chance || 'medium').toLowerCase();
    const chance = (chanceLower === 'high' || chanceLower === 'good' ? 'high' : chanceLower === 'medium' || chanceLower === 'moderate' ? 'medium' : 'low') as FlatCollege['chance'];

    // Each college possibility may list multiple branches
    for (const branch of col.branches || ['General']) {
      colleges.push({
        id: `${col.name}-${branch}-${chance}`,
        collegeName: col.name || 'Unknown College',
        location: col.location || '',
        course: branch,
        quota: 'All India',
        closingRank: 0, // Not available in this API
        chance,
        institutionType: col.type || 'Other',
        institutionAbbrev: getAbbrev(col.type || ''),
      });
    }
  }

  const high = colleges.filter((c) => c.chance === 'high').length;
  const medium = colleges.filter((c) => c.chance === 'medium').length;
  const low = colleges.filter((c) => c.chance === 'low').length;

  return {
    success: raw.success,
    predictionId: raw.predictionId,
    totalResults: colleges.length,
    colleges,
    summary: { high, medium, low },
    estimatedRank: raw.prediction?.expectedRank,
    additionalInfo: raw.eligibility ? { eligibility: raw.eligibility, tips: raw.tips } : undefined,
  };
}

export const rankPredictorConfig: PredictorConfig = {
  examName: 'JEE Main Rank',
  examSlug: 'jee-rank',
  year: 2026,
  pageTitle: 'Rank Predictor 2026',
  pageSubtitle: 'Estimate your rank based on your expected score',

  inputConfig: {
    label: 'Your Score / Percentile',
    placeholder: 'Enter Score (e.g. 250)',
    type: 'score',
    min: 0,
    max: 300,
    step: 1,
    validationMessage: 'Please enter a valid score',
  },

  categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'],
  states: INDIAN_STATES,
  genders: ['Male', 'Female'],

  steps: [
    { number: 1, label: 'Enter Score' },
    { number: 2, label: 'Category' },
    { number: 3, label: 'Rank Estimate' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India Quota', value: 'All India', defaultChecked: true },
    ],
    institutionTypes: [
      { label: 'IITs', value: 'IIT', defaultChecked: true },
      { label: 'NITs', value: 'NIT', defaultChecked: true },
      { label: 'IIITs', value: 'IIIT', defaultChecked: true },
      { label: 'GFTIs', value: 'GFTI', defaultChecked: false },
    ],
    branchInterests: [
      { label: 'Computer Science', value: 'Computer', defaultChecked: true },
      { label: 'Electronics', value: 'Electron', defaultChecked: false },
      { label: 'Mechanical', value: 'Mechanic', defaultChecked: false },
    ],
  },

  apiConfig: {
    predictEndpoint: '/predictor/jee-rank-predict',
    predictMethod: 'POST',
    buildRequestPayload: (input) => ({
      marks: input.value,
      category: input.category,
    }),
    parseResponse: parseRankResponse,
    loadPredictionEndpoint: '/predictor/jee-rank-prediction',
  },

  sortOptions: [
    { label: 'Admission Chance', value: 'chance' },
  ],

  urlPath: '/predictors/rank-predictor',
};
