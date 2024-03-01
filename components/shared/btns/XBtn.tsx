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
  deletionTarget: string;
  handleClick: () => void;
};

const XBtn: React.FC<XBtnProps> = (props) => {
  const { deletionTarget, handleClick } = props;

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image
          src="/assets/icons/x.svg"
          alt="Delete button"
          height={20}
          width={20}
          className="absolute top-[5px] right-[5px] cursor-pointer hover:h-[25px] hover:w-[25px]"
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
