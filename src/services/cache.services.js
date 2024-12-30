import { redisClient } from "../config/redisClient.js";


export const fetchFromCache = async (key) => {
    try {
        if (!redisClient.isOpen) {
            console.log("Redis client is not connected.");
            return null;  
        }

        const data = await Promise.race([
            redisClient.get(key),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Redis request timed out')), 3000))
        ])

        if (data) {
            try {
                return JSON.parse(data); 
            } catch (err) {
                console.error('Error parsing data from cache:', err);
                return null;  
            }
        } else {
            return null;  
        }

    } catch (err) {
        console.error('Error fetching data from Redis cache:', err);
        return null
    }
};


export const storeInCache = async (key, value, expiryInSeconds) => {
    try {
        
        if (!redisClient.isOpen) {
            console.log("Redis client is not connected.");
            return;  
        }

        await Promise.race([
            redisClient.set(key, JSON.stringify(value), { EX: expiryInSeconds }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Redis request timed out')), 3000))  
        ]);

    } catch (err) {
        console.error('Error storing data in Redis cache:', err);
        
    }
};
