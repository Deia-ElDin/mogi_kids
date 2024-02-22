"use client";

import { IPage } from "@/lib/database/models/page.model";
import { IContact } from "@/lib/database/models/contact.model";
import { deletePage } from "@/lib/actions/page.actions";
import { deleteAllContacts } from "@/lib/actions/contact.actions";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { handleError } from "@/lib/utils";
import Article from "./helpers/Article";
import ContactCard from "./cards/ContactCard";
import ContactForm from "./forms/ContactsForm";
import PageForm from "./forms/PageForm";
import DeleteBtn from "./btns/DeleteBtn";

type ContactsProps = {
  isAdmin: boolean | undefined;
  contactsPage: IPage | Partial<IPage> | undefined;
  contacts: IContact[] | [];
};

const Contacts = ({ isAdmin, contactsPage, contacts }: ContactsProps) => {
  const pageTitle = getPageTitle(
    contactsPage,
    isAdmin,
    "Contacts Section Title"
  );
  const pageContent = getPageContent(contactsPage, isAdmin);

  const handleDelete = async () => {
    try {
      if (contactsPage?._id) await deletePage(contactsPage._id, "/");
      if (contacts.length > 0) await deleteAllContacts();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <section id="contacts" className="section-style">
      <Article title={pageTitle} content={pageContent} />
      <div className="flex flex-col items-start gap-5">
        {contacts.map((contact) => (
          <ContactCard key={contact._id} isAdmin={isAdmin} contact={contact} />
        ))}
      </div>
      {isAdmin && <PageForm page={contactsPage} pageName="Contacts Page" />}
      {isAdmin && <ContactForm contact={null} />}
      <DeleteBtn
        pageId={contactsPage?._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Contacts Section"
        handleClick={() => handleDelete()}
      />
      <Separator pageId={contactsPage?._id} isAdmin={isAdmin} />
    </section>
  );
};

export default Contacts;

// Contact Information
// Get in touch with Sitters Company to take advantage of our wide range of child care services today!
