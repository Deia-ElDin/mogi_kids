"use client";

import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { getAllAboutUs } from "@/lib/actions/aboutUs.actions";
import { IAboutUs } from "@/lib/database/models/aboutUs.model";
import { handleError } from "@/lib/utils";
import Loading from "@/components/shared/helpers/Loading";
import AboutUsCard from "@/components/shared/cards/AboutUsCard";
import AboutUsForm from "@/components/shared/forms/AboutUsForm";

const AboutUs = () => {
  const { user: clerkUser } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [allAboutUs, setAllAboutUs] = useState<IAboutUs[] | []>([]);
  const [render, setRender] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (clerkUser) {
          const user = await getUserByClerkId(clerkUser.id);
          setIsAdmin(user?.role === "Admin");
        }
      } catch (error) {
        handleError(error);
      }
    };

    const fetchAboutUs = async () => {
      try {
        const aboutUsArray = await getAllAboutUs();
        setAllAboutUs(aboutUsArray);
        setRender(aboutUsArray.length > 0 ? true : false);
      } catch (error) {
        handleError(error);
      }
    };

    if (clerkUser) fetchUser();
    fetchAboutUs();
    setLoading(false);
  }, [clerkUser?.id]);

  if (loading) return <Loading />;

  return (
    render && (
      <section className="section-style gap-20">
        {allAboutUs.map((aboutUsObj, index) => (
          <AboutUsCard
            key={`${aboutUsObj.title} - ${index}`}
            isAdmin={isAdmin}
            aboutUsObj={aboutUsObj}
            index={index}
          />
        ))}
        {/* {isAdmin && <AboutUsForm aboutUsArticle={null} />} */}
      </section>
    )
  );
};

export default AboutUs;
