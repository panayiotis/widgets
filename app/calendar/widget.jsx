'use client';

import React from 'react';

import Calendar from './calendar';
//const border = 'border-1 border-green-500';
const border = ''

const Widget = () => {
  return (
    <div className='widget box-border flex aspect-[2.05] w-screen max-w-[390px] flex-row items-center justify-start bg-[#222] text-[#eee]'>
      <Calendar />
      <div className={`flex-1 flex flex-col pl-3 ${border}`}>
        <p className='text-sm opacity-100 mt-1'>
          {`⛱️ in ${1 + Math.floor((new Date('2025-07-04') - new Date()) / (1000 * 60 * 60 * 24))} days`}
        </p>
        <p className='text-sm opacity-80 mt-1'>
          {`${Math.floor((new Date() - new Date('2025-05-23')) / (1000 * 60 * 60 * 24))} days in 🇺🇸`}
        </p>
      </div>
    </div>
  );
};

export default Widget;
