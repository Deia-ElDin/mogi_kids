import { Button } from "@/components/ui/button";
import Image from "next/image";

type SorBtnProps = {
  sort: string | undefined;
};

const SorBtn: React.FC<SorBtnProps> = ({ sort }) => {
  return (
    <Button className="bg-transparent b-0 hover:bg-transparent p-0 flex flex-col gap-1">
      <Image
        src="/assets/icons/arrow-up.svg"
        alt="Sort ascending button"
        width={15}
        height={15}
        className={sort === "ascending" ? "bg-white" : ""}
      />
      <Image
        src="/assets/icons/arrow-down.svg"
        alt="Sort descending button"
        width={15}
        height={15}
        className={sort === "descending" ? "bg-white" : ""}
      />
    </Button>
  );
};

export default SorBtn;
