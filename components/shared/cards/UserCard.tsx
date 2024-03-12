"use client";

import { Dispatch, SetStateAction } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getUsername, handleError } from "@/lib/utils";
import { IUser } from "@/lib/database/models/user.model";
import { deleteReview } from "@/lib/actions/review.actions";
import {
  getUserByUserId,
  blockUser,
  unBlockUser,
} from "@/lib/actions/user.actions";
import DeleteBtn from "../btns/DeleteBtn";
import BlockBtn from "../btns/BlockBtn";
import UpdateBtn from "../btns/UpdateBtn";
import Image from "next/image";
import Rating from "../helpers/Rating";

type UserCardParams = {
  user: IUser;
  setUsers: Dispatch<SetStateAction<[] | IUser[]>>;
};

const UserCard: React.FC<UserCardParams> = ({ user, setUsers }) => {
  const { _id, photo, firstName, lastName, email, reviews, role, blocked } =
    user;

  console.log("UserCard -> user", user);

  const { toast } = useToast();

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { success, error } = await deleteReview(reviewId, "/");

      if (!success && error) throw new Error(error);
      const {
        success: userSuccess,
        data: updatedUser,
        error: userError,
      } = await getUserByUserId(_id);

      if (!userSuccess && userError) throw new Error(userError);

      if (updatedUser) {
        setUsers((prev) =>
          prev.map((user) => (user._id === _id ? updatedUser : user))
        );
      } else throw new Error("Failed to Update User's Reviews");
      toast({ description: "Review Deleted Successfully." });
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
      const { success, data, error } = await blockUser(userId);
      if (!success && error) throw new Error(error);

      if (data) {
        setUsers((prev) =>
          prev.map((user) => (user._id === _id ? data : user))
        );
      } else throw new Error("Failed to Update User's Reviews");
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
      const { success, data, error } = await unBlockUser(userId);
      if (!success && error) throw new Error(error);

      if (data) {
        setUsers((prev) =>
          prev.map((user) => (user._id === _id ? data : user))
        );
      } else throw new Error("Failed to Update User's Reviews");
      toast({ description: "User Blocked Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Block The User, ${handleError(error)}`,
      });
    }
  };

  const UserHeader: React.FC = () => (
    <div className="flex justify-center">
      <h1 className="text-center font-bold text-lg">
        {getUsername(firstName, lastName)}
      </h1>
    </div>
  );

  const UserBody: React.FC = () => {
    if (reviews.length === 0 || !reviews) return;
    return (
      <Carousel className="max-w-[400px] border-2 rounded-lg border-gray-100 p-5  shadow-lg">
        <CarouselContent>
          {reviews.map((reviewObj, index) => {
            const { _id: reviewId, review, rating } = reviewObj;

            return (
              <CarouselItem
                key={reviewId}
                className="flex flex-col items-center gap-7"
              >
                {rating && parseInt(rating) > 0 && (
                  <Rating rating={parseInt(rating)} />
                )}

                <div className="flex flex-col items-start w-full">
                  <strong>Review:</strong>
                  <p>{review || "No Review"}</p>
                </div>

                <div className="mt-auto flex flex-col justify-center items-center w-full">
                  <p className="border-2 rounded-lg p-1 m-x-auto h-fit w-[30px] flex justify-center items-center">
                    {index + 1}
                  </p>
                  <Separator pageId="true" isAdmin={true} />
                  <div className="mt-1 w-full">
                    <DeleteBtn
                      pageId="true"
                      isAdmin={true}
                      deletionTarget="Delete Review"
                      handleClick={() => handleDeleteReview(reviewId)}
                    />
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  };

  const UserFooter: React.FC = () => {
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
            <p className="text-sm">{getUsername(firstName, lastName)}</p>
            <p className="text-sm">{email}</p>
            {reviews.length > 0 && (
              <p className="text-sm">{reviews.length} Reviews</p>
            )}
          </div>
        </div>
        <p
          className={`text-md border-2  text-white py-1 px-3 rounded-2xl ${
            blocked ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {blocked ? "Blocked" : role}
        </p>
      </div>
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
          {blocked ? (
            <UpdateBtn
              updateTarget="Unblock This User"
              handleClick={() => handleUnblockUser(_id)}
            />
          ) : (
            <BlockBtn
              blockText="Block This User"
              handleClick={() => handleBlockUser(_id)}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserCard;
