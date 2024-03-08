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
    _id,
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

  const QuoteHeader: React.FC = () => (
    <div className="flex justify-center">
      <h1 className="text-center font-bold text-lg">{cstName}</h1>
      <div className="absolute top-0 right-0">
        <IconDeleteBtn
          deletionTarget="Quotation"
          handleClick={() => handleDeleteQuote(quote._id)}
        />
      </div>
    </div>
  );

  const QuoteBody: React.FC = () => {
    return (
      <div className="border-t border-gray-200 mt-4 pt-4 grid grid-cols-2 gap-4">
        {[
          { label: "From Date:", value: format(from, "EEE, dd/MM/yyyy") },
          { label: "To Date:", value: format(to, "EEE, dd/MM/yyyy") },
          { label: "Kids:", value: numberOfKids },
          {
            label: "Age of Kids:",
            value: `${ageOfKidsFrom} to ${ageOfKidsTo}`,
          },
          { label: "Number of Hours:", value: numberOfHours },
          { label: "Extra Info:", value: extraInfo },
        ].map((item) => (
          <div key={`${_id} - ${item.label}`} className="flex items-center">
            <p className="text-sm flex-shrink-0">
              <strong className="mr-2">{item.label}</strong>
            </p>
            <p className="text-sm">{item.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const QuoteFooter: React.FC = () => {
    const defaultPhoto = "/assets/icons/user.svg";

    const getUserInfo = () => {
      if (!createdBy) {
        return {
          username: cstName,
          photo: defaultPhoto,
        };
      }

      const {
        _id,
        firstName,
        lastName,
        photo: userPhoto,
      } = createdBy as Partial<IUser>;
      return {
        username: getUsername(firstName, lastName),
        photo: userPhoto ?? defaultPhoto,
        creatorId: _id,
      };
    };

    const { username, photo, creatorId } = getUserInfo();

    return (
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
            <p className="text-sm">{username}</p>
            <p className="text-sm">{email}</p>
            <p className="text-sm">{mobile}</p>
          </div>
        </div>
        {creatorId && (
          <div className="mt-2">
            <BlockBtn
              blockText="Block This User"
              handleClick={() => handleBlockUser(creatorId)}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <TableRow>
      <TableCell colSpan={9} className="my-2 rounded-lg bg-white shadow-inner">
        <div className="p-4 relative">
          <QuoteHeader />
          <QuoteBody />
          <QuoteFooter />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default QuoteCard;
