import { Card, CardContent } from "@/components/ui/card";
import { IUser } from "@/lib/database/models/user.model";
import { IComment } from "@/lib/database/models/comment.model";
import { formatMongoDbDateInDays } from "@/lib/utils";
import LikesCard from "./LikesCard";
import Image from "next/image";

type CommentCardProps = {
  commentObj: IComment;
};

const CommentCard = ({ commentObj }: CommentCardProps) => {
  const { createdBy, comment, createdAt, likes, dislikes } = commentObj;
  const { _id, firstName, lastName, photo } = createdBy as Partial<IUser>;

  return (
    <Card className="w-full h-fit flex gap-5 p-0 mt-5 border-none">
      <CardContent className="p-0">
        <Image
          src={photo ?? "/assets/icons/user.svg"}
          alt={`${firstName} image`}
          height={50}
          width={50}
          className="rounded-full"
        />
      </CardContent>
      <CardContent className="p-0 w-full">
        <div className="flex items-center gap-5">
          <p className="font-bold tracking-wide">{`${firstName} ${lastName}`}</p>
          <p className="text-gray-500 text-sm">
            {formatMongoDbDateInDays(createdAt)}
          </p>
        </div>
        <p>{comment}</p>
        <div className="my-3">
          {/* <LikesCard
            likes={likes.length}
            dislikes={dislikes.length}
            handleLikesClick={() => console.log("likes")}
            handleDislikesClick={() => console.log("dislikes")}
            textColor={likes.includes(_id) ? "text-blue-500" : "text-gray-400"}
          /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
