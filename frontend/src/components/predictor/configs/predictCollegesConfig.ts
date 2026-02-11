import type { PredictorConfig, FlatCollege, NormalizedPrediction } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
];

interface GenericCollegeRaw {
  _id?: string;
  name?: string;
  slug?: string;
  location?: { city?: string; state?: string };
  type?: string;
  nirfRank?: number;
  matchingCutoffs?: Array<{
    branch?: string;
    closing?: number;
    opening?: number;
    category?: string;
  }>;
}

interface GenericRawResponse {
  success: boolean;
  data?: GenericCollegeRaw[];
  count?: number;
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

function calculateChance(userRank: number, closingRank: number): 'high' | 'medium' | 'low' {
  if (!closingRank || closingRank === 0) return 'medium';
  const ratio = userRank / closingRank;
  if (ratio <= 0.8) return 'high';
  if (ratio <= 1.0) return 'medium';
  return 'low';
}

function parseGenericResponse(data: Record<string, unknown>, userRank?: number): NormalizedPrediction {
  const raw = data as unknown as GenericRawResponse;
  const colleges: FlatCollege[] = [];

  for (const college of raw.data || []) {
    const loc = college.location;
    const locationStr = loc ? [loc.city, loc.state].filter(Boolean).join(', ') : '';

    for (const cut of college.matchingCutoffs || []) {
      const closingRank = cut.closing || 0;
      const chance = userRank ? calculateChance(userRank, closingRank) : 'high';
      const categoryName = cut.category || 'General';

      colleges.push({
        id: `${college._id}-${cut.branch}-${closingRank}-${categoryName}`,
        collegeName: college.name || 'Unknown College',
        location: locationStr,
        nirfRank: college.nirfRank,
        course: cut.branch || 'General',
        quota: categoryName,
        closingRank,
        chance,
        institutionType: college.type || 'Other',
        institutionAbbrev: getAbbrev(college.type || ''),
      });
    }
  }

  colleges.sort((a, b) => (a.closingRank || 0) - (b.closingRank || 0));

  return {
    success: raw.success,
    totalResults: colleges.length,
    colleges,
    summary: {
      high: colleges.filter((c) => c.chance === 'high').length,
      medium: colleges.filter((c) => c.chance === 'medium').length,
      low: colleges.filter((c) => c.chance === 'low').length,
    },
  };
}

export const predictCollegesConfig: PredictorConfig = {
  examName: 'College Predictor',
  examSlug: 'college-predictor',
  year: 2026,
  pageTitle: 'College Predictor 2026',
  pageSubtitle: 'Enter your rank and category to find colleges you can get into',

  inputConfig: {
    label: 'Your Rank',
    placeholder: 'Enter Rank (e.g. 15000)',
    type: 'rank',
    min: 1,
    max: 1500000,
    step: 1,
    validationMessage: 'Please enter a valid rank',
  },

  categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'],
  states: INDIAN_STATES,
  genders: ['Male', 'Female'],

  steps: [
    { number: 1, label: 'Exam Details' },
    { number: 2, label: 'Category & State' },
    { number: 3, label: 'Recommendations' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India Quota', value: 'All India', defaultChecked: true },
      { label: 'Home State Quota', value: 'Home State', defaultChecked: false },
      { label: 'Other State Quota', value: 'Other State', defaultChecked: false },
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
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => ({
      rank: input.value,
      exam: 'JEE Main',
      category: input.category,
      state: input.homeState,
    }),
    parseResponse: parseGenericResponse,
  },

  sortOptions: [
    { label: 'Closing Rank (Low to High)', value: 'closingRank' },
    { label: 'NIRF Rank', value: 'nirfRank' },
  ],

  urlPath: '/predictors/predict-colleges',
};
