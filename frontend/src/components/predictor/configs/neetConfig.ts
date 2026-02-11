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

const SECTION_ABBREV: Record<string, string> = {
  AIIMS: 'AIIMS',
  JIPMER: 'JIPMER',
  Government_Medical: 'GMC',
  Private_Medical: 'PVT',
  Dental: 'BDS',
};

interface NEETCollegeEntry {
  college_name: string;
  course?: string;
  quota?: string;
  ownership?: string;
  last_year_cutoff?: number;
  fees?: string;
  state?: string;
  city?: string;
}

interface NEETChanceGroup {
  good_chances?: NEETCollegeEntry[];
  may_get?: NEETCollegeEntry[];
  tough_chances?: NEETCollegeEntry[];
}

interface NEETRawResponse {
  success: boolean;
  predictionId?: string;
  input?: { score?: number; category?: string; homeState?: string; gender?: string };
  estimated_rank?: number;
  aiimsEligibility?: Record<string, unknown>;
  summary?: { good_chances?: number; may_get?: number; tough_chances?: number };
  results?: Record<string, NEETChanceGroup>;
  predictor_status?: { powered_by?: string; model?: string };
}

function flattenSection(
  sectionName: string,
  sectionData: NEETChanceGroup,
  out: FlatCollege[]
): { high: number; medium: number; low: number } {
  let high = 0;
  let medium = 0;
  let low = 0;
  const abbrev = SECTION_ABBREV[sectionName] || sectionName.slice(0, 3).toUpperCase();

  let entryIndex = 0;
  const mapEntry = (entry: NEETCollegeEntry, chance: FlatCollege['chance']): FlatCollege => {
    const collegeName = entry.college_name || 'Unknown College';
    const courseName = entry.course || 'MBBS';
    const cutoff = entry.last_year_cutoff || 0;
    entryIndex++;
    return {
      id: `${collegeName.toLowerCase().replace(/\s+/g, '-')}-${courseName.toLowerCase().replace(/\s+/g, '-')}-${chance}-${cutoff}-${entryIndex}`,
      collegeName,
      location: [entry.city, entry.state].filter(Boolean).join(', '),
      course: courseName,
      quota: entry.quota || 'All India',
      closingRank: cutoff,
      chance,
      institutionType: sectionName,
      institutionAbbrev: abbrev,
    };
  };

  for (const e of sectionData.good_chances || []) {
    out.push(mapEntry(e, 'high'));
    high++;
  }
  for (const e of sectionData.may_get || []) {
    out.push(mapEntry(e, 'medium'));
    medium++;
  }
  for (const e of sectionData.tough_chances || []) {
    out.push(mapEntry(e, 'low'));
    low++;
  }

  return { high, medium, low };
}

function parseNEETResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as NEETRawResponse;
  const colleges: FlatCollege[] = [];
  let totalHigh = 0;
  let totalMedium = 0;
  let totalLow = 0;

  if (raw.results) {
    for (const [section, sectionData] of Object.entries(raw.results)) {
      const counts = flattenSection(section, sectionData as NEETChanceGroup, colleges);
      totalHigh += counts.high;
      totalMedium += counts.medium;
      totalLow += counts.low;
    }
  }

  colleges.sort((a, b) => {
    const chanceOrder = { high: 1, medium: 2, low: 3 };
    const chanceDiff = chanceOrder[a.chance] - chanceOrder[b.chance];
    if (chanceDiff !== 0) return chanceDiff;
    return (a.closingRank || 0) - (b.closingRank || 0);
  });

  return {
    success: raw.success,
    predictionId: raw.predictionId,
    totalResults: colleges.length,
    colleges,
    summary: {
      high: raw.summary?.good_chances ?? totalHigh,
      medium: raw.summary?.may_get ?? totalMedium,
      low: raw.summary?.tough_chances ?? totalLow,
    },
    estimatedRank: raw.estimated_rank,
    additionalInfo: raw.aiimsEligibility ? { aiimsEligibility: raw.aiimsEligibility } : undefined,
  };
}

export const neetConfig: PredictorConfig = {
  examName: 'NEET UG',
  examSlug: 'neet-ug',
  year: 2026,
  pageTitle: 'NEET College Predictor 2026',
  pageSubtitle: 'Based on previous year NEET cutoffs & counselling data',

  inputConfig: {
    label: 'NEET-UG Score',
    placeholder: 'Enter Score (e.g. 580)',
    type: 'score',
    min: 0,
    max: 720,
    step: 1,
    validationMessage: 'Please enter a valid NEET Score (0 - 720)',
  },

  categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
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
      { label: 'State Quota', value: 'State', defaultChecked: false },
      { label: 'Management Quota', value: 'Management', defaultChecked: false },
    ],
    institutionTypes: [
      { label: 'AIIMS', value: 'AIIMS', defaultChecked: true },
      { label: 'JIPMER', value: 'JIPMER', defaultChecked: true },
      { label: 'Govt. Medical Colleges', value: 'Government_Medical', defaultChecked: true },
      { label: 'Private Medical', value: 'Private_Medical', defaultChecked: false },
      { label: 'Dental (BDS)', value: 'Dental', defaultChecked: false },
    ],
    branchInterests: [
      { label: 'MBBS', value: 'MBBS', defaultChecked: true },
      { label: 'BDS', value: 'BDS', defaultChecked: false },
      { label: 'BAMS / BHMS', value: 'BAMS,BHMS', defaultChecked: false },
    ],
  },

  apiConfig: {
    predictEndpoint: '/predictor/neet-predict',
    predictMethod: 'POST',
    buildRequestPayload: (input) => ({
      score: input.value,
      category: input.category,
      homeState: input.homeState,
      gender: input.gender,
    }),
    parseResponse: parseNEETResponse,
    loadPredictionEndpoint: '/predictor/neet-prediction',
  },

  sortOptions: [
    { label: 'Cutoff Rank (Low to High)', value: 'closingRank' },
    { label: 'Admission Chance', value: 'chance' },
  ],

  urlPath: '/predictors/neet-predictor',
};
