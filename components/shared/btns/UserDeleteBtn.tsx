import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

type UserDeleteBtnProps = {
  deletionTarget: string;
  handleClick: () => void;
};

const UserDeleteBtn: React.FC<UserDeleteBtnProps> = (props) => {
  const { deletionTarget, handleClick } = props;

  return (
    <div className="w-full">
      <AlertDialog>
        <AlertDialogTrigger className="delete-btn w-full">
          {deletionTarget ? (
            <p>{deletionTarget}</p>
          ) : (
            <Image
              src="/assets/icons/x.svg"
              alt="Delete button"
              height={20}
              width={20}
            />
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <span className="text-red-500">
                {" "}
                {deletionTarget.split(" ").slice(1).join(" ")}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="delete-btn" onClick={handleClick}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserDeleteBtn;
