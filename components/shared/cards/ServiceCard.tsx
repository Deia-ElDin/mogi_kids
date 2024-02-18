import { IService } from "@/lib/database/models/service.model";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Text from "../helpers/Text";

type Props = {
  serviceObj: IService;
};

const ServiceCard: React.FC<Props> = (props) => {
  const { serviceObj } = props;

  return (
    <Card className="flex flex-col justify-center w-full cursor-pointer">
      <Image
        src={serviceObj.imgUrl}
        alt={serviceObj.service}
        width={300}
        height={300}
        className="rounded-t-lg w-full"
      />
      <p className="flex justify-center items-center text-center w-full h-[60px] font-bold text-lg bg-white rounded-b-lg">
        {serviceObj.service}
      </p>
      <Text
        textClass="hidden-text w-full overflow-auto"
        text={serviceObj.serviceContent}
      />
    </Card>
  );
};

export default ServiceCard;
