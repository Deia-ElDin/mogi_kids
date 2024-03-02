import { useState, useEffect } from "react";
import { logoImg } from "@/constants";
import { ILogo } from "@/lib/database/models/logo.model";
import { getUsername } from "@/lib/utils";

type LogoProps = {
  logo: ILogo | null;
};

type LikesProps = {
  photo: string;
  firstName: string;
  lastName?: string;
};

type FaceProps = {
  face: string;
} & LikesProps;

export const CreateReviewToast: React.FC<LogoProps> = ({ logo }) => {
  return (
    <div>
      <img
        src={logo?.imgUrl || logoImg}
        alt="Logo"
        style={{ width: "100px", height: "auto" }}
      />
      Thank you for choosing MOGi KiDS for your child care needs. We appreciate
      your trust in us and look forward to hearing from you soon.
    </div>
  );
};

export const LikedToast: React.FC<LikesProps> = ({
  photo,
  firstName,
  lastName,
}) => {
  const [visibleHearts, setVisibleHearts] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleHearts((prev) => (prev < 3 ? prev + 1 : 0)); // Cycle through 0, 1, 2
    }, 300); // Adjust the interval duration as needed

    return () => clearInterval(interval);
  }, []);

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < visibleHearts; i++) {
      hearts.push(
        <img
          key={i}
          src="/assets/icons/heart.svg"
          alt="Heart icon"
          style={{ width: "30px", height: "30px" }}
        />
      );
    }
    return hearts;
  };

  return (
    <div className="flex items-center gap-5">
      <img
        src={photo}
        alt={`${firstName} photo`}
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
      <p className="font-bold">{getUsername(firstName, lastName)}</p>
      <div className="flex gap-1">{renderHearts()}</div>
    </div>
  );
};

export const DisLikedToast: React.FC<LikesProps> = ({
  photo,
  firstName,
  lastName,
}) => {
  const [visibleHearts, setVisibleHearts] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleHearts((prev) => !prev); // Toggle between true and false
    }, 500); // Adjust the interval duration as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-5">
      <img
        src={photo}
        alt={`${firstName} photo`}
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
      <p className="font-bold">{getUsername(firstName, lastName)}</p>
      {visibleHearts ? (
        <img
          src="/assets/icons/heart.svg"
          alt="Heart icon"
          style={{ width: "30px", height: "30px" }}
        />
      ) : (
        <img
          src="/assets/icons/broken-heart.svg"
          alt="Broken Heart icon"
          style={{ width: "30px", height: "30px" }}
        />
      )}
    </div>
  );
};

export const FaceToast: React.FC<FaceProps> = ({
  face,
  photo,
  firstName,
  lastName,
}) => {
  return (
    <div className="flex items-center gap-5">
      <img
        src={photo}
        alt={`${firstName} photo`}
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
      <p className="font-bold">{getUsername(firstName, lastName)}</p>
      <img
        src={
          face === "happy face"
            ? "/assets/icons/happy-face.svg"
            : "/assets/icons/sad-face.svg"
        }
        alt={face === "happy face" ? "Happy face" : "Sad face"}
        style={{ width: "30px", height: "30px" }}
      />
    </div>
  );
};

export const ReportToast = (logo: string) => {
  return (
    <div>
      <img
        src={logo ?? logoImg}
        alt="Logo"
        style={{ width: "180px", height: "100px" }}
      />
      Report sent successfully. Thank you.
    </div>
  );
};
