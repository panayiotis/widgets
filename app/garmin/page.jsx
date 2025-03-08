import Widget from './widget';

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20'>
      <main className='flex items-center justify-center'>
        <Widget />
      </main>
      <footer className='flex flex-wrap items-center justify-center'></footer>
    </div>
  );
}
