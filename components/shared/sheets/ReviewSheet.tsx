import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IUser } from "@/lib/database/models/user.model";
import { IReview } from "@/lib/database/models/review.model";
import {
  updateReview,
  deleteReview,
  updateReviewLikes,
  updateReviewDislikes,
} from "@/lib/actions/review.actions";
import { createReport } from "@/lib/actions/report.actions";
import { handleError, postedSince } from "@/lib/utils";
import { reviewSchema } from "@/lib/validators";
import DotsBtn from "../btns/DotsBtn";
import ReviewCard from "../cards/ReviewCard";
import RatingInput from "../helpers/RatingInput";
import CommentForm from "../forms/CommentForm";
import CommentCard from "../cards/CommentCard";
import LikesCard from "../cards/LikesCard";
import Rating from "../helpers/Rating";
import Text from "../helpers/Text";
import * as z from "zod";

type ReviewSheetParams = {
  user: IUser | undefined;
  setUser?: React.Dispatch<React.SetStateAction<IUser | null>>;
  reviewObj: IReview;
};

const ReviewSheet: React.FC<ReviewSheetParams> = ({
  user,
  setUser,
  reviewObj,
}) => {
  const { toast } = useToast();

  const { createdBy, review, rating, comments, likes, dislikes, createdAt } =
    reviewObj;

  const {
    _id: creatorId,
    firstName,
    lastName,
    photo,
  } = createdBy as Partial<IUser>;

  const [displayList, setDisplayList] = useState<boolean>(false);
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [stateRating, setStateRating] = useState(parseInt(rating!));

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") setDisplayForm(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { review, rating },
  });

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    values.rating = stateRating.toString();

    try {
      const updatedUser = await updateReview({ ...values, _id: reviewObj._id });
      if (setUser) setUser(updatedUser);
      setDisplayForm(false);
    } catch (error) {
      handleError(error);
    }
  }

  const handleEditBtnClick = () => {
    setDisplayList(false);
    setDisplayForm((prev) => !prev);
  };

  const handleDeleteBtnClick = async () => {
    try {
      const updatedUser = await deleteReview(reviewObj._id);
      if (setUser) setUser(updatedUser);
    } catch (error) {
      handleError(error);
    }
  };

  const handleReport = async () => {
    try {
      await createReport({
        target: "Review",
        targetId: reviewObj._id,
        createdBy: user?._id ? user._id : null,
      });
      toast({
        variant: "destructive",
        title: "Report sent successfully. Thank you.",
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleLikes = async () => {
    try {
      await updateReviewLikes(reviewObj._id, user?._id!);
    } catch (error) {
      handleError(error);
    }
  };

  const handleDisLike = async () => {
    try {
      await updateReviewDislikes(reviewObj._id, user?._id!);
    } catch (error) {
      handleError(error);
    }
  };

  const UserInfo = () => (
    <>
      <Avatar className="rounded-full h-[100px] w-[100px]">
        <AvatarImage src={photo ?? "/assets/icons/user.svg"} />
      </Avatar>
      <p className="font-bold text-center text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] lg:text-[20px] lg:leading-[32px] xl:text-[22px] xl:leading-[36px">
        {firstName ? firstName + " " + lastName : "Customer"}
      </p>
    </>
  );

  const UserReviewForm = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full h-fit"
      >
        <FormField
          control={form.control}
          name="review"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Review</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="replay-input-style h-[150px]"
                  placeholder="Add a comment"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="rating"
          render={() => (
            <div>
              <FormLabel className="label-style">Rating</FormLabel>
              <RatingInput rating={stateRating} setRating={setStateRating} />
            </div>
          )}
        />
        <div className="w-full flex justify-end gap-5">
          <Button
            className="bg-transparent hover:bg-transparent text-black rounded-sm border-2 border-gray-300 active:text-xs w-20"
            type="button"
            onClick={() => setDisplayForm(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-gray-100 hover:bg-transparent text-black rounded-sm border-2 border-gray-300 active:text-base w-20"
            type="submit"
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );

  const UserReview = () => (
    <div className="flex flex-col gap-3 text-black">
      {rating && parseInt(rating) > 0 && (
        <div className="flex justify-center">
          <Rating rating={parseInt(rating)} />
        </div>
      )}
      <div>
        <Text
          text={review!}
          targetClass={2}
          textClass="max-h-[300px] overflow-auto border-2 p-2 rounded-md shadow-lg"
        />
      </div>
    </div>
  );

  const UserReviewCard = () => (
    <div className="relative w-full">
      {displayForm ? <UserReviewForm /> : <UserReview />}
      <div className="absolute top-0 right-0">
        <DotsBtn
          user={user}
          creatorId={creatorId!}
          displayList={displayList}
          deletionTarget="Review"
          setDisplayList={setDisplayList}
          handleEdit={handleEditBtnClick}
          handleDelete={handleDeleteBtnClick}
          handleReport={handleReport}
        />
      </div>
    </div>
  );

  const ReviewDetailsDiv = () => (
    <div className="flex gap-8 w-full">
      {user && user._id && (
        <LikesCard
          likes={likes.length}
          dislikes={dislikes.length}
          likesColor={likesColor}
          dislikesColor={dislikesColor}
          handleLikesClick={handleLikes}
          handleDislikesClick={handleDisLike}
        />
      )}
      <p className="text-gray-500 text-sm ml-auto">{postedSince(createdAt)}</p>
    </div>
  );

  const CommentDiv = () =>
    user && (
      <div className="w-full flex flex-col gap-3 text-black">
        <CommentForm user={user} reviewId={reviewObj._id} />
      </div>
    );

  const CommentsDiv = () =>
    comments.length > 0 && (
      <div className="flex flex-col gap-3 text-black">
        {comments.map((comment) => (
          <CommentCard
            key={comment._id}
            user={user}
            commentObj={comment}
            reviewObj={reviewObj}
          />
        ))}
      </div>
    );

  return (
    <Sheet>
      <SheetTrigger>
        <ReviewCard reviewObj={reviewObj} />
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[540px] overflow-auto flex flex-col gap-7">
        <SheetHeader className="flex flex-col mt-5 p-0">
          <SheetTitle className="flex flex-col items-center">
            <UserInfo />
            <UserReviewCard />
          </SheetTitle>
          <ReviewDetailsDiv />
        </SheetHeader>
        <CommentDiv />
        <CommentsDiv />
      </SheetContent>
    </Sheet>
  );
};

export default ReviewSheet;
