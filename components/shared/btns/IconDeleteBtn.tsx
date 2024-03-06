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

type IconDeleteBtnProps = {
  deletionTarget: string;
  handleClick: () => void;
};

const IconDeleteBtn: React.FC<IconDeleteBtnProps> = (props) => {
  const { deletionTarget, handleClick } = props;

  return (
    <div className="w-[20px]">
      <AlertDialog>
        <AlertDialogTrigger className="w-[20px]">
          <Image
            src="/assets/icons/x.svg"
            alt="Delete button"
            height={20}
            width={20}
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              <span className="text-red-500"> {deletionTarget}</span>.
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

export default IconDeleteBtn;
