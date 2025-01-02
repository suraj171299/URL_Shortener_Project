import { Router } from "express";
import { getAliasAnalytics, getOverallAnalytics, getTopicAnalytics } from "../controllers/analytic.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter.middleware.js"
import { validate } from "../middlewares/inputValidation.middlewares.js";
import { aliasValidationSchema, topicValidationSchema } from "../utils/inputValidation.js";

const router = Router();

router.route("/analytics/alias/:alias").get(
    verifyJWT,
    validate(aliasValidationSchema),
    rateLimiterMiddleware(
        10,
        60,
        (req) => `aliasAnalytis:${req.params.alias}`
    ),
    getAliasAnalytics
)

router.route("/analytics/topic/:topic").get(
    verifyJWT,
    validate(topicValidationSchema),
    rateLimiterMiddleware(
        10,
        60,
        (req) => `topicAnalytis:${req.params.topic + req.user._id}`
    ), getTopicAnalytics)

router.route("/analytics/overall").get(
    verifyJWT,
    rateLimiterMiddleware(
        10,
        60,
        (req) => `overallAnalytis:${req.user._id}`
    ), getOverallAnalytics)

export default router