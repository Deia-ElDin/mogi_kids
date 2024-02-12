import { Button } from "@/components/ui/button";
import Image from "next/image";

type DisplayBtnProps = {
  btnClass?: string;
  fn: string;
  handleClick: () => void;
};

const DisplayBtn = ({ btnClass, fn, handleClick }: DisplayBtnProps) => {
  const imgSrc =
    fn === "Show element" ? "/assets/icons/add.svg" : "/assets/icons/minus.svg";

  return (
    <Button
      className={`${btnClass} flex justify-center items-center h-8 w-8 p-1 border rounded-full bg-white active:p-2 hover:bg-yellow-400
      `}
      onClick={handleClick}
    >
      <Image src={imgSrc} alt={fn} height={25} width={25} />
    </Button>
  );
};

export default DisplayBtn;
