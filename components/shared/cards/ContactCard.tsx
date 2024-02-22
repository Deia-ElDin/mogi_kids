import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IContact } from "@/lib/database/models/contact.model";
import { deleteContact } from "@/lib/actions/contact.actions";
import { handleError } from "@/lib/utils";
import Image from "next/image";
import UpdateBtn from "../btns/UpdateBtn";
import DeleteBtn from "../btns/DeleteBtn";

type ContactCardParams = {
  isAdmin: boolean | undefined;
  contact: IContact;
};

const ContactCard = ({ isAdmin, contact }: ContactCardParams) => {
  const handleDeleteContact = async () => {
    try {
      await deleteContact(contact._id);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Card className="flex flex-col bg-transparent border-none shadow-none w-full">
      <CardContent className="flex gap-5 items-center ">
        <Image
          src={contact.imgUrl}
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
            handleClick={handleDeleteContact}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default ContactCard;
