import { Analytics } from "../models/analytic.models.js";
import { getLocationfromIP } from "../utils/getLocationfromIP.js";


export const createAnalyticLog = async (req, urlRecord) => {
    const ipAddress = '5.1.2.3'
    const userAgent = req.headers['user-agent'] || "Unknown"
    const location = await getLocationfromIP(ipAddress)

    const analytics = await Analytics.create({
        userAgent,
        ipAddress,
        location: location,
        url: urlRecord?._id
    })

    return { ipAddress, userAgent, location, analyticsId: analytics._id };
}