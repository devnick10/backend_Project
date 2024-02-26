import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    //toggle subscription

    const existingSubscription = await Subscription.findOne({ channelId} );
        
    if (existingSubscription) {
        // If subscription exists, remove it (unsubscribe)
        await Subscription.findByIdAndDelete(existingSubscription._id);
        res.status(200).json(new ApiResponse(200, " Unsubcscibe successfully"));
    } else {
        // If subscription doesn't exist, create a new subscription (subscribe)
        const newSubscription = new Subscription({ channelId });
        await newSubscription.save();
        res.status(200).json(new ApiResponse(200, "Subscribe successfully"));
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const subscribers = await Subscription.find({ channelId }).populate('userId', 'username'); 

    if (!subscribers) {
        throw new ApiError(500,"Error fetching subscribers")
    }

    res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
  
    const subscriptions = await Subscription.find(
        { userId: subscriberId }
        ).populate('channelId', 'name'); 

     if (!subscriptions) {
        throw new ApiError(500,"Error fetching subscribed channels")
     } 

    res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}