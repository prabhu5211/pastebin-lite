import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

export async function GET() {
  try {
    // Test KV connection
    await kv.ping();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}