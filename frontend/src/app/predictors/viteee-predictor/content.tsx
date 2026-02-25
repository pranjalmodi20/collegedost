"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { viteeeConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={viteeeConfig} />;
};

export default PageContent;
