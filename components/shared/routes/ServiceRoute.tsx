"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { IService } from "@/lib/database/models/service.model";
import { deleteService } from "@/lib/actions/service.actions";
import { handleError } from "@/lib/utils";
import Title from "@/components/shared/helpers/Title";
import Text from "@/components/shared/helpers/Text";
import DeleteBtn from "@/components/shared/btns/DeleteBtn";
import MiniServiceForm from "../forms/MiniServiceForm";

type ServiceRouteProps = {
  isAdmin: boolean;
  service: IService;
};

const ServiceRoute: React.FC<ServiceRouteProps> = ({ isAdmin, service }) => {
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const { success, error } = await deleteService(
        service._id,
        true,
        pathname
      );

      if (!success && error) throw new Error(error);

      toast({ description: "Service Deleted Successfully." });

      router.push("/services");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete Service, ${handleError(error)}`,
      });
    }
  };

  return (
    <section className="section-style">
      <Card className="flex flex-col md:flex-row justify-between items-center w-full border-none bg-transparent">
        <CardContent className="flex flex-col gap-3 md:w-[50%]">
          <Title text={service.serviceName} />
          <Text text={service.serviceContent} targetClass={2} />
        </CardContent>
        <CardContent className="md:w-[50%] h-full flex items-center justify-end">
          <img
            src={service.imgUrl}
            alt={service.serviceName}
            className="w-[300px] h-[300px] mt-[30px]"
          />
        </CardContent>
      </Card>
      <DeleteBtn
        pageId={service._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Service"
        handleClick={handleDelete}
      />
      {isAdmin && <MiniServiceForm service={service} />}
    </section>
  );
};
export default ServiceRoute;
