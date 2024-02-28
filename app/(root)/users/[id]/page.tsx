"use client";

import { useState, useEffect } from "react";
import { IUser } from "@/lib/database/models/user.model";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { handleError } from "@/lib/utils";
import { userWelcomePageText } from "@/constants";
import ReviewsSwiper from "@/components/shared/swiper/ReviewsSwiper";
import Loading from "@/components/shared/helpers/Loading";
import Text from "@/components/shared/helpers/Text";
import ReviewForm from "@/components/shared/forms/ReviewForm";

type ServicePageProps = {
  params: { id: string };
};

const UserPage = ({ params: { id } }: ServicePageProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const dbUser = await getUserByUserId(id);
        setUser(dbUser);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Loading />;

  const WelcomeText = () =>
    userWelcomePageText.map((text) => <Text key={text} text={text} />);

  return (
    user && (
      <section className="section-style">
        <h1 className="title-style">
          Hi,
          {user?.firstName && (
            <span className="text-orange-500"> {user?.firstName} </span>
          )}
          Welcome to MOGi KiDS, We value your feedback! Share your experience
          with MOGi KiDS.
        </h1>
        <WelcomeText />
        <ReviewForm user={user} setUser={setUser} />
        <ReviewsSwiper user={user} setUser={setUser} reviews={user?.reviews} />
      </section>
    )
  );
};

export default UserPage;
