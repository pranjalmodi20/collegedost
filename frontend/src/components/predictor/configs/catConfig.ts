import { jeeConfig } from './jeeConfig';

export const catConfig = {
  ...jeeConfig,
  examName: 'CAT',
  examSlug: 'cat',
  year: 2026,
  pageTitle: 'CAT College Predictor 2026',
  pageSubtitle: 'Predict management colleges based on CAT percentile and profile',
  inputConfig: { ...jeeConfig.inputConfig, label: 'CAT Percentile', placeholder: 'Enter CAT percentile (e.g. 95)', type: 'percentile' },
  apiConfig: { ...jeeConfig.apiConfig, buildRequestPayload: (input: any) => ({ ...jeeConfig.apiConfig.buildRequestPayload(input), exam: 'CAT' }) },
  urlPath: '/predictors/cat-predictor',
};
