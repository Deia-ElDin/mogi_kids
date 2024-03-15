"use client";

import { IPage } from "@/lib/database/models/page.model";
import { IContact } from "@/lib/database/models/contact.model";
import { deletePage } from "@/lib/actions/page.actions";
import { deleteAllContacts } from "@/lib/actions/contact.actions";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { handleError } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import Article from "./helpers/Article";
import ContactCard from "./cards/ContactCard";
import ContactForm from "./forms/ContactForm";
import PageForm from "./forms/PageForm";
import DeleteBtn from "./btns/DeleteBtn";

type ContactsProps = {
  isAdmin: boolean | undefined;
  contactsPage: IPage | Partial<IPage>;
  contacts: IContact[] | [];
};

const Contacts: React.FC<ContactsProps> = (props) => {
  const { toast } = useToast();

  const { isAdmin, contactsPage, contacts } = props;

  const pageTitle = getPageTitle(
    contactsPage,
    isAdmin,
    "Contacts Section Title"
  );

  const pageContent = getPageContent(contactsPage, isAdmin);

  const handleDelete = async () => {
    try {
      if (contactsPage?._id) {
        const { success, error } = await deletePage(contactsPage._id, "/");
        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }
      }
      if (contacts.length > 0) {
        const { success, error } = await deleteAllContacts();
        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }
      }
      toast({ description: "Contacts Page Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete Either The Contacts Page or the Contacts, ${handleError(
          error
        )}`,
      });
    }
  };

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      <div className="flex flex-col items-start gap-5">
        {contacts.map((contact) => (
          <ContactCard key={contact._id} isAdmin={isAdmin} contact={contact} />
        ))}
      </div>
      {isAdmin && <PageForm page={contactsPage} pageName="Contacts Page" />}
      {isAdmin && contactsPage?._id && <ContactForm />}
      <DeleteBtn
        pageId={contactsPage?._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Contacts Section"
        handleClick={handleDelete}
      />
    </section>
  );
};

export default Contacts;
