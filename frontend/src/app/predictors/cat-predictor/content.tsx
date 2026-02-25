"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { catConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={catConfig} />;
};

export default PageContent;
