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

const AboutUsCard: React.FC<AboutUsCardParams> = ({ details, index }) => {
  return (
    <Card
      className={`flex flex-col ${
        index % 2 ? "md:flex-row" : "md:flex-row-reverse"
      } justify-between items-center w-full border-none bg-transparent`}
    >
      <CardContent
        className={`md:w-[50%] flex ${
          index % 2 ? "justify-start" : "justify-end"
        } `}
      >
        <img
          src={details.src}
          alt={details.title}
          className="w-[300px] h-[300px]"
        />
      </CardContent>
      <CardContent className="flex flex-col items-start gap-3 md:w-[50%]">
        <Title text={details.title} />
        <Text text={details.paragraph} targetClass={2} />
      </CardContent>
    </Card>
  );
};

export default AboutUsCard;
