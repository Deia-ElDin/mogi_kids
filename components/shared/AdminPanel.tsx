import { getUsage } from "@/lib/actions/usage.actions";

const AdminPanel = async () => {
  const usage = await getUsage();

  return <section className="w-full"></section>;
};

export default AdminPanel;
