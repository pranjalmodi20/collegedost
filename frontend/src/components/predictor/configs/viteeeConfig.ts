import { PredictorConfig } from '../types';
import { jeeConfig } from './jeeConfig';

export const viteeeConfig: PredictorConfig = {
  ...jeeConfig,
  examName: 'VITEEE',
  examSlug: 'viteee',
  year: 2026,
  pageTitle: 'VITEEE College Predictor 2026',
  pageSubtitle: 'Predict VIT campus chances using your VITEEE score',
  inputConfig: { ...jeeConfig.inputConfig, label: 'VITEEE Score', placeholder: 'Enter VITEEE score (e.g. 140)', type: 'score' },
  apiConfig: { ...jeeConfig.apiConfig, buildRequestPayload: (input: any) => ({ ...jeeConfig.apiConfig.buildRequestPayload(input), exam: 'VITEEE' }) },
  urlPath: '/predictors/viteee-predictor',
};
