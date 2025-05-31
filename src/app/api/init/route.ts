import { NextResponse } from 'next/server';
import { initializeSchema } from '@/lib/db';

export async function POST() {
  try {
    await initializeSchema();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error initializing schema:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 