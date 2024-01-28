import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit: "16kb"})) // for allowing db to accept json
app.use(express.urlencoded({extended: true,limit : "16kb"})) // to get data from url
app.use(express.static("public")) 


app.use(cookieParser()) //CRUD on cookie

export default app;