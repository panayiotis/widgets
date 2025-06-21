'use client';

import React, { useState, useEffect } from 'react';

//const border = 'border-1 border-green-500';
const border = ''

const Widget = () => {
  const [cards, set_cards] = useState([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState(null);

  const fetch_cards = async (invalidate = false) => {
    try {
      set_loading(true);
      const url = invalidate ? '/api/cards?invalidate=true' : '/api/cards';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
      const data = await response.json();
      set_cards(data.data || []);
    } catch (err) {
      set_error(err.message);
    } finally {
      set_loading(false);
    }
  };

  useEffect(() => {
    fetch_cards();
  }, []);

  const handle_refresh = () => {
    fetch_cards(true);
  };

  if (loading) {
    return (
      <div className='widget box-border flex aspect-[0.94] w-screen max-w-[390px] flex-row items-center pt-[px] justify-center bg-[#222] text-[#eee]'>
        <p className='text-right text-5xl opacity-100'>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='widget box-border flex aspect-[0.94] w-screen max-w-[390px] flex-row items-center pt-[px] justify-center bg-[#222] text-[#eee]'>
        <p className='text-right text-5xl opacity-100'>Error: {error}</p>
      </div>
    );
  }

  const total_balance = cards.reduce((sum, card) => sum + card.balance, 0);

  return (
    <div className='widget box-border flex aspect-[0.94] w-screen max-w-[390px] flex-row items-center pt-[px] justify-center bg-[#222] text-[#eee] relative'>
        <button 
          onClick={handle_refresh}
          className='fixed top-2 left-2 text-xs bg-[#333] hover:bg-[#444] px-2 py-1 rounded'
          disabled={loading}
        >
          {loading ? '...' : '↻'}
        </button>
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
