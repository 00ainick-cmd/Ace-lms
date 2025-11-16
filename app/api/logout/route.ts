import { NextRequest, NextResponse } from 'next/server';
import { clearUserRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Clear the user role from the cookie
    await clearUserRole();

    return NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
