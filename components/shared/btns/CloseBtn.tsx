import Image from "next/image";
import { Button } from "@/components/ui/button";

const CloseBtn = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <Button className="bg-transparent hover:bg-transparent border-none absolute top-[5px] right-[-5px]">
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
