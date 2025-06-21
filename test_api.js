#!/usr/bin/env node

import {google} from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function run() {
  try {
    console.log('🔐 Setting up authentication...');
    
    // Get credentials from environment variables
    const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const private_key = process.env.GOOGLE_PRIVATE_KEY;
    
    console.log('🔐 Using credentials for:', client_email);
    console.log('🔐 Private key exists:', !!private_key);
    
    // Initialize auth with the official googleapis library
    const auth = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Create sheets API client
    const sheets = google.sheets({version: 'v4', auth});

    console.log('📄 Loading document info...');
    
    // Get spreadsheet metadata
    const response = await sheets.spreadsheets.get({
      spreadsheetId: '1stIwm1_PAHSw1X-cx0lBRFUTq-WcRqGgrgInGTQ0Z7U',
      fields: 'properties.title,sheets.properties.title,sheets.properties.sheetId,sheets.properties.gridProperties'
    });
    
    console.log('✅ Success! Document title:', response.data.properties.title);
    
    // Display sheet information
    response.data.sheets.forEach((sheet, index) => {
      const props = sheet.properties;
      console.log(`Sheet ${index + 1}: ${props.title} (ID: ${props.sheetId})`);
      console.log(`  Rows: ${props.gridProperties.rowCount}`);
      console.log(`  Columns: ${props.gridProperties.columnCount}`);
    });

    // Example: Read data from the first sheet
    console.log('\n📊 Reading data from first sheet...');
    const data_response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1stIwm1_PAHSw1X-cx0lBRFUTq-WcRqGgrgInGTQ0Z7U',
      range: 'Sheet1!A1:Z1000',
    });
    
    const rows = data_response.data.values;
    if (rows && rows.length > 0) {
      console.log(`Found ${rows.length} rows of data`);
      console.log('First few rows:');
      rows.slice(0, 5).forEach((row, index) => {
        console.log(`  Row ${index + 1}:`, row);
      });
    } else {
      console.log('No data found in the sheet');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  run();
}

export default run;
