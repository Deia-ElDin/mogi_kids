import { Button } from "@/components/ui/button";

type EditBtnProps = {
  centeredPosition: boolean;
  handleClick: () => void;
};

const EditBtn: React.FC<EditBtnProps> = ({ centeredPosition, handleClick }) => {
  return (
    <div
      className={`${
        !centeredPosition &&
        "absolute right-[-50px] sm:right-[-70px] top-[20px]"
      }`}
    >
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
