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

type XBtnProps = {
  btnClass?: string;
  deletionTarget: string;
  handleClick: () => void;
};

const XBtn: React.FC<XBtnProps> = (props) => {
  const { btnClass, deletionTarget, handleClick } = props;

  return (
    <AlertDialog>
      <AlertDialogTrigger className={btnClass}>
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
            <span className="text-red-500"> {deletionTarget} </span>and remove
            it from your database.
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
  );
};

export default XBtn;
