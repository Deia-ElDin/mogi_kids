import { Document, Schema, model, models } from "mongoose";

export interface IWelcomePage extends Document {
  _id: string;
  title: string;
  content: string;
}

const WelcomePageSchema = new Schema({
  title: { type: String, trim: true },
  content: { type: String, trim: true },
});

const WelcomePageModel =
  models.WelcomePage || model<IWelcomePage>("WelcomePage", WelcomePageSchema);

export default WelcomePageModel;
