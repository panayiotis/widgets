import React from 'react';
import Widget from './widget';
import RefreshButton from './refresh_button';

export default async function Page() {
  // Fetch cards from API
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(`${base_url}/api/cards`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }
  
  const { data: cards } = await response.json();

  return (
    <div
      className='flex min-h-screen min-w-screen items-center justify-center font-[family-name:var(--font-geist-sans)]'
      style={{
        backgroundImage: 'url(/topography.svg)',
      }}
    >
      <RefreshButton path={`/api/cards`} />
      <main className='flex items-center justify-center'>
        <Widget cards={cards} />
      </main>
    </div>
  );
}
