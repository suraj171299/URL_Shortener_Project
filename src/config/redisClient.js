import { createClient } from 'redis'


export const redisClient = createClient({
    url: process.env?.REDISCLOUD_URL || process.env?.REDIS_URL,
    socket: {
        connectTimeout: 1000,
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.error("Redis: Reconnection attempts exceeded")
                return new Error("Redis: Cannot reconnect");
            }
            console.log(`Redis: Reconnecting attempt ${retries}...`)
            return Math.min(retries * 100, 3000)
        },
    },
});

redisClient.on('error', (err) => {    
    console.error('Redis connection error:', err)
});

const connectRedis = async () => {
    try {
        await redisClient.connect()
        console.log('Connected to Redis')
    } catch (err) {
        console.error('Error connecting to Redis:', err)
    }
}

connectRedis()