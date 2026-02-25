import { PredictorConfig } from '../types';
import { jeeConfig } from './jeeConfig';

export const gateConfig: PredictorConfig = {
  ...jeeConfig,
  examName: 'GATE',
  examSlug: 'gate',
  year: 2026,
  pageTitle: 'GATE College Predictor 2026',
  pageSubtitle: 'Predict M.Tech / PG admission chances using your GATE score',
  inputConfig: { ...jeeConfig.inputConfig, label: 'GATE Score', placeholder: 'Enter GATE score (e.g. 720)', type: 'score' },
  apiConfig: { ...jeeConfig.apiConfig, buildRequestPayload: (input: any) => ({ ...jeeConfig.apiConfig.buildRequestPayload(input), exam: 'GATE' }) },
  urlPath: '/predictors/gate-predictor',
};
