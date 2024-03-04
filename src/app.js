// Importing the necessary libraries for creating an Express app
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Creating an instance of the Express app
const app = express();

// Configuring CORS middleware to handle cross-origin requests
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allowing requests from the specified origin
    credentials: true // Allowing credentials (e.g., cookies) to be sent with cross-origin requests
}));

// Parsing incoming JSON requests and setting a size limit of 16kb
app.use(express.json({ limit: "16kb" }));

// Parsing incoming URL-encoded requests, enabling extended mode, and setting a size limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serving static files from the "public" folder
app.use(express.static("public"));

// Parsing and handling cookies using the cookie-parser middleware
app.use(cookieParser());

// Importing user routes from the specified file
import userRoutes from "./routes/user.routes.js";

// Declaring and using user routes under the "/api/v1/users" endpoint
app.use("/api/v1/users", userRoutes);

// Exporting the configured Express app
export default app;
