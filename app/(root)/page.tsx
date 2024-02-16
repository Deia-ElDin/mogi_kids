import { auth } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.actions";
import Welcome from "@/components/shared/Welcome";
import Services from "./services/page";
import Questions from "@/components/shared/Questions";
import Statistics from "@/components/shared/Statistics";
import Customers from "@/components/shared/Customers";
import Quote from "@/components/shared/Quote";
import Contacts from "@/components/shared/Contacts";

export default async function Home() {
  // const { sessionClaims } = auth();
  // const userId = sessionClaims?.userId as string;
  // const user = await getUser(userId);
  // const isAdmin = user?.role === "Admin";

  return (
    <>
      <Welcome />
      <Services />
      <Questions />
      <Statistics />
      <Customers />
      <Quote />
      <Contacts />
    </>
  );
}
