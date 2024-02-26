import mongoose from "mongoose";
import { Comment, commet } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const comments = await Comment.find({ videoId })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  res.json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // add a comment to a video
  const { videoId } = req.params;
  const { content, author } = req.body;

  const newComment = new Comment({
    videoId,
    content,
    author,
  });

  await newComment.save();

  res
    .status(201)
    .json(new ApiResponse(201, newComment, " Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  //  update a comment
  const { commentsId } = req.params;
  const { content } = req.body;
 
  const updatedComment = await Tweet.findByIdAndUpdate(
    commentsId,
    { $set: { content } },
    { new: true }
).select("-password");


  if (!updatedComment) {
    new ApiError(404, "Comment not update");
  }

  await updatedComment.save();

  res.status(200).json(200, updatedComment, "Comment updated successfull");
});

const deleteComment = asyncHandler(async (req, res) => {
  //  delete a comment
  const { commentId } = req.params;

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    new ApiError(404, "comment not found");
  }

  res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
