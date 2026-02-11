import type { PredictorConfig, FlatCollege, NormalizedPrediction } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
  'Jammu and Kashmir', 'Puducherry',
];

interface CUETCollegeRaw {
  name?: string;
  location?: { city?: string; state?: string };
  type?: string;
  nirfRank?: number;
  admissions?: Array<{
    exam?: string;
    cutoff?: number;
    category?: string;
    course?: string;
  }>;
  slug?: string;
}

interface CUETRawResponse {
  success: boolean;
  data?: CUETCollegeRaw[];
  count?: number;
}

function parseCUETResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as CUETRawResponse;
  const colleges: FlatCollege[] = [];

  for (const college of raw.data || []) {
    const loc = college.location;
    const locationStr = loc ? [loc.city, loc.state].filter(Boolean).join(', ') : '';

    // Each college may have multiple admission entries
    for (const adm of college.admissions || []) {
      const cutoff = adm.cutoff || 0;
      // Simple chance heuristic — same logic as backend
      const chance: FlatCollege['chance'] = 'high'; // Data returned means within acceptable range

      const collegeName = college.name || 'Unknown University';
      const courseName = adm.course || 'General Programme';
      const categoryName = adm.category || 'General';

      colleges.push({
        id: `${collegeName.toLowerCase().replace(/\s+/g, '-')}-${courseName.toLowerCase().replace(/\s+/g, '-')}-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
        collegeName,
        location: locationStr,
        nirfRank: college.nirfRank,
        course: courseName,
        quota: categoryName,
        closingRank: cutoff,
        chance,
        institutionType: college.type || 'Central University',
        institutionAbbrev: (college.type || 'CU').slice(0, 3).toUpperCase(),
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

export const cuetConfig: PredictorConfig = {
  examName: 'CUET UG',
  examSlug: 'cuet-ug',
  year: 2026,
  pageTitle: 'CUET College Predictor 2026',
  pageSubtitle: 'Based on previous year CUET counselling & cutoff data',

  inputConfig: {
    label: 'CUET-UG Score / Rank',
    placeholder: 'Enter Rank (e.g. 5000)',
    type: 'rank',
    min: 1,
    max: 500000,
    step: 1,
    validationMessage: 'Please enter a valid CUET Rank (1 - 5,00,000)',
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
    ],
    institutionTypes: [
      { label: 'Central Universities', value: 'Central', defaultChecked: true },
      { label: 'State Universities', value: 'State', defaultChecked: true },
      { label: 'Private Universities', value: 'Private', defaultChecked: false },
      { label: 'Deemed Universities', value: 'Deemed', defaultChecked: false },
    ],
    branchInterests: [
      { label: 'Science', value: 'Science', defaultChecked: true },
      { label: 'Commerce', value: 'Commerce', defaultChecked: false },
      { label: 'Arts / Humanities', value: 'Arts', defaultChecked: false },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => ({
      rank: input.value,
      exam: 'CUET',
      category: input.category,
      state: input.homeState,
    }),
    parseResponse: parseCUETResponse,
  },

  sortOptions: [
    { label: 'Cutoff (Low to High)', value: 'closingRank' },
    { label: 'NIRF Rank', value: 'nirfRank' },
  ],

  urlPath: '/predictors/predict-colleges',
};
