import { useState } from "react";
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
import Text from "../helpers/Text";
import Rating from "../helpers/Rating";
import CommentForm from "../forms/CommentForm";

type ReviewCardParams = {
  user: IUser | undefined;
  reviewObj: {
    user: {
      _id: string | undefined;
      firstName: string | undefined;
      lastName: string | undefined;
      photo: string | undefined;
    };
    review: string | undefined;
    rating: string | undefined;
  };
};

const ReviewCard: React.FC<ReviewCardParams> = ({ user, reviewObj }) => {
  const [userReplay, setUserReplay] = useState("");
  const { user: reviewUser, review, rating } = reviewObj;
  const { firstName, lastName, photo } = reviewUser;

  return (
    <Sheet>
      <SheetTrigger>
        <Card className="flex flex-col gap-3 justify-between items-start w-[300px] h-[450px] p-3 rounded-lg cursor-pointer shadow-xl">
          <CardContent className="flex flex-col gap-3 p-0">
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
          </CardContent>
          <CardFooter className="flex items-center gap-3 w-full p-0">
            <Avatar className="rounded-full h-[60px] w-[60px]">
              <AvatarImage src={photo ?? "/assets/icons/user.svg"} />
            </Avatar>
            <div className="h-[60px] pt-3">
              <Text
                text={firstName ? firstName + " " + lastName : "Customer"}
              />
            </div>
          </CardFooter>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-auto flex flex-col gap-8">
        <SheetHeader className="flex flex-col mt-5 p-0">
          <SheetTitle className="flex flex-col items-center">
            <Avatar className="rounded-full h-[100px] w-[100px]">
              <AvatarImage src={photo ?? "/assets/icons/user.svg"} />
            </Avatar>
            <p className="font-bold text-center text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] lg:text-[20px] lg:leading-[32px] xl:text-[22px] xl:leading-[36px">
              {firstName ? firstName + " " + lastName : "Customer"}
            </p>
          </SheetTitle>
          <SheetDescription className="flex flex-col gap-3 text-black">
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
          </SheetDescription>
        </SheetHeader>
        <SheetDescription className="flex flex-col gap-3 text-black">
          <CommentForm user={user} comment={null} />
        </SheetDescription>
        {/* <SheetFooter>
          <SheetClose>
            <Avatar className="rounded-full h-[70px] w-[70px]">
              <AvatarImage src={photo ?? "/assets/icons/user.svg"} />
            </Avatar>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
};

export default ReviewCard;
