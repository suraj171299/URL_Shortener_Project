import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
    },
    longUrl: {
        type: String,
        required: true, 
    },
    customAlias: {
        type: String,
        unique: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    topic: {
        type: String,
        default: "Unknown"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    totalClicks: {
        type: Number,
        default: 0
    },
    uniqueClicks: {
        type: Number,
        default: 0
    },
    uniqueIPs: {
        type: [String],
        default: []
    },
    clicksByDate: {
        _id: false, 
        type: [
            {
                date:{ 
                    type: String,
                    required: true
                },
                clicks:{
                    type: Number,
                    default: 0
                }
            }
        ],
        default: []
    },
    osType: {
        type: Object,
        default: {}
    },
    deviceType: {
        type: Object,
        default: {}
    },
    analytics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analytics'
    }]
}, { timestamps: true})

export const URL = mongoose.model("URL", urlSchema)