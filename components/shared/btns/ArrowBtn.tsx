import Image from "next/image";
import { Button } from "@/components/ui/button";

type ArrowBtnProps = {
  btnClass: string;
  img: string;
};

const ArrowBtn: React.FC<ArrowBtnProps> = ({ btnClass, img }) => {
  const imgSrc =
    img === "Left arrow"
      ? "/assets/icons/left-arrow.svg"
      : "/assets/icons/right-arrow.svg";

  return (
    <Button
      className={`${btnClass} flex justify-center items-center h-8 w-8 p-1 border rounded-lg bg-white active:p-2 hover:bg-custom-yellow absolute ${
        img === "Left arrow" ? "left-[-40px]" : "right-[-40px]"
      } top-[50%]`}
    >
      <Image src={imgSrc} alt={img} height={25} width={25} />
    </Button>
  );
};

export default ArrowBtn;
