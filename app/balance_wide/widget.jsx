'use client';

import React from 'react';
import Chart from './chart';
const border = 'border-1 border-green-500';
//const border = ''

const Widget = () => {
  return (
    <div className='widget box-border flex aspect-[2.05] w-screen max-w-[390px] flex-row items-center justify-start bg-[#222] text-[#eee]'>
      <Chart />
    </div>
  );
};

export default Widget;
