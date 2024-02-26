"use client";

import { useState, useEffect } from "react";
import { IUser } from "@/lib/database/models/user.model";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { handleError } from "@/lib/utils";
import ReviewsSwiper from "@/components/shared/swiper/ReviewsSwiper";
import Loading from "@/components/shared/helpers/Loading";
import Text from "@/components/shared/helpers/Text";
import CstReviewForm from "@/components/shared/forms/ReviewForm";
import UserDeleteBtn from "@/components/shared/btns/UserDeleteBtn";
import { deleteUserReview } from "@/lib/actions/review.actions";

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
        <Text text="At Mogi Kids, we are committed to providing the best child care experience for you and your little ones. We strive to create a safe, nurturing, and stimulating environment where children can learn and grow." />
        <Text text="We greatly value your opinion and would love to hear about your experience with Mogi Kids. Your feedback helps us understand what we're doing well and where we can improve to better serve you and your family." />
        <Text text="Would you take a moment to share your thoughts by writing a review? Whether it's a story about your child's progress, a positive experience with our staff, or suggestions for how we can enhance our services, your input is invaluable to us." />
        <Text text="To leave a review, simply click on the button below:" />
        <CstReviewForm user={user} review={null} />
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
