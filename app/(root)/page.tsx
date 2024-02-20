import { auth } from "@clerk/nextjs";

import { IUser } from "@/lib/database/models/user.model";
import { IPage } from "@/lib/database/models/page.model";
import { IService } from "@/lib/database/models/service.model";

import { getUserByUserId } from "@/lib/actions/user.actions";
import { getAllPages } from "@/lib/actions/page.actions";
import { getAllServices } from "@/lib/actions/service.actions";

import { findPage } from "@/lib/utils";

import AdminPanel from "@/components/shared/AdminPanel";
import Welcome from "@/components/shared/Welcome";
import Services from "@/components/shared/Services";
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
  const services: IService[] = await getAllServices();
  const isAdmin = user?.role === "Admin";

  return (
    <>
      <AdminPanel />
      <Welcome
        isAdmin={isAdmin}
        welcomePage={findPage(pages, "Welcome Page")}
      />
      <Services
        isAdmin={isAdmin}
        servicesPage={findPage(pages, "Services Page")}
        services={services}
      />
      <Questions />
      <Statistics />
      <Customers />
      <Quote />
      <Contacts />
    </>
  );
}
