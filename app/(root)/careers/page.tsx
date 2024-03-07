import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getPageByPageName } from "@/lib/actions/page.actions";
import { getPageTitle, getPageContent } from "@/lib/utils";
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

  const isAdmin = user?.role === "Admin";

  const pageTitle = getPageTitle(page, isAdmin, "Careers Page Title");
  const pageContent = getPageContent(page, isAdmin);

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      {isAdmin && <PageForm page={page} pageName="Careers Page" />}
      {page?._id && <CareerForm />}
    </section>
  );
};

export default Careers;

// Join Us For A Great Career In Child Care
// Are you looking for a rewarding and exciting career in child care? Sitters Child Care Services is a team of the best in home child care providers, caregivers, and newborn care providers in UAE. We also have a great administrative team that supports our providers in our mission to deliver the highest quality child care in the UAE.

// Working with us will mean that you deliver the highest quality care and take pride in yourself and the team around you. We can provide you a challenging and rewarding career with lots of opportunities for career growth.

// We are the best-rated child care provider in UAE. Check us out for yourself and fill in the form below. If we find you are a suitable candidate, we will get back to you.
