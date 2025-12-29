# Deployment Guide

## Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Choose "Next.js" as the framework preset

3. **Set up Vercel KV**
   - In your Vercel dashboard, go to Storage
   - Create a new KV database
   - Copy the connection details

4. **Configure Environment Variables**
   In your Vercel project settings, add:
   ```
   KV_REST_API_URL=your_kv_rest_api_url
   KV_REST_API_TOKEN=your_kv_rest_api_token
   ```

5. **Deploy**
   - Vercel will automatically deploy on push
   - Your app will be available at `https://your-app.vercel.app`

## Testing Your Deployment

1. **Health Check**
   ```bash
   curl https://your-app.vercel.app/api/healthz
   ```

2. **Create a Paste**
   ```bash
   curl -X POST https://your-app.vercel.app/api/pastes \
     -H "Content-Type: application/json" \
     -d '{"content":"Hello World","ttl_seconds":60}'
   ```

3. **View the Paste**
   Visit the returned URL in your browser

## Important Notes

- Make sure your KV database is in the same region as your Vercel functions for best performance
- The app supports both UI-based paste creation and API-based creation
- All paste constraints (TTL, view limits) are automatically enforced