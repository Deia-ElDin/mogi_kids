import Image from "next/image";
import { Button } from "@/components/ui/button";

type ArrowBtnProps = {
  img: string;
  handleClick: () => void;
};

const ArrowBtn = ({ img, handleClick }: ArrowBtnProps) => {
  return (
    <Button className="icon-btn hover:bg-red-500 hidden" onClick={handleClick}>
      <Image
        src={
          img === "Left arrow"
            ? "/assets/icons/left-arrow.svg"
            : "/assets/icons/right-arrow.svg"
        }
        alt={img}
        height={50}
        width={50}
      />
    </Button>
  );
};

export default ArrowBtn;
