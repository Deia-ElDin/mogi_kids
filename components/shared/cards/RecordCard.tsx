import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

type RecordCardParams = {
  statistic: {
    icon: string;
    title: string;
    rating: string;
    color: string;
  };
};

const RecordCard = ({ statistic }: RecordCardParams) => {
  return (
    <Card
      className="flex flex-col min-w-[200px] h-[200px] justify-around items-center border rounded-lg p-3"
      style={{ backgroundColor: statistic.color }}
    >
      <CardContent>
        <Image
          src={statistic.icon}
          alt={statistic.title}
          height={50}
          width={70}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-3 w-full">
        <p className="text-yellow-800 text-2xl font-bold">{statistic.rating}</p>
        <p className="txt-lg font-bold">{statistic.title}</p>
      </CardFooter>
    </Card>
  );
};

export default RecordCard;
