// Importing the Router module from Express
import { Router } from "express";

// Importing the registerUser function from the user.controller module
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";

// Importing the upload middleware from the multer.middleware module
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Creating an instance of the Express Router
const router = Router();

// Defining a route for user registration
router.route("/register").post(
    // Using the upload middleware for handling file uploads
    upload.fields([
        {
            name: "avatar", // Field name for the avatar file
            maxCount: 1 // Maximum number of files allowed for the avatar
        },
        {
            name: "coverImage", // Field name for the cover image file
            maxCount: 1 // Maximum number of files allowed for the cover image
        }
    ]),
    // Handling the registration process using the registerUser controller function
    registerUser
);

router.route("/login").post(loginUser)

//secured lines

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


// Exporting the router to make it available for use in other modules
export default router;
