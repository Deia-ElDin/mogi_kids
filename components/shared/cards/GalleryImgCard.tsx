import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IGallery } from "@/lib/database/models/gallery.model";
import { deleteGalleryImg } from "@/lib/actions/gallery.actions";
import { handleError } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import XBtn from "../btns/XBtn";
import Image from "next/image";

type GalleryImgCardParams = {
  galleryImg: IGallery | null;
  img: IGallery | null;
  setImg: React.Dispatch<React.SetStateAction<IGallery | null>>;
};

const GalleryImgCard: React.FC<GalleryImgCardParams> = ({
  galleryImg,
  img,
  setImg,
}) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteGalleryImg(galleryImg?._id);
      toast({ description: "Gallery Image Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: handleError(error),
      });
    }
  };

  return (
    <Card
      className={`h-[100px] w-[100px] shrink-0 p-0 rounded-sm cursor-pointer border-4 ${
        img && img._id === galleryImg?._id ? "border-green-700" : ""
      } flex items-center justify-center relative`}
    >
      <CardContent className="h-full w-full p-0 rounded-sm relative">
        {galleryImg?.imgUrl && (
          <XBtn
            btnClass="absolute top-0 right-0 cursor-pointer hover:scale-125"
            deletionTarget="image"
            handleClick={handleDelete}
          />
        )}
        <Image
          src={
            galleryImg?.imgUrl ? galleryImg.imgUrl : "/assets/icons/upload.svg"
          }
          alt={
            galleryImg?.imgUrl ? "Gallery Image" : "/assets/icons/upload.svg"
          }
          height={100}
          width={100}
          className="h-full w-full"
          onClick={() => setImg(galleryImg ?? null)}
        />
      </CardContent>
    </Card>
  );
};

export default GalleryImgCard;
