import Welcome from "@/components/shared/Welcome";
import Services from "./services/page";
import Questions from "@/components/shared/Questions";
import Records from "@/components/shared/Records";
import Customer from "@/components/shared/Customer";
import Quote from "@/components/shared/Quote";
import Contact from "@/components/shared/Contact";

export default function Home() {
  return (
    <>
      <Welcome />
      <Services />
      <Questions />
      <Records />
      <Customer />
      <Quote />
      <Contact />
    </>
  );
}
