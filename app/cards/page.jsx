import React from 'react';
import Widget from './widget';
import RefreshButton from './refresh_button';
import { google } from 'googleapis';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

async function fetch_data() {
  try {
    // Get credentials from environment variables
    const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const private_key = process.env.GOOGLE_PRIVATE_KEY;
    
    if (!client_email || !private_key) {
      throw new Error('Google service account credentials not found');
    }
    
    // Initialize auth
    const auth = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Create sheets API client
    const sheets = google.sheets({ version: 'v4', auth });

    // Read cards from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1stIwm1_PAHSw1X-cx0lBRFUTq-WcRqGgrgInGTQ0Z7U',
      range: 'cards!A1:B10',
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Data has no headers, first column is name, second is balance
    const data = rows.map(row => ({
      name: row[0] || '',
      balance: parseFloat((row[1] || '').replace(/[^0-9.-]/g, '')) || 0
    }));

    return data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
}

export default async function Page() {
  // Fetch cards data directly
  const cards = await fetch_data();

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
