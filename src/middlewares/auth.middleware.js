import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // console.log("Token:", token);
    // console.log(req.cookies);  // Fix the property name

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESSS_TOKEN_SECRET);  // Fix the environment variable name

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            // Todo discuss frontend
            throw new ApiError(401, "Invalid Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});
