import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { getAnalyticDataByAlias, getOverallAnalyticData, getTopicAnalyticData } from "../services/analytic.services.js";
import { fetchFromCache, storeInCache } from "../services/cache.services.js";

const getAliasAnalytics = asyncHandler(async (req, res) => {
    const { alias } = req.params
    const userId = req.user._id
    const key = `aliasAnalytics:${alias}`

    if (!alias) {
        throw new ApiError(400, "Alias is required")
    }

    let cachedData = null
    try {
        cachedData = await fetchFromCache(key)
    } catch (error) {
        throw new ApiError(404, "Error fetching from cache")
    }

    if (cachedData) {
        return res.status(200).json(new apiResponse(200, cachedData, `Cached Analytics for alias: ${alias} retireved successfully`))
    } else {
        const analyticData = await getAnalyticDataByAlias(alias, userId)

        if (!analyticData) {
            throw new ApiError(404, `No analytics for this alias: ${alias} found`)
        }
        try {
            await storeInCache(key, analyticData, 60)
        } catch (error) {
            console.error('Error storing data in cache:', error)
        }

        return res.status(200).json(new apiResponse(200, analyticData, `Analytics data for the alias: ${alias} retrieved successfully`))
    }
})

const getTopicAnalytics = asyncHandler(async (req, res) => {
    const { topic } = req.params
    const userId = req.user._id
    const key = `topicAnalytics:${topic + userId}`

    if (!topic) {
        throw new ApiError(400, "Topic is required")
    }
    let cachedData = null

    try {
        cachedData = await fetchFromCache(key)
    } catch (error) {
        throw new ApiError(404, "Error fetching from cache")
    }

    if (cachedData) {

        return res.status(200).json(new apiResponse(200, cachedData, `Cached Analytics for topic: ${topic} retrieved successfully`))

    } else {
        const analyticData = await getTopicAnalyticData(topic, userId)

        if (!analyticData) {
            throw new ApiError(404, "No urls found for specific topic")
        }

        try {
            await storeInCache(key, analyticData, 300)
        } catch (error) {
            console.error('Error storing data in cache:', error)
        }

        return res.status(200).json(new apiResponse(200, analyticData, `Analytic data for topic: ${topic} retrieved`))
    }
})

const getOverallAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const key = `overallAnalytics:${userId}`

    try {
        let cachedData = null
        try {
            cachedData = await fetchFromCache(key)
        } catch (error) {
            console.error('Error fetching data from cache:', error)
        }

        if (cachedData) {
            return res.status(200).json(new apiResponse(200, cachedData, "Cached Response for Overall Analytics Received"))
        } else {
            const analyticData = await getOverallAnalyticData(userId)

            if (!analyticData) {
                throw new ApiError(404, "No analytics found")
            }
            try {
                await storeInCache(key, analyticData, 300)
            } catch (error) {
                console.error('Error storing data in cache:', error)
            }

            return res.status(200).json(new apiResponse(200, analyticData, "Overall Analytic data retrieved successfully"))
        }
    } catch (error) {
        console.error('Error occurred while fetching overall analytics:', error)
        throw new ApiError(500, "Something went wrong while fetching overall analytics")
    }
});



export {
    getAliasAnalytics,
    getTopicAnalytics,
    getOverallAnalytics
}