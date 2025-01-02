import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import urlRouter from "./routes/url.routes.js"
import analyticRouter from "./routes/analytic.routes.js"
import authRoutes from "./routes/auth.routes.js"
import { errorHandler } from './middlewares/error.middlewares.js'
import passport from "./config/passport.config.js"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger-output.json" with { type: 'json'}


const app = express()

const allowedOrigins = process.env.CORS_ORIGIN.split(',')

app.use(
    cors({
        origin: (origin, callback) => {
            if(!origin || allowedOrigins.includes(origin)){
                callback(null, true)
            }else{
                callback(new Error("Not allowed by CORS"))
            }
        },
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
)
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb"}))
app.use(passport.initialize())


//URL Routes
app.use("/api", urlRouter)
app.use("/api", analyticRouter)
app.use('/api/auth', authRoutes)
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('Welcome to the URL Shortener API!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app }