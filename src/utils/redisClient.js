import { createClient } from 'redis'


export const redisClient = createClient({
    url: 'redis://127.0.0.1:6379',
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();