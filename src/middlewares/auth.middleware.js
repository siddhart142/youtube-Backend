import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to verify JWT (JSON Web Token)
export const verifyJWT = asyncHandler(async (req, res, next) => {
    // Extracting the token from cookies or the Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // Step 1: Checking if the token is missing
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        // Step 2: Verifying the token using the access token secret
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);  // Fix the environment variable name

        // Step 3: Retrieving user details from the database based on the decoded token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Step 4: Checking if the user exists
        if (!user) {
            // Todo: Discuss with the frontend regarding handling invalid tokens
            throw new ApiError(401, "Invalid Token");
        }

        // Step 5: Attaching the user details to the request object for further use
        req.user = user;
        next();  // Move to the next middleware or route handler
    } catch (error) {
        // Step 6: Handling errors during token verification
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});
