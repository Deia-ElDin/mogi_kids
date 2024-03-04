import { IUser } from "@/lib/database/models/user.model";
import { ILogo } from "@/lib/database/models/logo.model";
import { userWelcomePageText } from "@/constants";
import Text from "../helpers/Text";
import ReviewForm from "../forms/ReviewForm";
import ReviewsSwiper from "../swiper/ReviewsSwiper";

type UserRouteType = {
  user: IUser;
  logo: ILogo | null;
};

const UserRoute: React.FC<UserRouteType> = ({ user, logo }) => {
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
        <ReviewsSwiper user={user} reviews={user.reviews} />
      </section>
    )
  );
};

export default UserRoute;
