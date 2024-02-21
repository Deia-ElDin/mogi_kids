import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IRecord } from "@/lib/database/models/record.model";
import UpdateBtn from "../btns/UpdateBtn";
import DeleteBtn from "../btns/DeleteBtn";
import Image from "next/image";

type RecordCardParams = {
  isAdmin: boolean | undefined;
  record: IRecord;
};

const RecordCard = ({ isAdmin, record }: RecordCardParams) => {
  return (
    <div className="flex flex-col">
      <Card
        className="flex flex-col min-w-[200px] h-[200px] justify-around items-center border-none bg-orange-50 rounded-lg p-3 overflow-hidden"
        style={{ backgroundColor: record?.backgroundColor }}
      >
        <CardContent>
          <Image
            src={record?.svgUrl}
            alt={record?.label}
            height={50}
            width={70}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-3 w-full">
          <p className="text-yellow-800 text-2xl font-bold">{record?.value}</p>
          <p className="txt-lg font-bold">{record?.label}</p>
        </CardFooter>
      </Card>

      <div className="bg-orange-50 flex flex-col gap-2 border-none mt-3">
        {isAdmin && record._id && (
          <UpdateBtn updateTarget="Update Record" handleClick={() => {}} />
        )}
        <DeleteBtn
          pageId={record._id}
          isAdmin={isAdmin}
          deletionTarget="Delete Record"
          handleClick={() => {}}
        />
      </div>
    </div>
  );
};

export default RecordCard;
