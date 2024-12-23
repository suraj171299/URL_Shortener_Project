import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js"
import { URL } from "../models/url.models.js"
import { generateUniqueAlias, generateUniqueUrl } from "../utils/generateUniqueAlias.js";


const urlShortener = asyncHandler(async (req, res) => {
    const { longUrl, customAlias, topic } = req.body

    if (!longUrl) {
        throw new ApiError(400, "LongUrl is required")
    }

    const existingUrl = await URL.findOne({ longUrl })
    if (existingUrl) {
        return res.status(200).json(new apiResponse(200, {
            shortUrl: existingUrl.shortUrl,
            customAlias: existingUrl.customAlias,
            createdAt: existingUrl.createdAt
        }, "Long Url already exists, here is the short url link"))
    }

    const alias = customAlias || generateUniqueAlias();

    const aliasExists = await URL.findOne({ customAlias: alias })
    if (aliasExists) {
        throw new ApiError(400, "Alias already exists")
    }

    const shortUrl = generateUniqueUrl()

    try {
        const newUrl = await URL.create({
            longUrl,
            shortUrl,
            customAlias: alias,
            topic: topic || "Not provided"
        })

        return res.status(200).json(new apiResponse(200, {
            longUrl: newUrl.longUrl,
            shortUrl: newUrl.shortUrl,
            customAlias: newUrl.customAlias
        }, "Url successfully shortened"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }

})

export {
    urlShortener
}