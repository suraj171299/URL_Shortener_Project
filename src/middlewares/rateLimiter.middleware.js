import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 2,
    message: "Too many requests, please try again later"
})

export {
    limiter
}