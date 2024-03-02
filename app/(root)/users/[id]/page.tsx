import { getUserByUserId } from "@/lib/actions/user.actions";
import { getLogo } from "@/lib/actions/logo.actions";
import { userWelcomePageText } from "@/constants";
import ReviewsSwiper from "@/components/shared/swiper/ReviewsSwiper";
import Text from "@/components/shared/helpers/Text";
import ReviewForm from "@/components/shared/forms/ReviewForm";

type ServicePageProps = {
  params: { id: string };
};

const UserPage = async ({ params: { id } }: ServicePageProps) => {
  const userResult = await getUserByUserId(id);
  const logoResult = await getLogo();

  const user = userResult.success ? userResult.data || null : null;
  const logo = logoResult.success ? logoResult.data || null : null;

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
        <ReviewForm user={user} logo={logo} />
        <ReviewsSwiper user={user} reviews={user?.reviews} />
      </section>
    )
  );
};

export default UserPage;
