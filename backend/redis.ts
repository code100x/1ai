import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 10000,
    commandTimeout: 5000,
    enableOfflineQueue: false,
});

export class CacheManager {
    private static instance: CacheManager;
    private client: Redis;

    private constructor() {
        this.client = redis;
    }

    static getInstance(): CacheManager {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async set(key: string, value: string, ttl: number = 3600): Promise<void> {
        await this.client.setex(key, ttl, value);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        return (await this.client.exists(key)) === 1;
    }

    async hget(key: string, field: string): Promise<string | null> {
        return await this.client.hget(key, field);
    }

    async hset(key: string, field: string, value: string): Promise<void> {
        await this.client.hset(key, field, value);
    }

    async expire(key: string, ttl: number): Promise<void> {
        await this.client.expire(key, ttl);
    }

    async flushConversation(conversationId: string): Promise<void> {
        await this.client.del(`conversation:${conversationId}`);
        await this.client.del(`messages:${conversationId}`);
    }
}

export default CacheManager.getInstance();
