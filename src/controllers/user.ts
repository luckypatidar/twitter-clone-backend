import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import Tweet from "../models/TweetsModel";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json("User not found");
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id === req['user'].id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      if (!updatedUser) {
        res.status(404).json("User not found");
        return;
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    res.status(403).json("You can update only your account");
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id === req['user'].id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      await Tweet.deleteMany({ userId: req.params.id });

      res.status(200).json("User deleted");
    } catch (err) {
      next(err);
    }
  } else {
    res.status(403).json("You can only delete your own account");
  }
};

export const follow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.id);

    if (!user || !currentUser) {
      res.status(404).json("User not found");
      return;
    }

    if (!user.followers.includes(req.body.id)) {
      await user.updateOne({
        $push: { followers: req.body.id },
      });

      await currentUser.updateOne({ $push: { following: req.params.id } });
      res.status(200).json("Following the user");
    } else {
      res.status(403).json("You already follow this user");
    }
  } catch (err) {
    next(err);
  }
};

export const unFollow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.id);

    if (!user || !currentUser) {
      res.status(404).json("User not found");
      return;
    }

    if (currentUser.following.includes(req.params.id)) {
      await user.updateOne({
        $pull: { followers: req.body.id },
      });

      await currentUser.updateOne({ $pull: { following: req.params.id } });
      res.status(200).json("Unfollowing the user");
    } else {
      res.status(403).json("You are not following this user");
    }
  } catch (err) {
    next(err);
  }
};
