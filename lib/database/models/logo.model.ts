import { Document, Schema, models, model } from "mongoose";

export interface ILogo extends Document {
  _id: string;
  imgUrl: string;
  imgSize: number;
}

const LogoSchema: Schema = new Schema<ILogo>({
  imgUrl: { type: String, trim: true, required: true },
  imgSize: { type: Number, required: true },
});

const Logo = models.Logo || model<ILogo>("Logo", LogoSchema);

export default Logo;
