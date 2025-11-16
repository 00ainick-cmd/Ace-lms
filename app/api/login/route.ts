import { NextRequest, NextResponse } from 'next/server';
import { setUserRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json();

    if (!role || (role !== 'student' && role !== 'admin')) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Set the user role in a cookie
    await setUserRole(role);

    return NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
