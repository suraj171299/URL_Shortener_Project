import { Analytics } from "../models/analytic.models.js";
import { getLocationfromIP } from "../utils/getLocationfromIP.js";
import { UAParser } from "ua-parser-js";
import { ApiError } from "../utils/ApiError.js";
import { URL } from "../models/url.models.js";
import moment from "moment";
import mongoose from "mongoose";

export const createAnalyticLog = async (req, urlRecord) => {
    
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.ip
    const userAgent = req.headers['user-agent'] || "Unknown"
    const location = await getLocationfromIP(ipAddress)
    const parser = new UAParser(userAgent)
    const osName = parser.getOS().name || "Unknown"
    const deviceType = /Mobile|Tablet|Android|iPhone/.test(userAgent) ? "Mobile" : "Desktop";

    const analytics = await Analytics.create({
        userAgent,
        ipAddress,
        location: location,
        url: urlRecord?._id,
        os: osName,
        deviceType
    })

    return { ipAddress, os: analytics.os, deviceType, userAgent, location, analyticsId: analytics._id };
}

const getClicksByDate = (clicksByDate) => {
    const recentDays = []
    const today = moment().startOf('day')
    for (let i = 0; i < 7; i++) {

        const date = today.clone().subtract(i, 'days').format('YYYY-MM-DD');

        const clicks = clicksByDate.find((entry) => entry.date === date);

        recentDays.push({ date, clicks: clicks ? clicks.clicks : 0 });
    }
    return recentDays.reverse();
}

const fetchAnalyticData = async (urlRecord) => {
    try {
        const totalClicks = urlRecord.totalClicks || 0
        const uniqueClicks = urlRecord.uniqueClicks || 0
        const clicksByDate = getClicksByDate(urlRecord.clicksByDate)

        const osType = Object.keys(urlRecord.osType).map((os) => {
            const osData = urlRecord.osType[os]
            return {
                os,
                uniqueClicks: osData.users.length,
                uniqueUsers: osData.users.length
            }
        })


        const deviceType = Object.keys(urlRecord.deviceType).map((deviceName) => {
            const deviceData = urlRecord.deviceType[deviceName]
            return {
                deviceName,
                uniqueClicks: deviceData.users.length,
                uniqueUsers: deviceData.users.length
            }
        })

        return {
            totalClicks,
            uniqueClicks,
            clicksByDate,
            osType,
            deviceType,
        }
    } catch (error) {
        throw new ApiError(500, "Error formatting analytics data")
    }
}

export const getAnalyticDataByAlias = async (alias, userId) => {

    const urlRecord = await URL.findOne({ customAlias: alias, userId })

    if (!urlRecord) {
        throw new ApiError(404, "URL with this alias not found")
    }
    try {
        const analyticsData = await fetchAnalyticData(urlRecord)

        return analyticsData

    } catch (error) {
        throw new ApiError(500, "Error formatting analytics data")
    }
}

export const getTopicAnalyticData = async (topic, userId) => {
    const aggregationPipeline = [
        {
            $match: {
                $and: [
                    { topic: topic },
                    { userId: userId }
                ]
            },
        },
        {
            $project: {
                shortUrl: 1,
                totalClicks: 1,
                uniqueClicks: 1,
                clicksByDate: 1, 
            },
        },
        {
            $group: {
                _id: null,
                totalClicks: { $sum: "$totalClicks" }, 
                uniqueClicks: { $sum: "$uniqueClicks" }, 
                clicksByDate: {
                    $push: "$clicksByDate",
                },
                urls: {
                    $push: {
                        shortUrl: "$shortUrl",
                        totalClicks: "$totalClicks",
                        uniqueClicks: "$uniqueClicks",
                    },
                },
            },
        },
        {
            $addFields: {
                clicksByDate: {
                    $reduce: {
                        input: "$clicksByDate",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this"] },
                    },
                },
            },
        },
        {
            $addFields: {
                clicksByDate: {
                    $filter: {
                        input: "$clicksByDate",
                        as: "click",
                        cond: { $and: [{ $ne: ["$$click.date", null] }, { $ne: ["$$click.clicks", null] }] },
                    },
                },
            },
        },
        {
            $facet: {
                metadata: [
                    { $project: { totalClicks: 1, uniqueClicks: 1, urls: 1 } }, 
                ],
                clicksByDate: [
                    { $unwind: { path: "$clicksByDate", preserveNullAndEmptyArrays: true } },
                    {
                        $group: {
                            _id: "$clicksByDate.date",
                            clicks: { $sum: "$clicksByDate.clicks" },
                        },
                    },
                    { $sort: { _id: 1 } },
                    {
                        $project: {
                            date: "$_id",
                            clicks: 1,
                            _id: 0,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                totalClicks: { $arrayElemAt: ["$metadata.totalClicks", 0] },
                uniqueClicks: { $arrayElemAt: ["$metadata.uniqueClicks", 0] },
                urls: { $arrayElemAt: ["$metadata.urls", 0] },
                clicksByDate: "$clicksByDate",
            },
        },
    ];

    const [result] = await URL.aggregate(aggregationPipeline);
    console.log(result);
    
    if (!result || !result.metadata?.length && !result.clicksByDate?.length) {
        return null
    }else{ 
        return result
    }
};

export const getOverallAnalyticData = async (userId) => {
    
    const aggregationPipeline = [
        {
            $match: {
                userId: userId,
            },
        },
        {
            $facet: {
                summary: [
                    {
                        $group: {
                            _id: null,
                            totalUrls: { $sum: 1 },
                            totalClicks: { $sum: "$totalClicks" },
                            uniqueClicks: { $sum: "$uniqueClicks" },
                        },
                    },
                    { $project: { _id: 0 } },
                ],
                osType: [
                    {
                        $project: {
                            osType: { $objectToArray: "$osType" },
                        },
                    },
                    { $unwind: "$osType" },
                    {
                        $group: {
                            _id: "$osType.k",
                            uniqueClicks: { $sum: { $size: "$osType.v.users" } },
                            uniqueUsers: { $sum: { $size: "$osType.v.users" } },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            osName: "$_id",
                            uniqueClicks: 1,
                            uniqueUsers: 1,
                        },
                    },
                    { $sort: { osName: 1 } },
                ],
                deviceType: [
                    {
                        $project: {
                            deviceType: { $objectToArray: "$deviceType" },
                        },
                    },
                    { $unwind: "$deviceType" },
                    {
                        $group: {
                            _id: "$deviceType.k",
                            uniqueClicks: { $sum: { $size: "$deviceType.v.users"} },
                            uniqueUsers: { $sum: { $size: "$deviceType.v.users" } },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            deviceName: "$_id",
                            uniqueClicks: 1,
                            uniqueUsers: 1,
                        },
                    },
                    { $sort: { deviceName: 1 } },
                ],
            },
        },
        {
            $project: {
                totalUrls: { $arrayElemAt: ["$summary.totalUrls", 0] },
                totalClicks: { $arrayElemAt: ["$summary.totalClicks", 0] },
                uniqueClicks: { $arrayElemAt: ["$summary.uniqueClicks", 0] },
                osType: 1,
                deviceType: 1,
            },
        },
    ];

    try {
        const [result] = await URL.aggregate(aggregationPipeline);

        return result
    } catch (error) {

        throw new ApiError(500, "Failed to retrieve topic analytics data");
    }
};










