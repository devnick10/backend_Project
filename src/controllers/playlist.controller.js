import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, discription } = req.body;

  //create playlist
  const playlist = new Playlist({
    name,
    discription,
  });

  if (!playlist) {
   throw new ApiError(400, "Error creating playlist");
  }

  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "New playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // get user playlists
  const playlists = await Playlist.find({ userId });

  if (playlists.length === 0) {
    throw new ApiError(404, "No playlists found for the user")
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlist fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // get playlist by id

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
     throw new ApiError(404, "Playlist not found")
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found")
  }

  playlist.videos.push(videoId);

  await playlist.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
   throw new ApiError(400, "Video not found in the playlist");
  }

  // Check if the video exists in the playlist

  const videoIndex = playlist.videos.indexOf(videoId);
  if (videoIndex === -1) {
   throw new ApiError(400, "Video not found in the playlist");
  }

  // Remove the video from the 'videos' array
  playlist.videos.splice(videoIndex, 1);

  
  await playlist.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, "Video removed from playlist successfully", playlist)
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //  delete playlist
  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!deletedPlaylist) {
    throw new ApiError(400, "Playlist not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, deletePlaylist, "Playlist deleted successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  // update playlist

  let playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "Playlist not found")
  }

  // Update playlist properties if provided
  if (name) {
    playlist.name = name;
  }
  if (description) {
    playlist.description = description;
  }

  
  playlist = await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Playlist updated successfully", playlist));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
