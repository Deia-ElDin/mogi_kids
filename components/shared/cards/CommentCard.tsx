import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commentSchema } from "@/lib/validators";
import { getUsername, postedSince } from "@/lib/utils";
import {
  updateComment,
  deleteComment,
  updateCommentLikes,
  updateCommentDislikes,
} from "@/lib/actions/comment.actions";
import { handleError } from "@/lib/utils";
import { IUser } from "@/lib/database/models/user.model";
import { IComment } from "@/lib/database/models/comment.model";
import { IReview } from "@/lib/database/models/review.model";
import { ReportToast } from "../toasts";
import DotsBtn from "../btns/DotsBtn";
import LikesCard from "./LikesCard";
import Image from "next/image";
import * as z from "zod";
import { createReport } from "@/lib/actions/report.actions";

type CommentCardProps = {
  user: IUser | null;
  reviewObj: IReview;
  commentObj: IComment;
};

const CommentCard = ({ user, reviewObj, commentObj }: CommentCardProps) => {
  const { toast } = useToast();

  const [displayList, setDisplayList] = useState<boolean>(false);
  const [displayForm, setDisplayForm] = useState<boolean>(false);

  const { createdBy, comment, createdAt, likes, dislikes } = commentObj;

  const {
    _id: creatorId,
    firstName,
    lastName,
    photo,
  } = createdBy as Partial<IUser>;

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
    creatorId &&
    likes.map((objectId) => objectId.toString()).includes(creatorId)
      ? "text-blue-500"
      : "text-gray-400";

  const dislikesColor =
    creatorId &&
    dislikes.map((objectId) => objectId.toString()).includes(creatorId)
      ? "text-red-500"
      : "text-gray-400";

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { comment },
  });

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    try {
      await updateComment({ ...values, _id: commentObj._id });
      setDisplayForm(false);
    } catch (error) {
      handleError(error);
    }
  }

  const handleReviewLikeClick = async () => {
    try {
      await updateCommentLikes(commentObj._id, user?._id!);
    } catch (error) {
      handleError(error);
    }
  };

  const handleReviewDisLikeClick = async () => {
    try {
      await updateCommentDislikes(commentObj._id, user?._id!);
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditComment = () => {
    setDisplayForm((prev) => !prev);
    setDisplayList((prev) => !prev);
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment(commentObj._id, reviewObj._id);
    } catch (error) {
      handleError(error);
    }
  };

  const handleReport = async () => {
    try {
      await createReport({
        target: "Comment",
        targetId: commentObj._id,
        createdBy: user?._id ? user._id : null,
      });
      toast({
        variant: "destructive",
        title: "Report sent successfully. Thank you.",
      });
      setDisplayList(false);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Card className="w-full h-fit border-none p-0 flex flex-col gap-1 ">
      <CardContent className="flex items-center gap-3 p-0 w-full">
        <Image
          src={photo ?? "/assets/icons/user.svg"}
          alt={`${firstName} image`}
          height={50}
          width={50}
          className="rounded-full"
        />
        <div className="flex items-center gap-5">
          <p className="font-bold tracking-wide">
            {getUsername(firstName, lastName)}
          </p>
          <p className="text-gray-500 text-sm">{postedSince(createdAt)}</p>
        </div>
        <div className="ml-auto">
          <DotsBtn
            user={user}
            creatorId={creatorId!}
            displayList={displayList}
            deletionTarget="Comment"
            setDisplayList={setDisplayList}
            handleEdit={handleEditComment}
            handleDelete={handleDeleteComment}
            handleReport={handleReport}
          />
        </div>
      </CardContent>

      {displayForm ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 w-full h-fit"
          >
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
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
      ) : (
        <CardContent>
          <p className="truncate">{comment}</p>
          {user && user._id && (
            <div className="my-3">
              <LikesCard
                likes={likes.length}
                dislikes={dislikes.length}
                likesColor={likesColor}
                dislikesColor={dislikesColor}
                handleLikesClick={handleReviewLikeClick}
                handleDislikesClick={handleReviewDisLikeClick}
              />
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default CommentCard;
