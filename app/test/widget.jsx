'use client';

import React from 'react';

import ShowDimensions from './show_dimensions';

const Widget = () => {
  return (
    <div
      className='widget'
      style={{
        /*
         * width: '100%' might not be working because:
         * 1. The parent container might have no defined width
         * 2. maxWidth: '450px' is limiting the width
         * 3. The flex container behavior might be affecting it
         */
        width: '100vw', // This will make it fill its parent container
        maxWidth: '450px', // But this limits the maximum width to 450px
        aspectRatio: '0.95',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px 5px 5px 5px',
        boxSizing: 'border-box',
        color: 'white',
        backgroundColor: '#333',
      }}
    >
      <div className='flex h-full w-full flex-col items-center justify-center rounded-[30px] border-1'>
        <h1 className='text-4xl'>widget.jsx</h1>
        <ShowDimensions />
      </div>
    </div>
  );
};

export default Widget;
