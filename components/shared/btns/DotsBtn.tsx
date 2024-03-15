import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/lib/database/models/user.model";
import { Button } from "@/components/ui/button";
import { handleError, isAdminUser } from "@/lib/utils";
import { blockUser } from "@/lib/actions/user.actions";
import Image from "next/image";

type DotsBtnProps = {
  user: IUser | null;
  creatorId: string;
  displayList: boolean;
  deletionTarget: string;
  setDisplayList: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: () => void;
  handleDelete: () => void;
  handleReport: () => void;
};

const DotsBtn = (props: DotsBtnProps) => {
  const { toast } = useToast();

  const {
    user,
    creatorId,
    displayList,
    deletionTarget,
    setDisplayList,
    handleEdit,
    handleDelete,
    handleReport,
  } = props;

  const isAdmin = isAdminUser(user);

  const Trigger = () => (
    <Image
      src="/assets/icons/dots.svg"
      alt="Dots button"
      width={20}
      height={20}
    />
  );

  const EditBtn = () => (
    <Button
      className="w-full p-1 bg-transparent hover:bg-transparent text-black border-b-2 border-gray-300 rounded-none hover:bg-gray-100"
      onClick={handleEdit}
    >
      Edit
    </Button>
  );

  const DeleteBtn = () => (
    <AlertDialog>
      <AlertDialogTrigger className="w-full p-1 bg-transparent hover:bg-transparent text-black border-b-2 border-gray-300 text-sm h-[40px] hover:bg-gray-100">
        Delete
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
          <AlertDialogAction className="delete-btn" onClick={handleDelete}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const BlockBtn = () => (
    <AlertDialog>
      <AlertDialogTrigger className="w-full p-1 bg-transparent hover:bg-transparent text-black border-b-2 border-gray-300 text-sm h-[40px] hover:bg-gray-100">
        Block
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
          <AlertDialogAction
            className="delete-btn"
            onClick={async () => {
              try {
                const { success, error } = await blockUser(creatorId, "/");
                if (!success && error) throw new Error(error);
                toast({ description: "User Blocked Successfully." });
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Uh oh! Something went wrong.",
                  description: `Failed to Block The User, ${handleError(
                    error
                  )}`,
                });
              }
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const ReportBtn = () => (
    <Button
      className="w-full p-1 text-red-500 bg-white hover:text-white hover:bg-red-500 rounded-none"
      onClick={handleReport}
    >
      Report
    </Button>
  );

  const Btns = () =>
    displayList && (
      <PopoverContent className="w-[100px] p-0 flex flex-col items-center mr-[30px] border-2 border-gray-300">
        {user?._id === creatorId ? (
          <>
            <EditBtn />
            <DeleteBtn />
          </>
        ) : isAdmin ? (
          <>
            <DeleteBtn />
            <BlockBtn />
          </>
        ) : (
          <ReportBtn />
        )}
      </PopoverContent>
    );

  return (
    <Popover open={displayList} onOpenChange={setDisplayList}>
      <PopoverTrigger className="bg-gray-200 py-2 border-2 rounded-lg w-fit">
        <Trigger />
      </PopoverTrigger>
      <Btns />
    </Popover>
  );
};

export default DotsBtn;
