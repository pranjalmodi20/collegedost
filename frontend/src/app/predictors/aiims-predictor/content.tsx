"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { aiimsConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
  return <PredictorBase config={aiimsConfig} />;
};

export default PageContent;
