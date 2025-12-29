import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { nanoid } from 'nanoid';

interface PasteData {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
  created_at: number;
  views: number;
}

function getCurrentTime(request: NextRequest): number {
  const testMode = process.env.TEST_MODE === '1';
  if (testMode) {
    const testNowMs = request.headers.get('x-test-now-ms');
    if (testNowMs) {
      return parseInt(testNowMs, 10);
    }
  }
  return Date.now();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (body.ttl_seconds !== undefined) {
      if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
        return NextResponse.json(
          { error: 'ttl_seconds must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    if (body.max_views !== undefined) {
      if (!Number.isInteger(body.max_views) || body.max_views < 1) {
        return NextResponse.json(
          { error: 'max_views must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    const id = nanoid(10);
    const currentTime = getCurrentTime(request);
    
    const pasteData: PasteData = {
      content: body.content,
      ttl_seconds: body.ttl_seconds,
      max_views: body.max_views,
      created_at: currentTime,
      views: 0
    };

    await kv.set(`paste:${id}`, pasteData);

    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}