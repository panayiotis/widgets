import Widget from './widget';

export default function Home() {
  return (
    <div
      className='flex min-h-screen min-w-screen items-center justify-center font-[family-name:var(--font-geist-sans)]'
      style={{
        backgroundImage: 'url(/topography.svg)',
      }}
    >
      <main className='flex items-center justify-center'>
        <Widget />
      </main>
    </div>
  );
}
