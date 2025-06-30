import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this in production

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign(
      { isAdmin: true, exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) }, // 24 hours
      JWT_SECRET
    );

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}