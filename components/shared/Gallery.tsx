import { getGallery } from "@/lib/actions/gallery.actions";
import GallerySwiper from "./swiper/GallerySwiper";

const Gallery = async () => {
  const galleryResult = await getGallery();

  const gallery = galleryResult.success ? galleryResult.data || [] : [];

  if (Array.isArray(gallery) && gallery.length > 0) {
    return <GallerySwiper gallery={gallery} />;
  }

  // Return null if gallery is empty or not an array
  return null;
};

export default Gallery;
