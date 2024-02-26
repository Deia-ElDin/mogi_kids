import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/lib/database/models/user.model";
import { IReview } from "@/lib/database/models/review.model";
import {
  updateReviewLikes,
  updateReviewDislikes,
} from "@/lib/actions/review.actions";
import Text from "../helpers/Text";
import Rating from "../helpers/Rating";
import CommentForm from "../forms/CommentForm";
import CommentCard from "./CommentCard";
import LikesCard from "./LikesCard";

type ReviewCardParams = {
  user: IUser | undefined;
  reviewObj: IReview;
};

const ReviewCard: React.FC<ReviewCardParams> = ({ user, reviewObj }) => {
  const { createdBy, review, rating, comments, likes, dislikes } = reviewObj;

  const {
    _id: creatorId,
    firstName,
    lastName,
    photo,
  } = createdBy as Partial<IUser>;

  const likesColor =
    user &&
    creatorId &&
    likes.map((objectId) => objectId.toString()).includes(user?._id)
      ? "text-blue-500"
      : "text-gray-400";

  const dislikesColor =
    user &&
    creatorId &&
    dislikes.map((objectId) => objectId.toString()).includes(user?._id)
      ? "text-red-500"
      : "text-gray-400";

  console.log("likes = ", likes.length);
  console.log("dislikes = ", dislikes.length);

  // console.log("reviewObj = ", reviewObj);
  // console.log("reviewObj.comments[0] = ", reviewObj.comments[0]);
  // console.log("createdBy = ", createdBy);

  const handleReviewLikeClick = async () => {
    await updateReviewLikes(reviewObj._id, user?._id!);
  };

  const handleReviewDisLikeClick = async () => {
    await updateReviewDislikes(reviewObj._id, user?._id!);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Card className="flex flex-col gap-3 justify-between items-start w-[300px] h-[450px] p-3 rounded-lg cursor-pointer shadow-xl">
          <div className="flex flex-col gap-3 p-0">
            <div className="flex justify-center">
              {rating && parseInt(rating) > 0 && (
                <Rating rating={parseInt(rating)} />
              )}
            </div>
            <Text
              text={review!}
              targetClass={2}
              textClass="max-h-[300px] overflow-auto"
            />
          </div>
          <div className="flex items-center gap-3 w-full p-0">
            <Avatar className="rounded-full h-[60px] w-[60px]">
              <AvatarImage src={photo ?? "/assets/icons/user.svg"} />
            </Avatar>
            <div className="h-[60px] pt-3">
              <Text
                text={firstName ? firstName + " " + lastName : "Customer"}
              />
            </div>
          </div>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[700px] overflow-auto flex flex-col">
        <SheetHeader className="flex flex-col mt-5 p-0">
          <SheetTitle className="flex flex-col items-center">
            <Avatar className="rounded-full h-[100px] w-[100px]">
              <AvatarImage src={photo ?? "/assets/icons/user.svg"} />
            </Avatar>
            <p className="font-bold text-center text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] lg:text-[20px] lg:leading-[32px] xl:text-[22px] xl:leading-[36px">
              {firstName ? firstName + " " + lastName : "Customer"}
            </p>
          </SheetTitle>
          <div className="flex flex-col gap-3 text-black">
            <div className="flex justify-center">
              {rating && parseInt(rating) > 0 && (
                <Rating rating={parseInt(rating)} />
              )}
            </div>
            <Text
              text={review!}
              targetClass={2}
              textClass="max-h-[300px] overflow-auto border-2 p-2 rounded-md shadow-lg"
            />
          </div>
        </SheetHeader>

        <div className="flex gap-8 w-[200px]">
          <LikesCard
            likes={likes.length}
            dislikes={dislikes.length}
            likesColor={likesColor}
            dislikesColor={dislikesColor}
            handleLikesClick={handleReviewLikeClick}
            handleDislikesClick={handleReviewDisLikeClick}
          />
        </div>

        <div className="flex flex-col gap-3 text-black">
          {comments.length > 0 &&
            comments.map((comment) => (
              <CommentCard key={comment._id} commentObj={comment} />
            ))}
        </div>

        <SheetFooter className="w-full flex flex-col gap-3 text-black mt-5">
          {user && user?._id != creatorId && (
            <CommentForm user={user} reviewId={reviewObj._id} comment={null} />
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ReviewCard;
