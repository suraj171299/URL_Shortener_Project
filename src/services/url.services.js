import { URL } from "../models/url.models.js";

export const getUrlByAlias = async (alias) => {
    return await URL.findOne({ customAlias: alias })
}

export const incrementAnalytics = async (urlId, analyticsId) => {
    await URL.findByIdAndUpdate(urlId, {
        $push: { 
            analytics: analyticsId 
        },
    });
};