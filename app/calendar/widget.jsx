'use client';

import React from 'react';

import Calendar from './calendar';
//const border = 'border-1 border-green-500';
const border = ''

const Widget = () => {
  const events = [
    { date: '2025-08-30', icon: '🏊‍♀️' },
    { date: '2025-09-01', icon: '⛱️' },
    { date: '2025-09-07', icon: '⚾️' },
    { date: '2025-09-19', icon: '⚽️' },
    { date: '2025-09-19', icon: '🎸' },
    { date: '2025-09-23', icon: '📸' },
    { date: '2025-09-26', icon: '⚽️' },
    { date: '2025-10-01', icon: '📽️' },
    { date: '2025-10-03', icon: '⚽️' },
    { date: '2025-10-04', icon: '⛴️' },
    { date: '2025-10-19', icon: '🎸' },
  ].map(event => ({
    ...event,
    date: new Date(`${event.date}T00:00:00-05:00`),
  })).filter(event => event.date >= new Date())

  return (
    <div className='widget box-border flex aspect-[2.05] w-screen max-w-[390px] flex-row items-center justify-start bg-[#222] text-[#eee]'>
      <Calendar />
      <div className={`flex-1 flex flex-col pl-3 ${border}`}>
        {events.map((event, index) => (
          <p key={index} className='text-sm opacity-100 mt-1'>
            {`${event.icon} in ${1 + Math.floor((event.date - new Date()) / (1000 * 60 * 60 * 24))} days`}
          </p>
        ))}
        <p className='text-sm opacity-80 mt-1'>
          {`${Math.floor((new Date() - new Date('2025-05-23T19:50:00-05:00')) / (1000 * 60 * 60 * 24))} days in 🇺🇸`}
        </p>
      </div>
    </div>
  );
};

export default Widget;
