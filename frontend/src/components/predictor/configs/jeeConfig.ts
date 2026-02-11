import type { PredictorConfig, FlatCollege, NormalizedPrediction } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Chandigarh', 'Puducherry', 'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
];

function getAbbrev(type: string): string {
  const t = (type || '').toLowerCase();
  if (t.includes('iit') && !t.includes('iiit')) return 'IIT';
  if (t.includes('iiit')) return 'IIIT';
  if (t.includes('nit')) return 'NIT';
  if (t.includes('gfti')) return 'GFTI';
  if (t.includes('private') || t.includes('deemed')) return 'PVT';
  return type?.slice(0, 3).toUpperCase() || 'COL';
}

interface JEEBranch {
  branch: string;
  closingRank: number;
  openingRank?: number;
  category: string;
  year?: number;
  chance: string;
  quota: string;
}

interface JEECollege {
  name: string;
  location?: { city?: string; state?: string };
  type?: string;
  nirfRank?: number;
  matchedBranches: JEEBranch[];
}

interface JEERawResponse {
  success: boolean;
  count: number;
  colleges: JEECollege[];
}

function parseJEEResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as JEERawResponse;
  const colleges: FlatCollege[] = [];
  let high = 0;
  let medium = 0;
  let low = 0;

  for (const college of raw.colleges || []) {
    for (const branch of college.matchedBranches || []) {
      const chanceLower = (branch.chance || 'low').toLowerCase();
      const chance = (chanceLower === 'high' ? 'high' : chanceLower === 'medium' ? 'medium' : 'low') as FlatCollege['chance'];

      if (chance === 'high') high++;
      else if (chance === 'medium') medium++;
      else low++;

      const loc = college.location;
      const locationStr = loc ? [loc.city, loc.state].filter(Boolean).join(', ') : '';

      colleges.push({
        id: `${college.name}-${branch.branch}-${branch.quota}-${branch.closingRank}`,
        collegeName: college.name || 'Unknown College',
        location: locationStr,
        nirfRank: college.nirfRank,
        course: branch.branch || 'General',
        quota: branch.quota || 'All India',
        closingRank: branch.closingRank || 0,
        chance,
        institutionType: college.type || 'Other',
        institutionAbbrev: getAbbrev(college.type || ''),
      });
    }
  }

  // Sort by chance (High first) then by closing rank
  colleges.sort((a, b) => {
    const chanceOrder = { high: 1, medium: 2, low: 3 };
    const chanceDiff = chanceOrder[a.chance] - chanceOrder[b.chance];
    if (chanceDiff !== 0) return chanceDiff;
    return (a.closingRank || 0) - (b.closingRank || 0);
  });

  return {
    success: raw.success ?? false,
    totalResults: colleges.length,
    colleges,
    summary: { high, medium, low },
  };
}

export const jeeConfig: PredictorConfig = {
  examName: 'JEE Main',
  examSlug: 'jee-main',
  year: 2026,
  pageTitle: 'JEE Main College Predictor 2026',
  pageSubtitle: 'Based on previous year opening & closing ranks',

  inputConfig: {
    label: 'JEE Main Rank',
    placeholder: 'Enter Rank (e.g. 15000)',
    type: 'rank',
    min: 1,
    max: 1500000,
    step: 1,
    validationMessage: 'Please enter a valid JEE Main Rank (1 - 15,00,000)',
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
    predictEndpoint: '/predictor/jee-main',
    predictMethod: 'POST',
    buildRequestPayload: (input) => ({
      rank: input.value,
      category: input.category,
      homeState: input.homeState,
      gender: input.gender,
    }),
    parseResponse: parseJEEResponse,
  },

  sortOptions: [
    { label: 'Closing Rank (Low to High)', value: 'closingRank' },
    { label: 'Admission Chance', value: 'chance' },
    { label: 'NIRF Rank', value: 'nirfRank' },
  ],

  urlPath: '/predictors/jee-main-predictor',
};
