import { User } from "../models/user.models.js"
import { ApiError } from "./ApiError.js"

export const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        
        const accessToken = user.generateAccessToken()
        
        await user.save({ validateBeforeSave: false })
        
        return accessToken 
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token")
    }
}

export const generateRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        
        await user.save({ validateBeforeSave: false })
       
        
        return refreshToken 
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh token")
    }
}