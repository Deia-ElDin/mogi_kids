import { getUserByUserId } from "@/lib/actions/user.actions";
import { getLogo } from "@/lib/actions/logo.actions";
import AdminPage from "@/components/shared/pages/AdminPage";
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

  if (isAdmin) return <AdminPage />;
  else if (user) return <UserRoute user={user} logo={logo} />;
  else return;
};

export default UserPage;
