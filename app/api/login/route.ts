import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Simple check (replace later with DB)
  if (username === 'admin' && password === '1234') {
    const response = NextResponse.json({ success: true });

    // ✅ Set auth cookie
    response.cookies.set('auth', 'true', {
      httpOnly: true,
      path: '/',
      // secure: true, // enable in production (https)
    });

    return response;
  }

  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  );
}