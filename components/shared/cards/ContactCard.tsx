"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IContact } from "@/lib/database/models/contact.model";
import { deleteContact } from "@/lib/actions/contact.actions";
import { handleError } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import UpdateContactForm from "../forms/UpdateContactForm";
import DeleteBtn from "../btns/DeleteBtn";

type ContactCardParams = {
  isAdmin: boolean | undefined;
  contact: IContact;
};

const ContactCard: React.FC<ContactCardParams> = ({ isAdmin, contact }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { success, error } = await deleteContact(contact._id, true);

      if (!success && error) throw new Error(error);

      toast({ description: "Contact Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Contact, ${handleError(error)}`,
      });
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
          <UpdateContactForm contact={contact} />
          <DeleteBtn
            pageId={contact._id}
            isAdmin={isAdmin}
            deletionTarget="Delete Contact"
            handleClick={handleDelete}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default ContactCard;
