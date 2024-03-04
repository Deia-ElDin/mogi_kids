import { getUserByUserId } from "@/lib/actions/user.actions";
import { getLogo } from "@/lib/actions/logo.actions";
import AdminRoute from "@/components/shared/routes/AdminRoute";
import UserRoute from "@/components/shared/routes/UserRoute";

type ServicePageProps = {
  params: { id: string };
};

const UserPage = async ({ params: { id } }: ServicePageProps) => {
  const userResult = await getUserByUserId(id);
  const logoResult = await getLogo();

  const user = userResult.success ? userResult.data || null : null;
  const logo = logoResult.success ? logoResult.data || null : null;

  const isAdmin = user?.role === "Admin";

  return isAdmin ? (
    <AdminRoute user={user} />
  ) : (
    user && <UserRoute user={user} logo={logo} />
  );
};

export default UserPage;
