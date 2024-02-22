import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IRecord } from "@/lib/database/models/record.model";
import { deleteRecord } from "@/lib/actions/record.actions";
import { handleError } from "@/lib/utils";
import MiniRecordForm from "../forms/MiniRecordForm";
import DeleteBtn from "../btns/DeleteBtn";
import Image from "next/image";

type RecordCardParams = {
  isAdmin: boolean | undefined;
  record: IRecord;
};

const RecordCard = ({ isAdmin, record }: RecordCardParams) => {
  const handleDeleteContact = async () => {
    try {
      await deleteRecord(record._id);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex flex-col">
      <Card className="record-card flex flex-col gap-5 min-w-[200px] h-fit justify-around items-center border-none bg-orange-50 rounded-lg p-3 overflow-hidden">
        <CardContent className="flex justify-center p-0">
          <Image
            src={record?.imgUrl}
            alt={record?.label}
            height={70}
            width={70}
          />
        </CardContent>
        <CardFooter className="flex flex-col justify-center items-center gap-3 w-full h-fit p-3">
          <p className="text-yellow-800 text-2xl font-bold">{record?.value}</p>
          <p className="txt-lg font-bold">{record?.label}</p>
        </CardFooter>
      </Card>

      <div className="bg-orange-50 flex flex-col gap-2 border-none mt-5">
        {isAdmin && record._id && <MiniRecordForm record={record} />}
        <DeleteBtn
          pageId={record._id}
          isAdmin={isAdmin}
          deletionTarget="Delete Record"
          handleClick={handleDeleteContact}
        />
      </div>
    </div>
  );
};

export default RecordCard;
