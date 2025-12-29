'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const body: any = { content };
      
      if (ttlSeconds) {
        body.ttl_seconds = parseInt(ttlSeconds, 10);
      }
      
      if (maxViews) {
        body.max_views = parseInt(maxViews, 10);
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create paste');
        return;
      }

      setResult(data);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Pastebin Lite</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Paste Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your text here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ttl" className="block text-sm font-medium text-gray-700 mb-2">
                  Expire After (seconds)
                </label>
                <input
                  id="ttl"
                  type="number"
                  min="1"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label htmlFor="maxViews" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Views
                </label>
                <input
                  id="maxViews"
                  type="number"
                  min="1"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Paste'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
              <h3 className="font-semibold text-green-800 mb-2">Paste Created Successfully!</h3>
              <p className="text-sm text-green-700 mb-2">
                <strong>ID:</strong> {result.id}
              </p>
              <p className="text-sm text-green-700 mb-3">
                <strong>Share URL:</strong>
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={result.url}
                  readOnly
                  className="flex-1 px-2 py-1 text-sm border border-green-300 rounded bg-white"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(result.url)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Copy
                </button>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  View
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}