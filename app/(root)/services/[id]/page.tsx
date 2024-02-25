"use client";

import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { getServiceById, deleteService } from "@/lib/actions/service.actions";
import { Card, CardContent } from "@/components/ui/card";
import { IService } from "@/lib/database/models/service.model";
import { handleError } from "@/lib/utils";
import Title from "@/components/shared/helpers/Title";
import Text from "@/components/shared/helpers/Text";
import DeleteBtn from "@/components/shared/btns/DeleteBtn";
import Loading from "@/components/shared/helpers/Loading";
import MiniServiceForm from "@/components/shared/forms/MiniServiceForm";

type ServicePageProps = {
  params: { id: string };
};

const ServicePage: React.FC<ServicePageProps> = ({ params: { id } }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [service, setService] = useState<IService>();
  const [loading, setLoading] = useState(true);

  const { user: clerkUser } = useUser();

  const { toast } = useToast();

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
    setLoading(false);
  }, [clerkUser?.id, id]);

  const handleDelete = async () => {
    try {
      await deleteService(id);
      router.push("/services");
      toast({ description: "Service Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to Delete Service.",
      });
      handleError(error);
    }
  };

  if (loading) return <Loading />;

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
        <DeleteBtn
          pageId={id}
          isAdmin={isAdmin}
          deletionTarget="Delete Service"
          handleClick={handleDelete}
        />
        <MiniServiceForm service={service} setService={setService} />
      </section>
    )
  );
};
export default ServicePage;
