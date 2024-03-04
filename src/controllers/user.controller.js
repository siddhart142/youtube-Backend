// Importing utility functions and modules
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplodOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Defining an asynchronous handler for user registration
const registerUser = asyncHandler(async (req, res) => {
    // Handling the registration process steps
    // ...

    // Destructuring user details from the request body
    const { fullname, email, username, password } = req.body;

    // Validation - checking if any required fields are empty
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Checking if a user with the provided username or email already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // Retrieving the local path of the avatar file from the request
    const avatarLocalPath = req.files?.avatar[0]?.path;

    // Retrieving the local path of the cover image file from the request
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // Checking if the avatar file is present in the request
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // Uploading the avatar and cover image files to Cloudinary
    const avatar = await uplodOnCloudinary(avatarLocalPath);
    const coverImage = await uplodOnCloudinary(coverImageLocalPath);

    // Checking if the avatar upload was successful
    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // Creating a new user in the database with the provided details and Cloudinary URLs
    const user = await User.create({
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()
    });

    // Retrieving the created user details from the database, excluding password and refreshToken
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Checking if the user creation was successful
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering");
    }

    // Returning a successful response with the created user details
    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// Exporting the registerUser function to make it available for use in other modules
export { registerUser };
