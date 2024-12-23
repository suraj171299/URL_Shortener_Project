import axios from "axios"
import { ApiError } from "./ApiError.js"

const getLocationfromIP = async(ipAddress) => {
    try {
        const API_KEY = process.env.API_KEY
        const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${API_KEY}`)
        return response.data
    } catch (error) {
        throw new ApiError(400, "Cannot fetch location")
        return null
    }
}

export default getLocationfromIP