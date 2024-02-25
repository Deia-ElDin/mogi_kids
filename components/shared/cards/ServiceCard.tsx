import { Card, CardContent } from "@/components/ui/card";
import { IService } from "@/lib/database/models/service.model";

import Image from "next/image";
import Text from "../helpers/Text";

type ServiceCardProps = {
  serviceObj: IService;
  handleNavigate: () => void;
};

const ServiceCard: React.FC<ServiceCardProps> = (props) => {
  const { serviceObj, handleNavigate } = props;

  return (
    <Card className="service-card flex flex-col justify-center cursor-pointer h-[350px] border-none">
      <CardContent className="h-[350px] p-0" onClick={handleNavigate}>
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
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
