import { redisClient } from "../utils/redisClient.js";

export const fetchFromCache = async (key) => {
    
    const data = await redisClient.get(key)
    return data ? JSON.parse(data) : null

}

export const storeInCache = async (key, value, expiryInSeconds) => {
    await redisClient.set(key, JSON.stringify(value), { EX : expiryInSeconds})
}