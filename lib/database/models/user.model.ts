import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: "string", required: true, unique: true },
  firstName: { type: "string", required: true },
  lastName: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  photo: { type: "string", required: true },
  role: { type: "string", default: "user" },
});

const User = models.User || model("User", UserSchema);

export default User;
