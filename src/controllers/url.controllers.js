import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js"
import { URL } from "../models/url.models.js"
import { generateUniqueAlias, generateUniqueUrl } from "../utils/generateUniqueAlias.js";
import { createAnalyticLog } from "../services/analytic.services.js";
import { fetchFromCache, storeInCache } from "../services/cache.services.js"
import { getUrlByAlias, incrementAnalytics, updateUrlClicks } from "../services/url.services.js"

const urlShortener = asyncHandler(async (req, res) => {
    const { longUrl, customAlias, topic } = req.body
    const id = req.user._id
    
    if (!longUrl) {
        throw new ApiError(400, "LongUrl is required")
    }

    const cachedShortUrl = await fetchFromCache(`${longUrl}:${id}`)

    if(cachedShortUrl){
        return res.status(200).json(new apiResponse(200, {
            shortUrl: cachedShortUrl.shortUrl,
            customAlias: cachedShortUrl.customAlias,
            createdAt: cachedShortUrl.createdAt
        }, "Long Url already exists, here is the short url link from cache"))
    }

    const existingUrl = await URL.findOne({ longUrl, userId: id })
    if (existingUrl) {
        return res.status(200).json(new apiResponse(200, {
            shortUrl: existingUrl.shortUrl,
            customAlias: existingUrl.customAlias,
            createdAt: existingUrl.createdAt
        }, "Long Url already exists, here is the short url link"))
    }

    const alias = customAlias || generateUniqueAlias();

    const aliasExists = await getUrlByAlias(alias)
    if (aliasExists) {
        throw new ApiError(400, "Alias already exists")
    }

    const shortUrl = generateUniqueUrl()

    try {
        const newUrl = await URL.create({
            longUrl,
            shortUrl,
            customAlias: alias,
            topic: topic,
            userId: id,
        })

        await storeInCache(`${longUrl}:${id}`,{
            longUrl: newUrl.longUrl,
            shortUrl: newUrl.shortUrl,
            customAlias: newUrl.customAlias,
            createdAt: newUrl.createdAt
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

const redirectUrl = asyncHandler(async (req, res) => {
    const { alias } = req.params

    if (!alias) {
        throw new ApiError(404, "Alias is required")
    }

    let urlRecord = await fetchFromCache(alias)

    if (!urlRecord) {

        console.log("Cache miss. Fetching from database...");

        urlRecord = await getUrlByAlias(alias);

        if (!urlRecord) {
            throw new ApiError(400, "URL with this alias not found");
        }

        await storeInCache(alias, urlRecord, 300);
    }

    const analyticData = await createAnalyticLog(req, urlRecord);

    await incrementAnalytics(urlRecord._id, analyticData.analyticsId);

    const updatedUrlRecord = await updateUrlClicks(urlRecord._id, analyticData)

    await storeInCache(alias, updatedUrlRecord, 3600)

    return res.redirect(updatedUrlRecord.longUrl)
})

export {
    urlShortener,
    redirectUrl
}