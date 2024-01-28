import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try{
        // console.log(process.env.MONGODB_URL)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB Connected !! DB HOST : ${connectionInstance.connection.host}\n`);

    }
    catch (error){
        console.log("MONGODB connection error ",error);
        process.exit(1)
    }
}

export default connectDB;