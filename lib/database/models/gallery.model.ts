import { Document, Schema, models, model } from "mongoose";

export interface IGallery extends Document {
  imgUrl: string;
  imgSize: number;
}

const GallerySchema: Schema = new Schema<IGallery>({
  imgUrl: { type: String, required: true },
  imgSize: { type: Number, required: true },
});

const Gallery = models.Gallery || model<IGallery>("Gallery", GallerySchema);

export default Gallery;
