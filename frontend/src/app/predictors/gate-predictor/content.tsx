"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { gateConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={gateConfig} />;
};

export default PageContent;
