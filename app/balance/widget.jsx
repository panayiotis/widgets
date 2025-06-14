'use client';

import React from 'react';

//const border = 'border-1 border-green-500';
const border = ''

const capital_one = 1699;
const chase = 803;

const Widget = () => {
  return (
    <div className='widget box-border flex aspect-[0.94] w-screen max-w-[390px] flex-row items-center pt-[px] justify-center bg-[#222] text-[#eee]'>
        <p className='text-right text-5xl opacity-100'>
          <span className='text-4xl'>$</span>{capital_one.toLocaleString()}<br />
          <span className='text-4xl'>$</span>{chase.toLocaleString()}<br />
          <hr/>
          <span className='text-4xl'>$</span>{(capital_one + chase).toLocaleString()}
        </p>
      </div>
  );
};

export default Widget;
