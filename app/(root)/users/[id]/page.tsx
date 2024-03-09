import { getUserByUserId } from "@/lib/actions/user.actions";
import { getLogo } from "@/lib/actions/logo.actions";
import { isAdminUser } from "@/lib/utils";
import AdminPage from "@/components/shared/pages/AdminPage";
import UserPage from "@/components/shared/pages/UserPage";

type ServicePageProps = {
  params: { id: string };
};

const UserRoute = async ({ params: { id } }: ServicePageProps) => {
  const userResult = await getUserByUserId(id);
  const logoResult = await getLogo();

  const user = userResult.success ? userResult.data || null : null;
  const logo = logoResult.success ? logoResult.data || null : null;

  const isAdmin = isAdminUser(user);

  if (isAdmin) return <AdminPage />;
  else if (user) return <UserPage user={user} logo={logo} />;
  else return;
};

export default UserRoute;
