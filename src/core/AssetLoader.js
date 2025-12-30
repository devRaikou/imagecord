
/**
 * Simple LRU Cache implementation for image buffers
 */
class AssetCache {
    constructor(limit = 50) {
        this.limit = limit;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return null;
        const val = this.cache.get(key);
        // Refresh item
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }

    set(key, value) {
        if (this.cache.size >= this.limit) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}

export const imageCache = new AssetCache(100);

export async function loadImage(url) {
    if (!url) return null;

    // Check cache
    const cached = imageCache.get(url);
    if (cached) return cached;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        imageCache.set(url, buffer);
        return buffer;
    } catch (error) {
        console.error(`[ImageCord] Failed to load asset: ${url}`, error);
        return null; // Return null so we can handle fallback gracefully
    }
}
