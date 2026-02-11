"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { neetConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={neetConfig} />;
};

export default PageContent;
