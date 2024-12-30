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

export const updateUrlClicks = async (urlId, analyticData) => {
    const { ipAddress, os, deviceType } = analyticData;
    const currentDate = new Date().toISOString().split("T")[0]
   
    const urlRecord = await URL.findById(urlId);


    if (!urlRecord.osType[os]) {
        urlRecord.osType[os] = { clicks: 0, users: [] }
    }
    urlRecord.osType[os].clicks += 1;
    if (!urlRecord.osType[os].users.includes(ipAddress)) {
        urlRecord.osType[os].users.push(ipAddress);
    }

    if (!urlRecord.deviceType[deviceType]) {
        urlRecord.deviceType[deviceType] = { clicks: 0, users: [] }
    }

    urlRecord.deviceType[deviceType].clicks += 1;
    if (!urlRecord.deviceType[deviceType].users.includes(ipAddress)) {
        urlRecord.deviceType[deviceType].users.push(ipAddress);
    }

    if (!urlRecord.uniqueIPs.includes(ipAddress)) {
        urlRecord.uniqueIPs.push(ipAddress)
        urlRecord.uniqueClicks = urlRecord.uniqueIPs.length
    }
    const uniqueClicks = urlRecord.uniqueIPs.length;
    
    let clicksByDate = urlRecord.clicksByDate || []

    clicksByDate = clicksByDate.filter(entry => entry.date)

    const dateIndex = clicksByDate.findIndex(entry => entry.date === currentDate)

    if(dateIndex !== -1){
        
        clicksByDate[dateIndex].clicks += 1
    
    }else{
        clicksByDate.push({ date: currentDate, clicks: 1})
    }

    clicksByDate = clicksByDate.slice(-7);

    const updatedUrl = await URL.findByIdAndUpdate(
        urlId,
        {
            $inc: { totalClicks: 1 },
            $addToSet: { uniqueIPs: ipAddress },
            $set: {
                [`osType.${os}`]: urlRecord.osType[os],
                [`deviceType.${deviceType}`]: urlRecord.deviceType[deviceType],
                uniqueClicks: uniqueClicks,
                clicksByDate: clicksByDate
            },
        },
        { new: true }
    );
    
    return updatedUrl;
};
