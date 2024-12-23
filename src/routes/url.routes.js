import { Router } from "express";
import { urlShortener } from "../controllers/url.controllers.js";

const router = Router();

router.route("/url-shortener").post(urlShortener)

export default router