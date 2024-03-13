import { Document, Schema, models, model } from "mongoose";
import { logoErrs } from "@/constants/errors";
import { isValidUrl } from "@/lib/utils";

export interface ILogo extends Document {
  _id: string;
  imgUrl: string;
  imgSize: number;
}

const LogoSchema: Schema = new Schema<ILogo>({
  imgUrl: {
    type: String,
    trim: true,
    required: [true, logoErrs.errs.min],
    validate: { validator: isValidUrl, message: logoErrs.errs.invalid },
  },
  imgSize: { type: Number, required: true },
});

const Logo = models.Logo || model<ILogo>("Logo", LogoSchema);

export default Logo;
