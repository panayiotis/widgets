import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  // Revalidate the pending transactions page
  revalidatePath('/pending_transactions');
  
  return NextResponse.json({ 
    message: 'Pending transactions page revalidated successfully' 
  });
}
