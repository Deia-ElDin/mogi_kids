import { Card } from "@/components/ui/card";
import Image from "next/image";
import Text from "../helpers/Text";

type ServiceCardParams = {
  service: {
    title?: string;
    url?: string;
    paragraph?: string;
  };
};

const ServiceCard = ({ service }: ServiceCardParams) => {
  return (
    <Card className="flex flex-col justify-center w-full">
      <Image
        src={service.url ?? ""}
        alt={service.title ?? ""}
        width={300}
        height={300}
        className="rounded-t-lg w-full"
      />
      <p className="flex justify-center items-center text-center w-full h-[60px] font-bold text-lg bg-white rounded-b-lg">
        {service.title}
      </p>
      <Text
        textClass="hidden-text w-full"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
        explicabo maiores aliquid perferendis sit nam odit aliquam doloremque
        impedit aperiam. Totam fugit corrupti nam est dolore fugiat, commodi
        nemo porro nostrum facere alias ipsum dolorem quidem autem explicabo vel
        dicta sint earum rerum pariatur reprehenderit soluta. Aliquid illo
        explicabo nam officia suscipit amet reiciendis inventore aspernatur
        voluptatibus, sint fugit corporis itaque. Maiores, quibusdam repudiandae
        suscipit aliquid veniam aliquam, similique nesciunt laudantium, beatae
        molestias modi nisi recusandae voluptates accusantium explicabo!
        Quisquam autem voluptate delectus numquam tempore debitis, molestiae
        quis nemo dolores, tenetur, sapiente eveniet ipsum? Consequatur, eveniet
        et. Iure, alias fugiat?"
      />
    </Card>
  );
};

export default ServiceCard;
