import {Geist, Geist_Mono, Mansalva, Cabin_Sketch} from 'next/font/google';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const mansalva = Mansalva({
  variable: '--font-mansalva',
  weight: '400',
  subsets: ['latin'],
});

const cabinSketch = Cabin_Sketch({
  variable: '--font-cabin-sketch',
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'widgets',
  description: 'ios http widgets',
};

export default function RootLayout({children}) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mansalva.variable} ${cabinSketch.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
