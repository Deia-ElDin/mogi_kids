import { logoImg } from "@/constants";
import { ILogo } from "@/lib/database/models/logo.model";

interface CreateReviewToastProps {
  logo: ILogo | null;
}

export const CreateReviewToast: React.FC<CreateReviewToastProps> = ({
  logo,
}) => {
  return (
    <div>
      <img
        src={logo?.imgUrl || logoImg}
        alt="Logo"
        style={{ width: "180px", height: "100px" }}
      />
      Thank you for choosing MOGi KiDS for your child care needs. We appreciate
      your trust in us and look forward to hearing from you soon.
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
