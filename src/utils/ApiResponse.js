// Defining a custom class ApiResponse
class ApiResponse {
    // Constructor for the ApiResponse class with default values for parameters
    constructor(statusCode, data, message = "Success") {
        // Assigning values to instance properties
        this.statusCode = statusCode; // HTTP status code for the response
        this.data = data; // Data payload for the response
        this.message = message; // Message indicating the status of the operation (default is "Success")
        this.success = statusCode < 400; // Flag indicating whether the operation was successful or not based on the status code
    }
}

// Exporting the ApiResponse class to make it available for use in other modules
export { ApiResponse };

// This code defines a custom ApiResponse class with a constructor that allows you to create instances of responses with specific properties such as HTTP status code, data payload, message, and a success flag based on the status code. The class is then exported for use in other modules. It's a simple representation of an API response with the ability to determine success based on the status code.




