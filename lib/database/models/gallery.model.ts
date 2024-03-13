import { Document, Schema, models, model } from "mongoose";
import { galleryErrs } from "@/constants/errors";
import { isValidUrl } from "@/lib/utils";

export interface IGallery extends Document {
  imgUrl: string;
  imgSize: number;
}

const GallerySchema: Schema = new Schema<IGallery>({
  imgUrl: {
    type: String,
    trim: true,
    required: [true, galleryErrs.errs.min],
    validate: { validator: isValidUrl, message: galleryErrs.errs.invalid },
  },
  imgSize: { type: Number, required: true },
});

const Gallery = models.Gallery || model<IGallery>("Gallery", GallerySchema);

export default Gallery;
