import Title from "@/components/shared/utils/Title";
import Body from "@/components/shared/utils/Body";
import Services from "./services/Services";
import Questions from "@/components/shared/Questions";

export default function Home() {
  return (
    <>
      <section className="flex flex-col">
        <div className="flex flex-col gap-3 text-center p-3">
          <Title
            text="Welcome To Mogi Kids Company – Home To The Finest Child Care
          Specialists In The UAE!"
          />
          <Body
            text="Mogi Kids Company is proud to be the first company in the UAE to offer
          professional child care services using a mobile app. We are a thriving
          team of child care specialists from around the world and we offer a
          wide range of personalized home-based and other child care services to
          parents who want the best for their little ones. All of our services
          are based on a budget-friendly hourly rate, so that every parent has
          the opportunity to benefit from specialist child care."
          />
        </div>
        <div className="flex justify-center pt-4 pb-2">
          <div className="border-t-2 w-4/5 border-white"></div>
        </div>
      </section>
      <Services />
      <Questions />
    </>
  );
}
