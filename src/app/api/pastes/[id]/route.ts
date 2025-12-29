import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pasteData = await kv.get<PasteData>(`paste:${id}`);

    if (!pasteData) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    const currentTime = getCurrentTime(request);

    // Check TTL expiry
    if (pasteData.ttl_seconds) {
      const expiryTime = pasteData.created_at + (pasteData.ttl_seconds * 1000);
      if (currentTime >= expiryTime) {
        await kv.del(`paste:${id}`);
        return NextResponse.json(
          { error: 'Paste not found' },
          { status: 404 }
        );
      }
    }

    // Check view limit
    if (pasteData.max_views && pasteData.views >= pasteData.max_views) {
      await kv.del(`paste:${id}`);
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    // Increment view count
    const updatedPaste = {
      ...pasteData,
      views: pasteData.views + 1
    };

    // Check if this view exhausts the limit
    if (pasteData.max_views && updatedPaste.views >= pasteData.max_views) {
      await kv.del(`paste:${id}`);
    } else {
      await kv.set(`paste:${id}`, updatedPaste);
    }

    // Calculate remaining views
    const remaining_views = pasteData.max_views 
      ? Math.max(0, pasteData.max_views - updatedPaste.views)
      : null;

    // Calculate expires_at
    const expires_at = pasteData.ttl_seconds
      ? new Date(pasteData.created_at + (pasteData.ttl_seconds * 1000)).toISOString()
      : null;

    return NextResponse.json({
      content: pasteData.content,
      remaining_views,
      expires_at
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}