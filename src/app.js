import express from 'express'
import cors from 'cors'
import urlRouter from "./routes/url.routes.js"
import { errorHandler } from './middlewares/error.middlewares.js'

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb"}))


//URL Routes
app.use("/api/shorten", urlRouter)


app.use(errorHandler)
export { app }