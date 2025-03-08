'use client';

import React from 'react';

import TrainingChart from './training_chart';
import WeightChart from './weight_chart';

const Widget = () => {
  return (
    <div
      className='widget'
      style={{
        margin: '20px',
        width: '100vh',
        maxWidth: '450px',
        aspectRatio: '0.94',
        backgroundColor: '#333',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px 15px 35px 15px',
        boxSizing: 'border-box',
      }}
    >
      <WeightChart />
      <TrainingChart />
    </div>
  );
};

export default Widget;
