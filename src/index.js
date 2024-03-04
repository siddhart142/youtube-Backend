
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js"


dotenv.config({
    path : './env'
})

connectDB()
.then(()=>{
    
    app.on("error", (error) => {
        console.log("ERROR ",error);
        throw error;
    })
    app.listen(process.env.PORT,()=>{
        console.log(`Server is listening at ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("MONGODB CONNECTION FAIL!!! ",error)
})

// import express from "express";
// const app = express();

// ;(async () => {
//     try{

//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("ERROR ",error);
//             throw error;
//         })

//         app.listen(process.env.PORT, () =>{
//             console.log(`App listening on port ${process.env.PORT}`);
//         })
//     }
//     catch (error){
//         console.log("Error", error)
//         throw error
//     }
// } )() 

// ()()  => immediatly invoke function of JS