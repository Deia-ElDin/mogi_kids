import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getPageByPageName } from "@/lib/actions/page.actions";
import { getAllContacts } from "@/lib/actions/contact.actions";
import { getPageTitle, getPageContent, isAdminUser } from "@/lib/utils";
import Article from "@/components/shared/helpers/Article";
import ContactCard from "@/components/shared/cards/ContactCard";

const Contacts: React.FC = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userResult = await getUserByUserId(userId);
  const pageResult = await getPageByPageName("Contacts Page");
  const contactsResult = await getAllContacts();

  const user = userResult.success ? userResult.data || null : null;
  const page = pageResult.success ? pageResult.data || null : null;
  const contacts = contactsResult.success ? contactsResult.data || [] : [];

  const isAdmin = isAdminUser(user);

  const pageTitle = getPageTitle(page, isAdmin, "Contacts Page Title");
  const pageContent = getPageContent(page, isAdmin);

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      <div className="flex flex-col items-start gap-5">
        {contacts.map((contact) => (
          <ContactCard key={contact._id} isAdmin={isAdmin} contact={contact} />
        ))}
      </div>
    </section>
  );
};

export default Contacts;
