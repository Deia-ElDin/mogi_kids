import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getAllPages } from "@/lib/actions/page.actions";
import { getUsage } from "@/lib/actions/usage.actions";
import { IUser } from "@/lib/database/models/user.model";
import { IPage } from "@/lib/database/models/page.model";
import { IUsage } from "@/lib/database/models/usage.model";
import { findPage } from "@/lib/utils";
import AdminPanel from "@/components/shared/AdminPanel";
import Welcome from "@/components/shared/Welcome";
import Services from "./services/page";
import Questions from "@/components/shared/Questions";
import Statistics from "@/components/shared/Statistics";
import Customers from "@/components/shared/Customers";
import Quote from "@/components/shared/Quote";
import Contacts from "@/components/shared/Contacts";

export default async function Home() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const user: IUser = await getUserByUserId(userId);
  const pages: IPage[] = await getAllPages();
  const usage: IUsage = await getUsage();
  const isAdmin = user?.role === "Admin";

  return (
    <>
      <AdminPanel usage={usage} />
      <Welcome
        isAdmin={isAdmin}
        welcomePage={findPage(pages, "Welcome Page")}
      />
      <Services />
      <Questions />
      <Statistics />
      <Customers />
      <Quote />
      <Contacts />
    </>
  );
}
