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

type DeleteBtnProps = {
  pageId: string | undefined;
  isAdmin: boolean | undefined;
  deletionTarget: string;
  handleClick: () => void;
};

const DeleteBtn: React.FC<DeleteBtnProps> = (props) => {
  const { pageId, isAdmin, deletionTarget, handleClick } = props;

  if (!pageId || !isAdmin) return null;

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
              This action cannot be undone. This will permanently delete this{" "}
              {deletionTarget.split(" ").pop()} and remove it from your
              database.
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

export default DeleteBtn;
