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

type BlockBtnProps = {
  blockText: string;
  handleClick: () => void;
};

const BlockBtn: React.FC<BlockBtnProps> = (props) => {
  const { blockText, handleClick } = props;

  return (
    <div className="w-full">
      <AlertDialog>
        <AlertDialogTrigger className="delete-btn w-full">
          {blockText ? (
            <p>{blockText}</p>
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
              This action will block this user and will delete all his/her{" "}
              <span className="text-red-500">
                Quotations, Applications, Reviews and Comments
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

export default BlockBtn;
