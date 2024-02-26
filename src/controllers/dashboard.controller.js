import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  //Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const { channelId } = req.params;

  const totalVideoViews = await Video.aggregate([
    {
      $match: { channel: mongoose.Types.ObjectId(channelId) },
    },
    {
      $group: {
        id: null,
        totoalViews: { $sum: "$views" },
      },
    },
  ]);

  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  const totalVideos = await Video.countDocuments({ channel: channelId });

  const totalLikes = await Like.countDocuments({
    video: {
      $in: await Video.find({ channel: channelId }, "_id"),
    },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideoViews: totalVideoViews[0]?.totalViews || 0,
        totalSubscribers,
        totalVideos,
        totalLikes,
      },
      "Channel statistics fetched successfully"
    )
  );
});
const getChannelVideos = asyncHandler(async (req, res) => {
  // Get all the videos uploaded by the channel

  const { channelId } = req.params;

  // Get all videos uploaded by the channel
  const videos = await Video.find({ channel: channelId });

  // Send the channel videos as a response
  res.json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
