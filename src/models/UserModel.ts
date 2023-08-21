import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileProfile?: string;
  followers: string[];
  following: string[];
  description?: string;
  profilePicture?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileProfile: { type: String },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    description: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
