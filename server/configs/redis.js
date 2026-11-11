import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
redis.on('error', (error) => console.log('Redis error:', error.message));
await redis.connect();

// Pub/Sub needs its own connection
export const subscriber = redis.duplicate();
subscriber.on('error', (error) => console.log('Redis error:', error.message));
await subscriber.connect();

console.log('Redis connected');

export default redis;
