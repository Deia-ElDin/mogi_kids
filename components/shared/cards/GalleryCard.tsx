import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IGallery } from "@/lib/database/models/gallery.model";
import {
  updateGalleryImg,
  deleteGalleryImg,
} from "@/lib/actions/gallery.actions";
import { handleError } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import DeleteBtn from "../btns/DeleteBtn";

type GalleryImgCardParams = {
  galleryImg: IGallery | null;
};

const GalleryImgCard: React.FC<GalleryImgCardParams> = ({ galleryImg }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteGalleryImg(galleryImg?._id);
      toast({ description: "GalleryImg Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to Delete The GalleryImg.",
      });
      handleError(error);
    }
  };

  return (
    <Card className="border-none bg-orange-50 rounded-lg p-3">
      <CardContent className="flex justify-center p-0">
        <img
          src={galleryImg?.imgUrl}
          alt="Gallery image"
          style={{
            width: "100%",
            height: "auto",
            flexShrink: 0,
            flexGrow: 0,
            aspectRatio: "2/1",
            objectFit: "cover",
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-col justify-center items-center gap-3 w-full h-fit p-3">
        <DeleteBtn
          pageId={galleryImg?._id}
          isAdmin={true}
          deletionTarget="Delete GalleryImg"
          handleClick={handleDelete}
        />
      </CardFooter>
    </Card>
  );
};

export default GalleryImgCard;
