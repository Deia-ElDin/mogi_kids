"use client";

import { useState, useEffect } from "react";
import { IUser } from "@/lib/database/models/user.model";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { deleteUserReview } from "@/lib/actions/review.actions";
import { handleError } from "@/lib/utils";
import { userWelcomePageText } from "@/constants";
import ReviewsSwiper from "@/components/shared/swiper/ReviewsSwiper";
import Loading from "@/components/shared/helpers/Loading";
import Text from "@/components/shared/helpers/Text";
import ReviewForm from "@/components/shared/forms/ReviewForm";
import UserDeleteBtn from "@/components/shared/btns/UserDeleteBtn";

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

  const handleDeleteAllUserReviews = async (userId: string) => {
    await deleteUserReview(userId);
  };

  if (loading) return <Loading />;

  return (
    user && (
      <section className="section-style">
        <h1 className="title-style">
          Hi,
          {user?.firstName && (
            <span className="text-orange-500"> {user?.firstName} </span>
          )}
          Welcome to MOGiKiDS, We value your feedback! Share your experience
          with Mogi Kids.
        </h1>
        {userWelcomePageText.map((text) => (
          <Text key={text} text={text} />
        ))}
        <ReviewForm user={user} reviewObj={null} />
        <Text text="Thank you for choosing Mogi Kids for your child care needs. We appreciate your trust in us and look forward to hearing from you soon." />
        <ReviewsSwiper user={user} reviews={user?.reviews} />
        <UserDeleteBtn
          deletionTarget="Delete All Reviews"
          handleClick={() => handleDeleteAllUserReviews(user._id)}
        />
      </section>
    )
  );
};

export default UserPage;
