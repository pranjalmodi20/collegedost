"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { rankPredictorConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={rankPredictorConfig} />;
};

export default PageContent;
