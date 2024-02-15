import { Card, CardContent } from "@/components/ui/card";
import Text from "../helpers/Text";
import Title from "../helpers/Title";

type AboutUsCardParams = {
  details: {
    src: string;
    title: string;
    paragraph: string;
  };
  index: number;
};

const AboutUsCard = ({ details, index }: AboutUsCardParams) => {
  return (
    <Card
      className={`flex ${
        index % 2 ? "flex-row" : "flex-row-reverse"
      } justify-between items-center w-full border-none bg-transparent`}
    >
      <CardContent className="w-[50%]">
        <img
          src={details.src}
          alt={details.title}
          className="w-[300px] h-[300px]"
        />
      </CardContent>
      <CardContent className="flex flex-col items-start gap-3 w-[50%]">
        <Title text={details.title} />
        <Text text={details.paragraph} targetClass={2} />
      </CardContent>
    </Card>
  );
};

export default AboutUsCard;
