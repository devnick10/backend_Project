import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    // toggle like on video
   
    const userId = req.user._id; 

    // Check if the videoId is a valid ObjectId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    // Check if the user has already liked the video
    const existingLike = await Like.findOne({ user: userId, video: videoId });

    if (existingLike) {
        // If the user has already liked the video, remove the like
        await existingLike.remove();
        res.json(new ApiResponse(200, { liked: false }, "Video like removed successfully"));
    } else {
        // If the user has not liked the video yet, add a new like
        const newLike = new Like({ user: userId, video: videoId });
        await newLike.save();
        res.status(200).json(new ApiResponse(200, { liked: true }, "Video liked successfully"));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    // toggle like on comment
  
    const userId = req.user._id; 
    // Check if the commentId is a valid ObjectId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    // Check if the user has already liked the comment
    const existingLike = await Like.findOne({ user: userId, comment: commentId });

    if (existingLike) {
        // If the user has already liked the comment, remove the like
        await existingLike.remove();
        res.json(new ApiResponse(200, { liked: false }, "Comment like removed successfully"));
    } else {
        // If the user has not liked the comment yet, add a new like
        const newLike = new Like({ user: userId, comment: commentId });
        await newLike.save();
        res.json.status(200).json(new ApiResponse(200, { liked: true }, "Comment liked successfully"));
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    // Check if the tweetId is a valid ObjectId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    // Check if the user has already liked the tweet
    const existingLike = await Like.findOne({ user: userId, tweet: tweetId });

    if (existingLike) {
        // If the user has already liked the tweet, remove the like
        await existingLike.remove();
        res.json(new ApiResponse(200, { liked: false }, "Tweet like removed successfully"));
    } else {
        // If the user has not liked the tweet yet, add a new like
        const newLike = new Like({ user: userId, tweet: tweetId });
        await newLike.save();
        res.status(200).json(new ApiResponse(200, { liked: true }, "Tweet liked successfully"));
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id; 

    // Find all liked videos by the user
    const likedVideos = await Like.find({ user: userId, video: { $exists: true } }).populate("video");

    res.json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}