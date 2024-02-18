import { Document, Schema, models, model } from "mongoose";

export interface IWelcomePage extends Document {
  _id: string;
  title: string;
  content: string;
}

const WelcomePageSchema = new Schema({
  title: { type: String, trim: true, required: true },
  content: { type: String, trim: true },
});

const WelcomePage =
  models.WelcomePage || model<IWelcomePage>("WelcomePage", WelcomePageSchema);

export default WelcomePage;
