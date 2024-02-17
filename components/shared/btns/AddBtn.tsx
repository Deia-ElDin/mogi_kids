type EditBtnProps = {
  isAdmin: boolean;
  handleClick: () => void;
};

const AddBtn = ({ isAdmin, handleClick }: EditBtnProps) => {
  if (!isAdmin) return;

  return <div className="add-btn" onClick={handleClick}></div>;
};

export default AddBtn;
