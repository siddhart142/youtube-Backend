// Importing utility functions and modules
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplodOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Jwt } from "jsonwebtoken";

// Importing a function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Finding the user by ID
        const user = await User.findById(userId);

        // Generating a refresh token and an access token for the user
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        // Updating the user's refreshToken in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Returning the generated tokens
        return { accessToken, refreshToken };
    } catch (error) {
        // Handling errors during token generation
        throw new ApiError(500, "Something went wrong while generating Tokens");
    }
}

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

// Defining an asynchronous handler for user login
const loginUser = asyncHandler(async (req, res) => {
    // Handling the login process steps
    // ...

    // Destructuring user credentials from the request body
    const { username, email, password } = req.body;

    // Checking if either username or email is provided
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Finding the user by username or email
    const user = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    // Checking if the user exists
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Checking if the provided password is correct
    const isValidUser = await user.isPasswordCorrect(password);

    if (!isValidUser) {
        throw new ApiError(401, "Invalid User Credentials");
    }

    // Generating access and refresh tokens for the user
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Retrieving the logged-in user details from the database, excluding password and refreshToken
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Configuring options for cookies
    const options = {
        httpOnly: true,
        secure: true,
    };

    // Returning a successful response with cookies and user details
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User Logged In Successfully")
        );
});

// Defining an asynchronous handler for user logout
const logoutUser = asyncHandler(async (req, res) => {
    // Handling the logout process steps
    // ...

    // Updating the user's refreshToken to undefined in the database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    // Configuring options for cookies
    const options = {
        httpOnly: true,
        secure: true,
    };

    // Returning a successful response with cleared cookies
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User Logged Out")
        );
});


const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Request")
    }

   try {
     const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET )
 
     const user = await User.findById(decodedToken?._id)
 
     if(!user){
         throw new ApiError(401,"Invalid Refresh Token")
     }
 
     if(incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401,"Refresh Token is expired or invalid")
     }
 
     const options = {
         httpOnly : true,
         secure : true
     }
 
     const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
 
     return res
     .status(200)
     .cookie("accessToken", accessToken)
     .cookie("refreshToken",refreshToken)
     .json(
         new ApiResponse(200,{
             accessToken,refreshToken
         },"Access Token refreshed")
     )
   } catch (error) {
        throw new ApiError(500,error?.message || "AccessToken Generation Failed")
   }
    
})

// Exporting the registerUser, loginUser, and logoutUser functions
export { registerUser, loginUser, logoutUser };
