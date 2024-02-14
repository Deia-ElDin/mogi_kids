import Welcome from "@/components/shared/Welcome";
import Services from "./services/page";
import Questions from "@/components/shared/Questions";
import Records from "@/components/shared/Records";
import Customers from "@/components/shared/Customers";
import Quote from "@/components/shared/Quote";
import Contacts from "@/components/shared/Contacts";

export default function Home() {
  return (
    <>
      <Welcome />
      <Services />
      <Questions />
      <Records />
      <Customers />
      <Quote />
      <Contacts />
    </>
  );
}
