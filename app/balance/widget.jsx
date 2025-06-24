'use client';

import React, { useEffect } from 'react';
import Chart from './chart';

const border = 'border-1 border-green-500';
//const border = ''

export default function Widget({ balance }) {
  return (
    <div className='widget box-border flex aspect-[2.05] w-screen max-w-[390px] flex-row items-center justify-start bg-[#222] text-[#eee]'>
      <Chart data={balance} />
    </div>
  );
};
