import { Document, Schema, models, model } from "mongoose";

export interface IUser extends Document {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  gender: "Male" | "Female" | "";
  phoneNumbers: string[] | [];
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
  role: { type: "string", default: "User" },
});

const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
