import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getAllAboutUs } from "@/lib/actions/aboutUs.actions";
import { isAdminUser } from "@/lib/utils";
import AboutUsCard from "@/components/shared/cards/AboutUsCard";
import CreateAboutUsForm from "@/components/shared/forms/CreateAboutUsForm";

const AboutUs = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userResult = await getUserByUserId(userId);
  const aboutUsResult = await getAllAboutUs();
  const user = userResult.success ? userResult.data || null : null;
  const aboutUs = aboutUsResult.success ? aboutUsResult.data || [] : [];

  const isAdmin = isAdminUser(user);

  return (
    <section className="section-style gap-4 relative">
      {aboutUs.map((aboutUsObj, index) => (
        <AboutUsCard
          key={`${aboutUsObj.title} - ${index}`}
          isAdmin={isAdmin}
          aboutUsObj={aboutUsObj}
          index={index}
        />
      ))}
      {isAdmin && <CreateAboutUsForm />}
    </section>
  );
};

export default AboutUs;
