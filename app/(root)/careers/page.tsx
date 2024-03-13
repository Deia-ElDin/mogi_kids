import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getPageByPageName } from "@/lib/actions/page.actions";
import { getPageTitle, getPageContent, isAdminUser } from "@/lib/utils";
import Article from "@/components/shared/helpers/Article";
import PageForm from "@/components/shared/forms/PageForm";
import CareerForm from "@/components/shared/forms/CareerForm";

const Careers = async () => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;

  const userResult = await getUserByUserId(userId);
  const pageResult = await getPageByPageName("Careers Page");

  const user = userResult.success ? userResult.data || null : null;
  const page = pageResult.success ? pageResult.data || null : null;

  const isAdmin = isAdminUser(user);

  const pageTitle = getPageTitle(page, isAdmin, "Careers Page Title");
  const pageContent = getPageContent(page, isAdmin);

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      {isAdmin && <PageForm page={page} pageName="Careers Page" />}
      {page?._id && <CareerForm user={user} />}
    </section>
  );
};

export default Careers;
