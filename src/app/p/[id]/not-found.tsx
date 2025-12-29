export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paste Not Found</h1>
          <p className="text-gray-600 mb-4">
            This paste may have expired, reached its view limit, or never existed.
          </p>
          <a 
            href="/" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Create New Paste
          </a>
        </div>
      </div>
    </div>
  );
}