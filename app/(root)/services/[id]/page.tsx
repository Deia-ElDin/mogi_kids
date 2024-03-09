import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getServiceById } from "@/lib/actions/service.actions";
import { isAdminUser } from "@/lib/utils";
import ServicePage from "@/components/shared/pages/ServicePage";

type ServicePageProps = {
  params: { id: string };
};

const ServiceRoute: React.FC<ServicePageProps> = async ({ params: { id } }) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userResult = await getUserByUserId(userId);
  const user = userResult.success ? userResult.data || null : null;
  const isAdmin = isAdminUser(user);

  const servicesResult = await getServiceById(id);
  const service = servicesResult.success ? servicesResult.data || null : null;

  // 404
  if (!service) return;
  return <ServicePage isAdmin={isAdmin} service={service} />;
};

export default ServiceRoute;
