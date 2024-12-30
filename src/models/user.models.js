import mongoose,{ Schema } from "mongoose"
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    googleId: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })


userSchema.methods.generateAccessToken = function(){

    return jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

userSchema.methods.generateRefreshToken = function(){
   
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
}


export const User = mongoose.model("User", userSchema)