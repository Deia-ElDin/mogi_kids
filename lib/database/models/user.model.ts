import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: "string", required: true, unique: true },
  firstName: { type: "string" },
  lastName: { type: "string" },
  email: { type: "string" },
  photo: { type: "string" },
  role: { type: "string", default: "user" },
});

const User = models.User || model("User", UserSchema);

export default User;
