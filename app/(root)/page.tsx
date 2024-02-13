import Welcome from "@/components/shared/Welcome";
import Services from "./services/page";
import Questions from "@/components/shared/Questions";
import Records from "@/components/shared/Records";
import Customer from "@/components/shared/Customer";

export default function Home() {
  return (
    <>
      <Welcome />
      <Services />
      <Questions />
      <Records />
      <Customer />
    </>
  );
}
