import { jeeConfig } from './jeeConfig';

export const aiimsConfig = {
  ...jeeConfig,
  examName: 'AIIMS INI-CET',
  examSlug: 'aiims-ini-cet',
  year: 2026,
  pageTitle: 'AIIMS INI-CET Predictor 2026',
  pageSubtitle: 'Estimate seat chances for AIIMS / INI-CET based on your score/percentile',
  inputConfig: { ...jeeConfig.inputConfig, label: 'Score / Percentile', placeholder: 'Enter score or percentile (e.g. 97.5)', type: 'percentile' },
  apiConfig: { ...jeeConfig.apiConfig, buildRequestPayload: (input: any) => ({ ...jeeConfig.apiConfig.buildRequestPayload(input), exam: 'AIIMS INI-CET' }) },
  urlPath: '/predictors/aiims-predictor',
};
