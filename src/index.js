// Importing the dotenv library for environment variable configuration
import dotenv from "dotenv";

// Importing the connectDB function to establish a connection with MongoDB
import connectDB from "./db/index.js";

// Importing the Express app instance
import app from "./app.js";

// Loading environment variables from the specified file
dotenv.config({
    path: './env'
});

// Connecting to MongoDB using the connectDB function
connectDB()
    .then(() => {
        // Handling errors and logging them if they occur
        app.on("error", (error) => {
            console.log("ERROR ", error);
            throw error;
        });

        // Starting the Express app and listening on the specified port
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening at ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        // Logging an error message if the MongoDB connection fails
        console.log("MONGODB CONNECTION FAIL!!! ", error);
    });

// The commented-out code is an alternative way to establish the connection and start the server using immediately invoked functions.
// However, the first approach with promises is cleaner and more readable.
// Uncomment this code and comment out the above code block if you want to use the alternative approach.

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
// })(); // Immediately invoke the function
