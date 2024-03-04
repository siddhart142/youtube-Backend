import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit: "16kb"})) // for allowing db to accept json and setting the limit to 16kb
app.use(express.urlencoded({extended: true,limit : "16kb"})) // to get data from url and setting the limit to 16kb
app.use(express.static("public")) // to allow files/folder to store in server itself, here public folder will have all static files


app.use(cookieParser()) //CRUD on cookie

export default app;