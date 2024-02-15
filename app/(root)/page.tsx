import Welcome from "@/components/shared/Welcome";
import Services from "./services/page";
import Questions from "@/components/shared/Questions";
import Statistics from "@/components/shared/Statistics";
import Customers from "@/components/shared/Customers";
import Quote from "@/components/shared/Quote";
import Contacts from "@/components/shared/Contacts";
import { connectToDb } from "@/lib/database";

export default async function Home() {
  await connectToDb();

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
