import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content, owner } = req.body;

    const newTweet = new Tweet({
        content,
        owner,
    });

    const savedTweet = await newTweet.save();

    if (!savedTweet) {
        throw new ApiError(500, "Tweet not created");
    }

    res.status(200).json(new ApiResponse(200, savedTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const userTweets = await Tweet.find({ owner: userId });

    if (!userTweets || userTweets.length === 0) {
        throw new ApiError(404, "User tweets not found");
    }

    res.status(200).json(new ApiResponse(200, userTweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    const updatedTweet = await Tweet.findByIdAndUpdate(
        req.tweet?._id,
        { $set: { content } },
        { new: true }
    ).select("-password");

    res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found");
    }

    res.status(200).json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};
