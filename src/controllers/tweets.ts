import { Request, Response, NextFunction } from "express";
import Tweet from "../models/TweetsModel";
import { handleError } from "../error";
import User from "../models/UserModel";

export const createTweet = async (req: Request, res: Response, next: NextFunction) => {
  const newTweet = new Tweet(req.body);
  try {
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    handleError(500, err);
  }
};

export const deleteTweet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      handleError(404, "Tweet not found");
      return;
    }
    if (tweet.userId === req.body.id) {
      await tweet.deleteOne();
      res.status(200).json("Tweet has been deleted");
    } else {
      handleError(403, "You are not authorized to delete this tweet");
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const likeOrDislike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      handleError(404, "Tweet not found");
      return;
    }
    if (!tweet.likes.includes(req.body.id)) {
      await tweet.updateOne({ $push: { likes: req.body.id } });
      res.status(200).json("Tweet has been liked");
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.id } });
      res.status(200).json("Tweet has been disliked");
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const getAllTweets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (!currentUser) {
      handleError(404, "User not found");
      return;
    }
    const userTweets = await Tweet.find({ userId: currentUser._id });
    const followersTweets = await Promise.all(
      currentUser.following.map(async (followerId) => {
        return await Tweet.find({ userId: followerId });
      })
    );

    res.status(200).json(userTweets.concat(...followersTweets));
  } catch (err) {
    handleError(500, err);
  }
};

export const getUserTweets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userTweets = await Tweet.find({ userId: req.params.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(userTweets);
  } catch (err) {
    handleError(500, err);
  }
};

export const getExploreTweets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const getExploreTweets = await Tweet.find({
      likes: { $exists: true },
    }).sort({ likes: -1 });

    res.status(200).json(getExploreTweets);
  } catch (err) {
    handleError(500, err);
  }
};
