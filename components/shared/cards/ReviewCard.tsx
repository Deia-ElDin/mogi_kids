import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/lib/database/models/user.model";
import { IReview } from "@/lib/database/models/review.model";
import Text from "../helpers/Text";
import Rating from "../helpers/Rating";

type ReviewCardParams = {
  reviewObj: IReview;
};

const ReviewCard: React.FC<ReviewCardParams> = ({ reviewObj }) => {
  const { createdBy, review, rating, createdAt } = reviewObj;
  const { firstName, lastName, photo } = createdBy as Partial<IUser>;

  return (
    <Card className="flex flex-col justify-between items-start w-full sm:w-[300px] h-[450px] p-3 rounded-lg cursor-pointer shadow-xl relative">
      <div className="flex flex-col gap-3 p-0">
        <Text
          text={review!}
          targetClass={2}
          textClass="max-h-[350px] overflow-auto"
        />
      </div>
      <div className="flex items-center gap-3 w-full p-0  border-t-2 border-gray-100 py-1 h-fit">
        <Avatar className="rounded-full h-[60px] w-[60px]">
          <AvatarImage src={photo ?? "/assets/icons/user.svg"} />
        </Avatar>
        <div className="h-[60px] pt-[8px]">
          <Text text={firstName ? firstName + " " + lastName : "Customer"} />
        </div>
      </div>
      <div className="flex justify-center absolute bottom-[5px] right-[5px]">
        {rating && parseInt(rating) > 0 && <Rating rating={parseInt(rating)} />}
      </div>
    </Card>
  );
};

export default ReviewCard;
