import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
//configurations:-\
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//configuting app.use so that express can read data from various resources such as forms or url 
//set limit to accespt that much amount of json file so that we can void server crash
app.use(express.json({limit: "16kb"}))
//for exaample if it type chai code then we can see that space gets encoded to %20 . 
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))// storing assets such that pdf or images in the sepearate public folder

// to use cookies or access cookies at browser we are using cookiesparser for that , also doing CRUD parser .
app.use(cookieParser())


//routes import

import userRouter from './routes/user.routes.js'

// routes declaraton
// when user goes to users router controll is passed to useRouter and task is performed accordingly .
app.use("/api/v1/users",userRouter)



export { app }