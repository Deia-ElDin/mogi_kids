import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getAllAboutUs } from "@/lib/actions/aboutUs.actions";
import { IUser } from "@/lib/database/models/user.model";
import { IAboutUs } from "@/lib/database/models/about-us.model";
import AboutUsCard from "@/components/shared/cards/AboutUsCard";
import AboutUsForm from "@/components/shared/forms/AboutUsForm";

const AboutUs = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userResult = await getUserByUserId(userId);
  const user = userResult.success ? userResult.data || null : null;
  const allAboutUs: IAboutUs[] = await getAllAboutUs();

  const isAdmin = user?.role === "Admin";

  return (
    <section className="section-style gap-4">
      {allAboutUs.map((aboutUsObj, index) => (
        <AboutUsCard
          key={`${aboutUsObj.title} - ${index}`}
          isAdmin={isAdmin}
          aboutUsObj={aboutUsObj}
          index={index}
        />
      ))}
      {isAdmin && <AboutUsForm aboutUsArticle={null} />}
    </section>
  );
};

export default AboutUs;
