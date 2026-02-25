import { PredictorConfig } from '../types';
import { jeeConfig } from './jeeConfig';

export const clatConfig: PredictorConfig = {
  ...jeeConfig,
  examName: 'CLAT',
  examSlug: 'clat',
  year: 2026,
  pageTitle: 'CLAT College Predictor 2026',
  pageSubtitle: 'Estimate law college chances (NLUs and others) using your CLAT score',
  inputConfig: { ...jeeConfig.inputConfig, label: 'CLAT Score', placeholder: 'Enter CLAT score (e.g. 98)', type: 'score' },
  apiConfig: { ...jeeConfig.apiConfig, buildRequestPayload: (input: any) => ({ ...jeeConfig.apiConfig.buildRequestPayload(input), exam: 'CLAT' }) },
  urlPath: '/predictors/clat-predictor',
};
