import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../config/redisClient.js";

const handleRateLimitError = (res, key) => {
    console.error(`Rate limit exceeded for key: ${key}`)
    res.status(429).json({ message: "Too many requests. Please slow down" });
}

export const rateLimiterMiddleware = (maxReq, duration, dynamicKeyGenerator) => {
    const limiter = new RateLimiterRedis({
        storeClient: redisClient,
        points: maxReq,
        duration,
        execEvenly: false,
        keyPrefix: "rateLimiter"
    })

    return async (req, res, next) => {
        try {
            const key = dynamicKeyGenerator(req)
            await limiter.consume(key)
            next()
        } catch (error) {
            if (error instanceof Error && error.code === "ECONNREFUSED") {
                console.error('Redis connection error. Bypassing rate limiter.')
                next()
            }
            else if (error.msBeforeNext) {
                handleRateLimitError(res, dynamicKeyGenerator(req))
            } else {
                console.error('Unexpected error in rate limiter:', error)
                next()
            }
        }
    }
}

