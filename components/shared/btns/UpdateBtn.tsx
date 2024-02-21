import { Button } from "@/components/ui/button";

type UpdateBtnProps = {
  updateTarget: string;
  handleUpdate: () => void;
};

const UpdateBtn: React.FC<UpdateBtnProps> = (props) => {
  const { updateTarget, handleUpdate } = props;

  return (
    <div className="update-btn w-full text-center" onClick={handleUpdate}>
      <p>Update {updateTarget != "none" && updateTarget}</p>
    </div>
  );
};

export default UpdateBtn;
