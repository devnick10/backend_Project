import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  // get all videos based on query, sort, pagination

  page = parseInt(page);
  limit = parseInt(limit);

  // Build the query object
  const queryObj = {};
  if (query) {
    queryObj.$text = { $search: query };
  }
  if (userId) {
    queryObj.user = userId;
  }

  // Build the sort object
  const sortObj = {};
  if (sortBy) {
    sortObj[sortBy] = sortType === "desc" ? -1 : 1;
  }

  // Perform the query with pagination
  const videos = await Video.find(queryObj)
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user", "username"); // Populate user field with username from User model

  // Count total videos matching the query
  const totalVideos = await Video.countDocuments(queryObj);

  // Calculate total pages
  const totalPages = Math.ceil(totalVideos / limit);

  // Prepare pagination metadata
  const pagination = {
    totalVideos,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  // Respond with the paginated videos and pagination metadata
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videos, pagination },
        "Videos fetched successfully"
      )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // get video, upload to cloudinary, create video

  const { videoFile } = req.file;

  // Check if video file exists
  if (!videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  // Upload video to Cloudinary
  const uploadedvideoFile = await uploadOnCloudinary(videoFileLocalPath);

  // Create a new video entry in the database
  const newVideo = new Video({
    title,
    description,
    video: uploadedvideoFile?.url,
  });

  await newVideo.save();

  res
    .status(201)
    .json(new ApiResponse(201, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //: get video by id

  const video = await Video.findById(videoId);
   
  if (!video) {
    throw new ApiError(500,"video not found")
  }


  res.status(201).json(new ApiResponse(201, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, thumbnail } = req.body;
  // update video details like title, description, thumbnail

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { title, description , thumbnail},
    },
    {
      new: true,
    }
  ).select("-password");

  if (!updatedVideo) {
    throw new ApiError(400,"Video not updated")
  }

  res.status(200).json(new ApiResponse(200,updatedVideo," Video updated successfully "))

});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // delete video
  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(500, " Error while deleting video");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, " Video deleted successfully "));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
 
  const video = await Video.findById(videoId);

  // Check if the video exists
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Toggle the publish status
  video.isPublished = !video.isPublished;
   
  // Save the updated video back to the database
  const updatedVideo = await video.save();
  
  if (!updatedVideo) {
     throw new ApiError(404,"Video not updated")
  }

  // Respond with the updated video object
  res.status(200).json(new ApiResponse(200, updatedVideo, "Publish status toggled successfully"));

});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
