import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  // Revalidate the cards page
  revalidatePath('/cards');
  
  return NextResponse.json({ 
    message: 'Cards page revalidated successfully' 
  });
}
