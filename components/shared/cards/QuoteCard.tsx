"use client";

import { usePathname } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { deleteQuote } from "@/lib/actions/quote.actions";
import { handleError } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { IQuote } from "@/lib/database/models/quote.model";
import Image from "next/image";
import DeleteBtn from "../btns/DeleteBtn";

type QuoteCardParams = {
  quote: IQuote;
};

const QuoteCard: React.FC<QuoteCardParams> = ({ quote }) => {
  const path = usePathname();

  const { toast } = useToast();

  // const handleDelete = async () => {
  //   try {
  //     const { success, error } = await deleteQuote(quote._id);

  //     if (!success && error) throw new Error(error);

  //     toast({ description: "Quotation Deleted Successfully." });
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: `Failed to Delete The Contact, ${handleError(error)}`,
  //     });
  //   }
  // };

  return (
    <Card className="flex flex-col bg-transparent border-none shadow-none w-full">
      <CardContent className="flex gap-5 items-center ">
        <p className="label-style">{quote.cstName}</p>
      </CardContent>
      {/* {isAdmin && (
        <CardFooter className="flex items-center gap-3 w-full">
          <DeleteBtn
            pageId={contact._id}
            isAdmin={isAdmin}
            deletionTarget="Delete Contact"
            handleClick={handleDelete}
          />
        </CardFooter>
      )} */}
    </Card>
  );
};

export default QuoteCard;
