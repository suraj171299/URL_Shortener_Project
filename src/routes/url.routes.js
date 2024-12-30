import { Router } from "express";
import { redirectUrl, urlShortener } from "../controllers/url.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.route("/shorten").post(
    verifyJWT,
    rateLimiterMiddleware(
        10,
        60,
        (req) => `${req.ip + req.user._id}`
    ),
    urlShortener)

router.route("/shorten/:alias").get(
    rateLimiterMiddleware(10, 60, (req) => req.ip),
    redirectUrl
)

export default router