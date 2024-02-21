import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IReview } from "@/lib/database/models/review.model";
import Text from "../helpers/Text";

type CstReviewCardParams = {
  reviewObj: IReview;
  handleNavigate: () => void;
};

const CstReviewCard = ({ reviewObj, handleNavigate }: CstReviewCardParams) => {
  const { user, review, rating } = reviewObj;
  const { firstName, lastName, photo } = user;

  return (
    <Card className="flex flex-col justify-between items-start h-[420px] px-1 py-3 rounded-lg">
      <CardContent>
        <Text
          text={review ?? "Customer"}
          textClass="max-h-[280px] overflow-auto"
        />
      </CardContent>
      <CardFooter className="flex items-center gap-3 w-full">
        <Avatar className="rounded-full h-[70px] w-[70px]">
          <AvatarImage src={photo ?? ""} />
        </Avatar>
        <Text text={firstName ? firstName + " " + lastName : "Customer"} />
      </CardFooter>
    </Card>
  );
};

export default CstReviewCard;
