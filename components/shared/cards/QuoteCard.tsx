"use client";

import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { getUsername } from "@/lib/utils";
import { IUser } from "@/lib/database/models/user.model";
import { IQuote } from "@/lib/database/models/quote.model";
import IconDeleteBtn from "../btns/IconDeleteBtn";
import BlockBtn from "../btns/BlockBtn";

type QuoteCardParams = {
  quote: IQuote;
  handleDeleteQuote: (id: string) => void;
  handleBlockUser: (id: string) => void;
};

const QuoteCard: React.FC<QuoteCardParams> = ({
  quote,
  handleDeleteQuote,
  handleBlockUser,
}) => {
  const {
    cstName,
    mobile,
    email,
    from,
    to,
    numberOfHours,
    numberOfKids,
    ageOfKidsFrom,
    ageOfKidsTo,
    extraInfo,
    createdBy,
  } = quote;

  const {
    _id: creatorId,
    firstName,
    lastName,
    photo,
  } = createdBy as Partial<IUser>;

  return (
    <TableRow>
      <TableCell colSpan={9} className="my-2 rounded-lg bg-white shadow-inner">
        <div className="p-4 relative">
          <div className="flex justify-center">
            <h1 className="text-center font-bold text-lg">{cstName}</h1>
            <div className="absolute top-0 right-0">
              <IconDeleteBtn
                deletionTarget="Quotation"
                handleClick={() => handleDeleteQuote(quote._id)}
              />
            </div>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <p className="text-sm flex-shrink-0">
                <strong className="mr-2">From Date:</strong>
              </p>
              <p className="text-sm">{format(from, "EEE, dd/MM/yyyy")}</p>
            </div>
            <div className="flex items-center">
              <p className="text-sm flex-shrink-0">
                <strong className="mr-2">To Date:</strong>
              </p>
              <p className="text-sm">{format(to, "EEE, dd/MM/yyyy")}</p>
            </div>
            <div className="flex items-center">
              <p className="text-sm flex-shrink-0">
                <strong className="mr-2">Kids:</strong>
              </p>
              <p className="text-sm">{numberOfKids}</p>
            </div>
            <div className="flex items-center">
              <p className="text-sm flex-shrink-0">
                <strong className="mr-2">Age of Kids:</strong>
              </p>
              <p className="text-sm">
                {ageOfKidsFrom} to {ageOfKidsTo}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm flex-shrink-0">
                <strong className="mr-2">Number of Hours:</strong>
              </p>
              <p className="text-sm">{numberOfHours}</p>
            </div>
            <div className="flex items-center">
              <p className="text-sm flex-shrink-0">
                <strong className="mr-2">Extra Info:</strong>
              </p>
              <p className="text-sm">{extraInfo}</p>
            </div>
          </div>

          {createdBy && (
            <>
              <div className="flex items-center mt-8 border-none rounded-lg p-2 shadow-lg">
                {photo && (
                  <img
                    src={photo}
                    alt="Customer Image"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                )}
                <div className="flex flex-col gap-1">
                  <p className="text-sm">{getUsername(firstName, lastName)}</p>
                  <p className="text-sm">{email}</p>
                  <p className="text-sm">{mobile}</p>
                </div>
              </div>
              <div className="mt-2">
                <BlockBtn
                  blockText="Block This User"
                  handleClick={() => handleBlockUser(creatorId!)}
                />
              </div>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default QuoteCard;
