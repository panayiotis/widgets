import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// In-memory cache
let cache = {
  data: null,
  last_fetch: null,
  expires_at: null
};

// Cache duration: 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function fetch_cards() {
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
      range: 'Sheet2!A1:B10',
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Data has no headers, first column is name, second is balance
    const cards = rows.map(row => ({
      name: row[0] || '',
      balance: parseFloat((row[1] || '').replace(/[^0-9.-]/g, '')) || 0
    }));

    return cards;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const invalidate = searchParams.get('invalidate');
  
  // Check if manual invalidation is requested
  if (invalidate === 'true') {
    cache = {
      data: null,
      last_fetch: null,
      expires_at: null
    };
    console.log('Cache manually invalidated');
  }
  
  // Check if cache is still valid
  const now = Date.now();
  if (cache.data && cache.expires_at && now < cache.expires_at) {
    console.log('Returning cached cards');
    return NextResponse.json({
      data: cache.data,
      cached: true,
      last_fetch: cache.last_fetch,
      expires_at: cache.expires_at
    });
  }
  
  try {
    console.log('Fetching fresh cards from Google Sheets...');
    const cards = await fetch_cards();
    
    // Update cache
    cache = {
      data: cards,
      last_fetch: now,
      expires_at: now + CACHE_DURATION
    };
    
    console.log(`Cached ${cards.length} cards`);
    
    return NextResponse.json({
      data: cards,
      cached: false,
      last_fetch: cache.last_fetch,
      expires_at: cache.expires_at
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
} 
