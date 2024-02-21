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
}

const UserSchema = new Schema({
  clerkId: { type: "string", required: true, unique: true },
  firstName: { type: "string", default: "" },
  lastName: { type: "string", default: "" },
  email: { type: "string", default: "" },
  photo: { type: "string", default: "" },
  gender: { type: "string", default: "" },
  phoneNumbers: Array,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  role: { type: "string", default: "User" },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
