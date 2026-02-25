import { PredictorConfig } from '../types';
import { jeeConfig } from './jeeConfig';

export const bitsatConfig: PredictorConfig = {
  ...jeeConfig,
  examName: 'BITSAT',
  examSlug: 'bitsat',
  year: 2026,
  pageTitle: 'BITSAT College Predictor 2026',
  pageSubtitle: 'Estimate BITS admissions based on BITSAT score and preferences',
  inputConfig: { ...jeeConfig.inputConfig, label: 'BITSAT Score', placeholder: 'Enter BITSAT score (e.g. 280)', type: 'score' },
  apiConfig: { ...jeeConfig.apiConfig, buildRequestPayload: (input: any) => ({ ...jeeConfig.apiConfig.buildRequestPayload(input), exam: 'BITSAT' }) },
  urlPath: '/predictors/bitsat-predictor',
};
