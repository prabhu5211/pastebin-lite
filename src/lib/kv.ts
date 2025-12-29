import fs from 'fs';
import path from 'path';

// Simple KV abstraction that works locally and in production
interface KVStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any): Promise<void>;
  del(key: string): Promise<void>;
  ping(): Promise<void>;
}

// File-based store for local development
class FileKV implements KVStore {
  private storePath: string;

  constructor() {
    this.storePath = path.join(process.cwd(), '.local-kv-store.json');
  }

  private readStore(): Record<string, any> {
    try {
      if (fs.existsSync(this.storePath)) {
        const data = fs.readFileSync(this.storePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.log('[FileKV] Error reading store:', error);
    }
    return {};
  }

  private writeStore(store: Record<string, any>): void {
    try {
      fs.writeFileSync(this.storePath, JSON.stringify(store, null, 2));
    } catch (error) {
      console.log('[FileKV] Error writing store:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const store = this.readStore();
    const value = store[key] || null;
    console.log(`[FileKV] GET ${key}:`, value ? 'found' : 'not found');
    return value;
  }

  async set(key: string, value: any): Promise<void> {
    const store = this.readStore();
    store[key] = value;
    this.writeStore(store);
    console.log(`[FileKV] SET ${key}:`, 'stored');
  }

  async del(key: string): Promise<void> {
    const store = this.readStore();
    const existed = key in store;
    delete store[key];
    this.writeStore(store);
    console.log(`[FileKV] DEL ${key}:`, existed ? 'deleted' : 'not found');
  }

  async ping(): Promise<void> {
    console.log('[FileKV] PING: OK');
  }
}

// Vercel KV for production
class VercelKV implements KVStore {
  private kv: any;

  constructor() {
    // Import Vercel KV dynamically
    this.kv = require('@vercel/kv').kv;
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.kv.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    await this.kv.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.kv.del(key);
  }

  async ping(): Promise<void> {
    await this.kv.ping();
  }
}

// Export the appropriate KV instance
export const kv: KVStore = process.env.KV_REST_API_URL 
  ? new VercelKV()
  : new FileKV();