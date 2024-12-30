import passport from "passport"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js"

export const googleCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user, info) => {
        
        if (err || !user) {
            return next(new ApiError(401, 'Authentication failed'));
        }

        try {
            
            const accessToken = await generateAccessToken(user._id)
            const refreshToken = await generateRefreshToken(user._id)


            return res
                .status(200)
                .json(new apiResponse(200, {
                    accessToken,
                    refreshToken,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name
                    }
                }))

        } catch (error) {
            return next(new ApiError(500, 'Error generating tokens'))
        }
    })(req, res, next);
}

export const googleSignIn = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next)
}

export const refreshAccessToken = async (req, res, next) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required');
    }

    try {

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decoded?._id)


        if (!user) {
            throw new ApiError(400, 'Refresh token is required');
        }

        const accessToken = await generateAccessToken(user._id)

        res.status(200).json(new apiResponse(200, accessToken, "Access token generated successfully"))

    } catch (error) {
        throw new ApiError(400, 'Refresh token is required');
    }

}