import mongoose, { Document, Schema } from "mongoose";

interface ITweet extends Document {
  userId: string;
  description: string;
  likes: string[];
  imgUrl?: string;
}

const TweetSchema = new Schema<ITweet>(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 280,
    },
    likes: {
      type: [String],
      default: [],
    },
    imgUrl: {
      type: String,
    }
  },
  { timestamps: true }
);

const TweetModel = mongoose.model<ITweet>("Tweet", TweetSchema);

export default TweetModel;
