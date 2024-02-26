import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    
      // Send a health check response with OK status
      res.status(200).json(new ApiResponse(200, { message: "Health check OK" }));
})

export {
    healthcheck
    }
    