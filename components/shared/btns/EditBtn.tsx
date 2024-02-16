import Image from "next/image";
import { Button } from "@/components/ui/button";

type EditBtnProps = {
  isAdmin: boolean;
  handleClick: () => void;
};

const EditBtn = ({ isAdmin, handleClick }: EditBtnProps) => {

  if (!isAdmin) return;

  return (
    <div className="absolute right-[-100px] top-[20px]">
      <Button
        className="edit-btn-style bg-transparent hover:bg-transparent p-0"
        onClick={handleClick}
      >
        <div className="edit-btn-divs edit-btn-div-one"></div>
        <div className="edit-btn-divs edit-btn-div-two"></div>
        <div className="edit-btn-divs edit-btn-div-three"></div>
      </Button>
    </div>
  );
};

export default EditBtn;
