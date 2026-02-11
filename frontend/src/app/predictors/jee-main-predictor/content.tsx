"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { jeeConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={jeeConfig} />;
};

export default PageContent;
