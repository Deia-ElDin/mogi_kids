import { Document, Schema, models, model } from "mongoose";
import { IReview } from "./review.model";

export interface IUser extends Document {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  gender: "Male" | "Female" | "";
  phoneNumbers: string[] | [];
  reviews: IReview[] | [];
  role: "Admin" | "User";
  ban: boolean;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, default: "" },
  photo: { type: String, default: "" },
  gender: { type: String, default: "" },
  phoneNumbers: Array,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  role: { type: String, default: "User" },
  ban: { type: Boolean, default: false },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
