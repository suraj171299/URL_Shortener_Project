import { Router } from "express";
import { googleCallback, googleSignIn, refreshAccessToken } from "../controllers/auth.controllers.js";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter.middleware.js";

const router = Router()

router.route('/google').get(
    rateLimiterMiddleware(5, 60, (req) => req.ip),
    googleSignIn
)
router.route('/google/callback').get(
    rateLimiterMiddleware(5, 60, (req) => req.ip),
    googleCallback
)
router.route('/refresh-token').post(
    rateLimiterMiddleware(10, 60, (req) => req.ip),
    refreshAccessToken
)


export default router