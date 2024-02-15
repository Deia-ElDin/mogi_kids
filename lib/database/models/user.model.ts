import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: "string", required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  photo: String,
  role: { type: "string", default: "user" },
});

const User = models.User || model("User", UserSchema);

export default User;
