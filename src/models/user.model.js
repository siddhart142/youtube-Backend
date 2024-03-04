// Importing necessary modules and dependencies
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Creating a new mongoose schema for the User model
const userSchema = new Schema({
    // Defining the structure of the user document
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String, // Cloudinary image URL
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video", // Reference to the Video model
    }],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps to the document
});

// Middleware function executed before saving a user document
userSchema.pre("save", async function (next) {
    // Check if the password field is modified before hashing
    if (!this.isModified("password")) return next();

    // Hashing the password using bcrypt with a cost factor of 10
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check if the provided password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    // Using bcrypt to compare the provided password with the hashed password stored in the document
    return await bcrypt.compare(password, this.password);
};

// Method to generate an access token for authentication
userSchema.methods.generateAccessToken = function () {
    // Using JWT to create a signed token containing user information (id, email, username, fullname)
    // The token is signed with a secret key and has an expiration time
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Method to generate a refresh token for token refreshing
userSchema.methods.generateRefreshToken = function () {
    // Creating a separate token for refreshing, typically with a longer expiration time
    // The refresh token is used to obtain a new access token without requiring the user to log in again
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

// Creating the User model using the defined schema
export const User = mongoose.model("User", userSchema);


// pre middleware: It is used to perform actions before saving a user document. In this case, it hashes the password before saving it to the database.

// isPasswordCorrect method: It checks if the provided password matches the hashed password stored in the user document. This is crucial for authentication processes.

// generateAccessToken method: It creates a signed JWT token containing user information. This token is used for authenticating and authorizing requests.

// generateRefreshToken method: It generates a separate JWT token, known as a refresh token. This token is used for obtaining a new access token without requiring the user to log in again. It enhances security by reducing the exposure of the access token.