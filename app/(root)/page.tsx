import Welcome from "@/components/shared/Welcome";
import Services from "./services/page";
import Questions from "@/components/shared/Questions";
import Statistics from "@/components/shared/Statistics";
import Customers from "@/components/shared/Customers";
import Quote from "@/components/shared/Quote";
import Contacts from "@/components/shared/Contacts";
import { auth, clerkClient } from "@clerk/nextjs";

export default async function Home() {
  const { sessionClaims } = auth();

  // const userId = "user_2cRCw22FQRFVxP3QtLHsy9E41bU";

  // const user = await clerkClient.users.getUser(userId);
  // console.log(user);

  const userId = sessionClaims?.userId as string;
  const userSub = sessionClaims?.sub as string;
  console.log("sessionClaims", sessionClaims);
  console.log("userId", userId);
  console.log("userSub", userSub);

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
