import Widget from './widget';
import RefreshButton from '../cards/refresh_button';

export default async function Page() {
  // Fetch cards from API
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(`${base_url}/api/balance`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }
  
  const { data: balance } = await response.json();
  
  return (
    <div
      className='flex min-h-screen min-w-screen items-center justify-center font-[family-name:var(--font-geist-sans)]'
      style={{
        backgroundImage: 'url(/topography.svg)',
      }}
    >
      <RefreshButton path={`/api/balance`} />
      <main className='flex items-center justify-center'>
        <Widget balance={balance} />
      </main>
    </div>
  );
}
