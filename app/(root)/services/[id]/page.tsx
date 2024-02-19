"use client";

import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { getServiceById, deleteService } from "@/lib/actions/service.actions";
import { Card, CardContent } from "@/components/ui/card";
import { IService } from "@/lib/database/models/service.model";
import { handleError } from "@/lib/utils";
import Title from "@/components/shared/helpers/Title";
import Text from "@/components/shared/helpers/Text";
import DeleteBtn from "@/components/shared/btns/DeleteBtn";

type ServicePageProps = {
  params: { id: string };
};

const ServicePage: React.FC<ServicePageProps> = ({ params: { id } }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [service, setService] = useState<IService>();

  const { user: clerkUser } = useUser();

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (clerkUser) {
          const user = await getUserByClerkId(clerkUser.id);
          setIsAdmin(user?.role === "Admin");
        }
      } catch (error) {
        handleError(error);
      }
    };

    const fetchService = async () => {
      try {
        const serviceObj = await getServiceById(id);

        setService(serviceObj as IService);
      } catch (error) {
        handleError(error);
      }
    };

    if (clerkUser) fetchUser();
    fetchService();
  }, [clerkUser?.id, id]);

  const handleDeleteService = async () => {
    try {
      await deleteService(id);
      router.back();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    service && (
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
        {isAdmin && (
          <DeleteBtn
            deletionTarget="Service"
            handleClick={() => handleDeleteService()}
          />
        )}
      </section>
    )
  );
};
export default ServicePage;
