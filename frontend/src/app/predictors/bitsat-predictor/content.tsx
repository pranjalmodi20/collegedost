"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { bitsatConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={bitsatConfig} />;
};

export default PageContent;
