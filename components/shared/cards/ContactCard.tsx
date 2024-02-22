import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IContact } from "@/lib/database/models/contact.model";
import Image from "next/image";
import UpdateBtn from "../btns/UpdateBtn";
import DeleteBtn from "../btns/DeleteBtn";

type ContactCardParams = {
  isAdmin: boolean | undefined;
  contact: IContact;
};

const ContactCard = ({ isAdmin, contact }: ContactCardParams) => {
  return (
    <Card className="flex flex-col bg-transparent border-none shadow-none w-full">
      <CardContent className="flex gap-5 items-center ">
        <Image
          src={contact.svgUrl}
          alt="Contact image"
          height={40}
          width={40}
        />
        <p className="text2-style">{contact.content}</p>
      </CardContent>
      {isAdmin && (
        <CardFooter className="flex items-center gap-3 w-full">
          <UpdateBtn updateTarget="Update Contact" handleClick={() => {}} />
          <DeleteBtn
            pageId={contact._id}
            isAdmin={isAdmin}
            deletionTarget="Delete Contact"
            handleClick={() => {}}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default ContactCard;
