'use client';

import React from 'react';

import TrainingChart from './training_chart';
import WeightChart from './weight_chart';

const Widget = () => {
  return (
    <div className='widget box-border flex aspect-[0.94] w-screen max-w-[450px] flex-col items-center justify-center bg-[#222] pr-4 pl-4 pb-10 pt-0 text-[#eee]'>
      <WeightChart />
      <TrainingChart />
    </div>
  );
};

export default Widget;
