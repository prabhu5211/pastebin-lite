# Pastebin Lite

A simple pastebin-like application built with Next.js that allows users to create text pastes with optional expiry constraints and share them via URLs.

## Features

- Create text pastes with shareable URLs
- Optional time-based expiry (TTL)
- Optional view-count limits
- Clean, responsive UI
- RESTful API endpoints
- Automatic paste cleanup when constraints are met

## How to Run Locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pastebin-lite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```
   KV_REST_API_URL=your_kv_url
   KV_REST_API_TOKEN=your_kv_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Persistence Layer

This application uses **Vercel KV** (Redis-compatible) as the persistence layer. Vercel KV was chosen because:

- **Serverless-friendly**: Works seamlessly with Vercel's serverless functions
- **Fast access**: Redis-like performance for quick paste retrieval
- **TTL support**: Built-in expiration capabilities
- **Scalable**: Handles concurrent requests well
- **Zero configuration**: Easy setup and deployment

The KV store persists paste data across requests and handles the automatic cleanup of expired pastes.

## Important Design Decisions

### 1. **Next.js App Router**
- Used the modern App Router for better performance and developer experience
- API routes are co-located with the application code

### 2. **Atomic Operations**
- View counting and constraint checking are handled atomically to prevent race conditions
- Pastes are deleted immediately when constraints are violated

### 3. **Test Mode Support**
- Implements deterministic time testing via `x-test-now-ms` header
- Allows automated testing of TTL functionality

### 4. **Error Handling**
- Consistent 404 responses for all unavailable paste scenarios
- Proper JSON error responses for API endpoints
- User-friendly error messages in the UI

### 5. **Security**
- Paste content is safely rendered without script execution
- Input validation on both client and server sides
- No hardcoded URLs or secrets in the codebase

## API Endpoints

- `GET /api/healthz` - Health check endpoint
- `POST /api/pastes` - Create a new paste
- `GET /api/pastes/:id` - Fetch paste data (API)
- `GET /p/:id` - View paste (HTML)

## Deployment

This application is designed to be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up the required environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

The application will be available at your Vercel URL (e.g., `https://your-app.vercel.app`)