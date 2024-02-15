import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Text from "../helpers/Text";

type CstCardParams = {
  cst: {
    cstName?: string;
    cstOpinion?: string;
    cstImg?: string;
  };
};

const CstCard = ({ cst }: CstCardParams) => {
  return (
    <Card className="flex flex-col justify-between items-start h-[420px] px-1 py-3 rounded-lg">
      <CardContent>
        <Text
          text={cst.cstOpinion ?? "Customer"}
          textClass="max-h-[280px] overflow-auto"
        />
      </CardContent>
      <CardFooter className="flex items-center gap-3 w-full">
        <Avatar className="rounded-full h-[70px] w-[70px]">
          <AvatarImage src={cst.cstImg ?? ""} />
        </Avatar>
        <Text text={cst.cstName ?? "Customer"} />
      </CardFooter>
    </Card>
  );
};

export default CstCard;
