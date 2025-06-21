'use client';

import React from 'react';

const border = process.env.VERCEL_ENV === 'development' ? 'border-1 border-green-500' : '';

const Widget = ({ cards }) => {
  
  const total_balance = cards.reduce((sum, card) => sum + card.balance, 0);

  return (
    <div className='widget box-border flex aspect-[0.94] w-screen max-w-[390px] flex-row items-center pt-[px] justify-center bg-[#222] text-[#eee] relative'>

        <div className='text-right text-5xl opacity-100'>
          {cards.map((card, index) => (
            <React.Fragment key={index}>
              <span className='text-4xl'>$</span>{card.balance.toLocaleString()}<br />
            </React.Fragment>
          ))}
          <hr className='my-2 border-[#444]'/>
          <span className='text-4xl'>$</span>{total_balance.toLocaleString()}
        </div>
      </div>
  );
};

export default Widget;
