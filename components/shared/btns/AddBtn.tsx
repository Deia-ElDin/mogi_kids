import Image from "next/image";

type AddBtnProps = {
  handleClick: () => void;
};

const AddBtn: React.FC<AddBtnProps> = ({ handleClick }) => {
  return (
    <div className="add-btn flex justify-center" onClick={handleClick}>
      <Image
        src="/assets/icons/add.svg"
        alt="Add button"
        width={30}
        height={30}
      />
    </div>
  );
};

export default AddBtn;
