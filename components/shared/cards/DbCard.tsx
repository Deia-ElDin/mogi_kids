import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";


type DBCardParams = {
  link: string;
  src: string;
  alt: string;
  text: string;
  value: string;
  base: string;
};

const DBCard: React.FC<DBCardParams> = (props) => {
  const { link, src, alt, text, value, base } = props;

  return (
    <Card className="flex shrink p-2 bg-transparent border-2 border-white shadow-md cursor-pointer">
      <CardContent className="p-0">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[18px] flex gap-3"
        >
          <Image src={src} alt={alt} width={25} height={25} />
          <p className="font-bold text-[16px]">
            {text} {value} / {base}
          </p>
        </a>
      </CardContent>
    </Card>
  );
};

export default DBCard;
