import { notFound } from 'next/navigation';
import { kv } from '@/lib/kv';

interface PasteData {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
  created_at: number;
  views: number;
}

function getCurrentTime(): number {
  return Date.now();
}

async function getPaste(id: string): Promise<string | null> {
  try {
    const pasteData = await kv.get<PasteData>(`paste:${id}`);

    if (!pasteData) {
      return null;
    }

    const currentTime = getCurrentTime();

    // Check TTL expiry
    if (pasteData.ttl_seconds) {
      const expiryTime = pasteData.created_at + (pasteData.ttl_seconds * 1000);
      if (currentTime >= expiryTime) {
        await kv.del(`paste:${id}`);
        return null;
      }
    }

    // Check view limit
    if (pasteData.max_views && pasteData.views >= pasteData.max_views) {
      await kv.del(`paste:${id}`);
      return null;
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

    return pasteData.content;
  } catch (error) {
    return null;
  }
}

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getPaste(id);

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paste Content</h1>
          <div className="bg-gray-100 rounded-md p-4 overflow-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}