import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema({
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
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    analytics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analytics'
    }]
}, { timestamps: true})

export const URL = mongoose.model("URL", urlSchema)