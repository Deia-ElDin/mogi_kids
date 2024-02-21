import { IService } from "@/lib/database/models/service.model";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Text from "../helpers/Text";

type Props = {
  serviceObj: IService;
  handleNavigate: () => void;
};

const ServiceCard: React.FC<Props> = (props) => {
  const { serviceObj, handleNavigate } = props;

  return (
    <Card
      className="service-card flex flex-col justify-center w-full cursor-pointer h-[350px]"
      onClick={handleNavigate}
    >
      <Image
        src={serviceObj.imgUrl}
        alt={serviceObj.serviceName}
        width={300}
        height={300}
        className="rounded-t-lg w-full max-w-[300px] max-h-[300px] object-cover"
      />
      <p className="flex justify-center items-center text-center w-full h-[60px] font-bold text-lg bg-white rounded-b-lg">
        {serviceObj.serviceName}
      </p>
      <div className="service-card-body">
        <Text
          textClass="service-card-content w-full overflow-auto"
          text={serviceObj.serviceContent}
        />
      </div>
    </Card>
  );
};

export default ServiceCard;
