// Defining a custom class ApiError that extends the built-in Error class
class ApiError extends Error {
    // Constructor for the ApiError class with default values for parameters
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack = ""
    ) {
        // Calling the constructor of the base Error class with the provided message
        super(message);

        // Assigning values to instance properties
        this.statusCode = statusCode; // HTTP status code for the error
        this.data = null; // Additional data (can be used to send more information about the error)
        this.message = message; // Error message
        this.success = false; // Flag indicating whether the operation was successful or not
        this.errors = errors; // Array of detailed error messages

        // Setting the stack trace for the error
        if (stack) {
            this.stack = stack; // If a custom stack is provided, use it
        } else {
            // If no custom stack is provided, capture the stack trace using Error.captureStackTrace
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Exporting the ApiError class to make it available for use in other modules
export { ApiError };


// This code defines a custom ApiError class with a constructor that allows you to create instances of errors with specific properties such as HTTP status code, message, errors array, and stack trace. The class extends the built-in Error class, and the stack trace is handled using Error.captureStackTrace. The class is then exported for use in other modules.