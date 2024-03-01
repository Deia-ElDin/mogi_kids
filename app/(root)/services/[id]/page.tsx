import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getServiceById } from "@/lib/actions/service.actions";
import { IUser } from "@/lib/database/models/user.model";
import ServiceRoute from "@/components/shared/routes/ServiceRoute";

type ServicePageProps = {
  params: { id: string };
};

const ServicePage: React.FC<ServicePageProps> = async ({ params: { id } }) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const user: IUser = await getUserByUserId(userId);
  const isAdmin = user?.role === "Admin";

  const servicesResult = await getServiceById(id);
  const service = servicesResult.success ? servicesResult.data || null : null;

  // 404
  if (!service) return;
  return <ServiceRoute isAdmin={isAdmin} service={service} />;
};

export default ServicePage;
