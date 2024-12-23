import { Router } from "express";
import { redirectUrl, urlShortener } from "../controllers/url.controllers.js";
import { limiter } from "../middlewares/rateLimiter.middleware.js";


const router = Router();

router.route("/shorten").post(limiter, urlShortener)
router.route("/shorten/:alias").get(redirectUrl)

export default router