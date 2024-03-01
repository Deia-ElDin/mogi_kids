import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type LikesCardProps = {
  likes: number;
  dislikes: number;
  likesColor: string;
  dislikesColor: string;
  handleLikesClick: () => void;
  handleDislikesClick: () => void;
};

const LikesCard = (props: LikesCardProps) => {
  const {
    likes,
    dislikes,
    likesColor,
    dislikesColor,
    handleLikesClick,
    handleDislikesClick,
  } = props;

  return (
    <Card className="flex gap-9 p-0 border-none shadow-none">
      <CardContent className="p-0 relative">
        <Image
          src="/assets/icons/like.svg"
          alt="close"
          width={30}
          height={30}
          className="cursor-pointer "
          onClick={handleLikesClick}
        />
        <p
          className={`absolute top-[-3px] right-[-16px] font-bold text-base ${likesColor}`}
        >
          {likes}
        </p>
      </CardContent>
      <CardContent className="p-0 relative">
        <Image
          src="/assets/icons/dislike.svg"
          alt="close"
          width={30}
          height={30}
          className="cursor-pointer"
          onClick={handleDislikesClick}
        />
        <p
          className={`absolute top-[-3px] right-[-16px] font-bold text-base ${dislikesColor}`}
        >
          {dislikes}
        </p>
      </CardContent>
    </Card>
  );
};

export default LikesCard;
