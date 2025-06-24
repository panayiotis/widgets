import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { revalidatePath } from 'next/cache';

async function fetch_pending_transactions() {
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

    // Read pending transactions from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1stIwm1_PAHSw1X-cx0lBRFUTq-WcRqGgrgInGTQ0Z7U',
      range: 'pending!A1:B100',
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const pending_transactions = rows.map(row => ({
      date: row[0],
      amount: parseFloat((row[1] || '').replace(/[^0-9.-]/g, '')) || 0
    }));

    const grouped_transactions = Object.values(
      pending_transactions.reduce((acc, entry) => {
      acc[entry.date] = ({date: entry.date, amount: (acc[entry.date]?.amount || 0) + entry.amount});
      return acc;
      }, {})
    );

    return grouped_transactions;
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    throw error;
  }
}

async function balance() {
  try {
    // Fetch both historical transactions and pending transactions
    const [historical_response, pending_transactions] = await Promise.all([
      fetch('https://widgets-eqh8mb.s3.us-east-1.amazonaws.com/transactions_by_date.json'),
      fetch_pending_transactions()
    ]);

    const historical_transactions = await historical_response.json();

    console.log(`${historical_transactions.length} historical transactions`);
    console.log(`${pending_transactions.length} pending transactions`);
    
    // Combine historical transactions with pending transactions
    const all_transactions = [
      ...historical_transactions,
      ...pending_transactions
    ];
    
    // Sort all transactions by date
    const sorted_transactions = all_transactions
    .filter(entry => entry.date >= '2025-04-01')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate rolling balance (cumulative sum)
    let running_balance = 0;
    const balance_data = sorted_transactions.map((entry) => {
      running_balance += entry.amount;
      return {
        date: entry.date,
        balance: running_balance,
      };
    });
    
    return balance_data;
  } catch (error) {
    console.error('Error calculating balance:', error);
    throw error;
  }
}

export async function GET(request) {
  const balance_data = await balance();
  
  return NextResponse.json({
    data: balance_data,
  });
}

export async function POST(request) {
  // Revalidate the pending transactions page
  revalidatePath('/pending_transactions');
  
  return NextResponse.json({ 
    message: 'Pending transactions page revalidated successfully' 
  });
}
