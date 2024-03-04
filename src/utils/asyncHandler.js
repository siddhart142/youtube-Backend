

const asyncHandler = (requestHandler) =>{
    return (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>next(err))
    }
}

export {asyncHandler}



// const asyncHandler = () => {}; // function

// const asyncHandler = (fun) => {}; // function accepting other function as parameter i.e., higher order function

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