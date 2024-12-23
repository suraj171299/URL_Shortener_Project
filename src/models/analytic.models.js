import mongoose, { Schema } from "mongoose";

const analyticSchema = new Schema({
    url:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "URL"
    },
    userAgent:{
        type: String
    },
    ipAddress:{
        type: String
    },
    location:{
        type: Object
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
})

export const Analytics = mongoose.model("Analytics", analyticSchema)
