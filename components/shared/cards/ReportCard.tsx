"use client";

import { useState, useEffect } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { getUsername, handleError } from "@/lib/utils";
import { blockUser, unBlockUser } from "@/lib/actions/user.actions";
import { deleteReview, getReviewById } from "@/lib/actions/review.actions";
import { deleteComment, getCommentById } from "@/lib/actions/comment.actions";
import { IUser } from "@/lib/database/models/user.model";
import { IReview } from "@/lib/database/models/review.model";
import { IComment } from "@/lib/database/models/comment.model";
import UserDeleteBtn from "../btns/UserDeleteBtn";
import BlockBtn from "../btns/BlockBtn";
import UpdateBtn from "../btns/UpdateBtn";
import Image from "next/image";

type FetchState = {
  day?: Date | null;
  month?: Date | null;
};

type ReportCardParams = {
  target: string;
  targetId: string;
  fetchAllReports: (fetchBy: FetchState) => Promise<void>;
};

const ReportCard: React.FC<ReportCardParams> = ({
  target,
  targetId,
  fetchAllReports,
}) => {
  const [review, setReview] = useState<IReview | null>(null);
  const [comment, setComment] = useState<IComment | null>(null);
  const [originalUser, setOriginalUser] = useState<Partial<IUser> | null>(null);

  const { toast } = useToast();
  console.log("comment", comment);

  useEffect(() => {
    async function fetchData() {
      if (!target || !targetId) return;
      try {
        const { success, data, error } =
          target === "Review"
            ? await getReviewById(targetId)
            : await getCommentById(targetId);

        if (!success && error) throw new Error(error);

        if ((!review && !comment) || (!originalUser && target === "Comment")) {
          if (target === "Review" && data) {
            setReview(data as IReview);
            setOriginalUser(data.createdBy as Partial<IUser>);
          } else if (target === "Comment" && data) {
            setComment(data as IComment);
            setOriginalUser(data.createdBy as Partial<IUser>);
          }
        }
      } catch (error) {
        console.log(`Failed to fetch The Report. ${handleError(error)}`);
      }
    }

    fetchData();
  }, [target, targetId]);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { success, error } = await deleteReview(reviewId, "/");
      if (!success && error) throw new Error(error);
      toast({ description: "Review Deleted Successfully." });
      fetchAllReports({
        day: null,
        month: null,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Review, ${handleError(error)}`,
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { success, error } = await deleteComment({ commentId });
      if (!success && error) throw new Error(error);
      toast({ description: "Review Deleted Successfully." });
      fetchAllReports({
        day: null,
        month: null,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Review, ${handleError(error)}`,
      });
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const { success, error } = await blockUser(userId);
      if (!success && error) throw new Error(error);
      toast({ description: "User Blocked Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Block The User, ${handleError(error)}`,
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const { success, error } = await unBlockUser(userId);
      if (!success && error) throw new Error(error);
      toast({ description: "User UnBlocked Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to UnBlock The User, ${handleError(error)}`,
      });
    }
  };

  const UserHeader: React.FC = () => (
    <div className="flex justify-center">
      <h1 className="text-center font-bold text-lg">
        {originalUser
          ? getUsername(originalUser.firstName, originalUser.lastName)
          : "Unknown"}
      </h1>
    </div>
  );

  const ReviewBody: React.FC = () => {
    return review ? (
      <div className="flex flex-col items-center gap-4 w-full">
        <p className="text-center font-bold text-lg">Review</p>
        <p className="text-center font-semibold text-sm">ID: {review._id}</p>
        <p className="text-center w-[300px] p-3 border-2 border-gray-200 rounded-lg">
          {review.review}
        </p>
        <div className="w-[70%]">
          <UserDeleteBtn
            deletionTarget="Delete Review"
            handleClick={() => handleDeleteReview(review._id)}
          />
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-4 w-full">
        <p className="text-center font-bold text-lg">Review</p>
        <p className="text-center w-[300px] p-3 border-2 border-gray-200 rounded-lg">
          Review not found or already deleted.
        </p>
      </div>
    );
  };

  const CommentBody: React.FC = () => {
    return comment ? (
      <div className="flex flex-col items-center gap-4 w-full">
        <p className="text-center font-bold text-lg">Comment</p>
        <p className="text-center font-semibold text-sm">ID: {comment._id}</p>
        <p className="text-center w-[300px] p-3 border-2 border-gray-200 rounded-lg">
          {comment.comment}
        </p>
        <div className="w-[70%]">
          <UserDeleteBtn
            deletionTarget="Delete Comment"
            handleClick={() => handleDeleteComment(comment._id)}
          />
        </div>
      </div>
    ) : (
      <div className="flex flex-col w-full">
        <p className="text-center font-bold text-lg">Comment</p>
        <p className="text-center">Comment not found or already deleted.</p>
      </div>
    );
  };

  const UserBody: React.FC = () => {
    return (
      <div className="flex flex-col w-full">
        {review && <ReviewBody />}
        {comment && <CommentBody />}
      </div>
    );
  };

  const UserFooter: React.FC = () => {
    const defaultPhoto = "/assets/icons/user.svg";

    const getUserInfo = () => {
      if (!originalUser) {
        return {
          username: "Unknown",
          photo: defaultPhoto,
        };
      }

      const {
        _id,
        firstName,
        lastName,
        photo: userPhoto,
      } = originalUser as Partial<IUser>;
      return {
        username: getUsername(firstName, lastName),
        photo: userPhoto ?? defaultPhoto,
        creatorId: _id,
      };
    };

    const { username, photo, creatorId } = getUserInfo();

    return (
      <div className="flex justify-between items-center mt-8 border-none rounded-lg p-2 shadow-lg w-full bg-gray-50">
        <div className="flex items-center">
          <Image
            src={photo || "/assets/icons/user.svg"}
            alt="Client Image"
            height={40}
            width={40}
            className="rounded-full mr-4"
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm">{username}</p>
            {/* <p className="text-sm">{email}</p>
            {reports.length > 0 && (
              <p className="text-sm">{reports.length} Reports</p>
            )} */}
          </div>
        </div>
        {/* <p
          className={`text-md border-2  text-white py-1 px-3 rounded-2xl ${
            blocked ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {blocked ? "Blocked" : role}
        </p> */}
      </div>
    );
  };

  const UserActions: React.FC = () => {
    if (!originalUser || !originalUser._id) return null;

    return originalUser.blocked ? (
      <UpdateBtn
        updateTarget="Unblock This User"
        handleClick={() => handleUnblockUser(originalUser._id as string)}
      />
    ) : (
      <BlockBtn
        blockText="Block This User"
        handleClick={() => handleBlockUser(originalUser._id as string)}
      />
    );
  };

  return (
    <TableRow>
      <TableCell
        colSpan={7}
        className="my-2 rounded-lg bg-white shadow-inner w-full border-gray-200"
      >
        <div className="flex flex-col justify-center items-center gap-7 p-5">
          <UserHeader />
          <UserBody />
          <UserFooter />
          <UserActions />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ReportCard;
