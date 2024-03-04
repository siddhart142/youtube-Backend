// Importing necessary modules and dependencies
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Creating a new mongoose schema for the Video model
const VideoSchema = new Schema({
    // Defining the structure of the video document
    videoFile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User" // Reference to the User model
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps to the document
});

// Adding pagination support using the mongoose-aggregate-paginate-v2 plugin
VideoSchema.plugin(mongooseAggregatePaginate);

// Creating the Video model using the defined schema
export const Video = mongoose.model("Video", VideoSchema);



// mongooseAggregatePaginate Plugin: This line adds pagination support to the Video model using the mongoose-aggregate-paginate-v2 plugin. This allows for paginated queries when fetching a list of videos.

// VideoSchema Structure: This section defines the structure of the video document, including properties like videoFile, thumbnail, title, description, duration, views, isPublished, and owner. The owner field is a reference to the User model, establishing a relationship between videos and users.

// timestamps Option: This option is set to true, which adds automatic createdAt and updatedAt timestamps to the video document, indicating when the video was created and last updated.

// export const Video: This line exports the Video model created using the defined schema, making it available for use in other parts of your application.