// Defining a higher-order function named asyncHandler
const asyncHandler = (requestHandler) => {
    // Returning a middleware function that wraps the provided requestHandler
    return (req, res, next) => {
        // Wrapping the execution of the requestHandler in a Promise
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err)); // Handling any errors and passing them to the next middleware
    }
}

// Exporting the asyncHandler function to make it available for use in other modules
export { asyncHandler };


// Example alternative variations using different syntax:

// const asyncHandler = () => {}; // function

// const asyncHandler = (fun) => {}; // function accepting other function as parameter i.e., higher-order function

// const asyncHandler = (fun) => { ()=> {}} 

// const asyncHandler = (fun) => async (req,res, next) =>{

//     try{
//         await fun(req,res,next)
//     }
//     catch(error){
//         res.status(err.code || 500).json({
//             success :false,
//             message : error.message
//         })
//     }
// }

// This code defines an asyncHandler function, which is a higher-order function that takes a requestHandler function as a parameter. It returns a middleware function with the signature (req, res, next), which wraps the execution of the provided requestHandler in a Promise. If an error occurs during the execution, it is caught and passed to the next middleware in the chain. The purpose of asyncHandler is to simplify error handling for asynchronous operations in Express middleware.

// Additionally, you've provided alternative commented-out code snippets, showcasing different ways to define the asyncHandler function, including variations using arrow functions and async/await syntax. The final version, as presented in the code, is a concise and effective way to handle asynchronous operations in Express middleware.



