// Importing the mongoose library for MongoDB interactions
import mongoose from "mongoose";

// Importing the constant DB_NAME from the specified file
import { DB_NAME } from "../constants.js";

// Defining a function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Constructing the MongoDB connection URL using the environment variable MONGODB_URL and the database name
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        // Logging a successful connection message along with the host information
        console.log(`\n MongoDB Connected !! DB HOST : ${connectionInstance.connection.host}\n`);
    }
    catch (error) {
        // Logging an error message if the connection fails and exiting the process with an error code
        console.log("MONGODB connection error ", error);
        process.exit(1);
    }
}

// Exporting the connectDB function to be used in other modules
export default connectDB;
