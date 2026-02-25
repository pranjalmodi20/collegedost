"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { clatConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={clatConfig} />;
};

export default PageContent;
