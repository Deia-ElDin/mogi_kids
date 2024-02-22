import Image from "next/image";
import { Button } from "@/components/ui/button";

type CloseBtnProps = {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const CloseBtn: React.FC<CloseBtnProps> = ({ handleClick }) => {
  return (
    <Button
      className="bg-transparent hover:bg-transparent border-none absolute top-[5px] right-[-5px]"
      type="button"
      onClick={handleClick}
    >
      <Image
        src="/assets/icons/x.svg"
        alt="Close button"
        height={20}
        width={20}
      />
    </Button>
  );
};

export default CloseBtn;
