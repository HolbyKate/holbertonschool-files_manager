import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.expireAsync = promisify(this.client.expire).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);

        this.client.on('error', (error) => {
            console.log(`Redis client not connected to the server: ${error.message}`);
        });

        // Ensure the client is connected before any operation
        this.connectionPromise = new Promise((resolve) => {
            this.client.on('connect', () => {
                console.log('Redis client connected to the server');
                resolve();
            });
        });
    }

    async isAlive() {
        await this.connectionPromise;
        return this.client.connected;
    }

    async get(key) {
        await this.connectionPromise;
        return this.getAsync(key);
    }

    async set(key, value, duration) {
        await this.connectionPromise;
        await this.setAsync(key, value);
        return this.expireAsync(key, duration);
    }

    async del(key) {
        await this.connectionPromise;
        return this.delAsync(key);
    }
}

const redisClient = new RedisClient();
export default redisClient;