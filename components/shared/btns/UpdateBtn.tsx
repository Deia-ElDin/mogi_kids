type UpdateBtnProps = {
  updateTarget: string;
  handleClick: () => void;
};

const UpdateBtn: React.FC<UpdateBtnProps> = (props) => {
  const { updateTarget, handleClick } = props;

  return (
    <div className="update-btn w-full text-center" onClick={handleClick}>
      <p>{updateTarget}</p>
    </div>
  );
};

export default UpdateBtn;
