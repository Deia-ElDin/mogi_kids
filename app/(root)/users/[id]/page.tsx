"use client";

import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IUser } from "@/lib/database/models/user.model";
import { IPage } from "@/lib/database/models/page.model";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { getPageByPageName } from "@/lib/actions/page.actions";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { handleError } from "@/lib/utils";
import Article from "@/components/shared/helpers/Article";
import ReviewsSwiper from "@/components/shared/swiper/reviewsSwiper";
import Loading from "@/components/shared/helpers/Loading";

type ServicePageProps = {
  params: { id: string };
};

const UserPage = ({ params: { id } }: ServicePageProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [cstWelcomingPage, setCstWelcomingPage] = useState<
    IPage | Partial<IPage> | undefined
  >();
  const [loading, setLoading] = useState<boolean>(true);

  const { user: clerkUser } = useUser();

  const router = useRouter();

  const pageTitle = getPageTitle(
    cstWelcomingPage,
    false,
    `Welcome ${user?.firstName} ${user?.lastName}`
  );
  const pageContent = getPageContent(cstWelcomingPage, false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (clerkUser) {
          const dbUser = await getUserByClerkId(clerkUser.id);
          setUser(dbUser);
        }
      } catch (error) {
        handleError(error);
      }
    };

    const fetchCstWelcomingPage = async () => {
      try {
        const page = await getPageByPageName(id);

        setCstWelcomingPage(page as IPage);
      } catch (error) {
        handleError(error);
      }
    };

    if (clerkUser) fetchUser();
    fetchCstWelcomingPage();
    setLoading(false);
  }, [clerkUser?.id]);

  if (loading) return <Loading />;

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      <ReviewsSwiper reviews={user?.reviews || []} />
    </section>
  );
};

export default UserPage;

/**
 * Welcome to MogiKids Child Care Website!
 *
 * At MogiKids, we're dedicated to providing a safe, nurturing, and enriching environment
 * for your children. Our team of passionate educators and caregivers are committed to
 * fostering the growth and development of each child, ensuring they thrive in every aspect
 * of their early years.
 *
 * Explore our website to discover our comprehensive range of child care programs, designed
 * to cater to the unique needs of children at different stages of their development. Whether
 * it's our interactive learning activities, stimulating play areas, or nutritious meals,
 * we strive to create an engaging and supportive atmosphere where every child can flourish.
 *
 * We understand that choosing the right child care provider is a significant decision for
 * your family, and we're honored that you're considering MogiKids. Feel free to reach out
 * to us with any questions or to schedule a tour of our facilities. We look forward to
 * welcoming you and your child to the MogiKids family!
 *
 * Best regards,
 * The MogiKids Team
 */
