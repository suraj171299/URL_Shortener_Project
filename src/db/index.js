import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected!! DB host: ${connect.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection error', error);
        exit(1)
    }
}

export default connectDB