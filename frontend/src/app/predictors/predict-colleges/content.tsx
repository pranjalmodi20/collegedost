"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { predictCollegesConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={predictCollegesConfig} />;
};

export default PageContent;
