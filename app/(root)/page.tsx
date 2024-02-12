"use client";

import Services from "./services/Services";

export default function Home() {
  return (
    <div className="flex flex-col bg-custom-blue px-20">
      <div className="flex flex-col gap-3 text-center p-3">
        <h1 className="h1-text">
          Welcome To Mogi Kids Company – Home To The Finest Child Care
          Specialists In The UAE!
        </h1>
        <p className="leading-9">
          Mogi Kids Company is proud to be the first company in the UAE to offer
          professional child care services using a mobile app. We are a thriving
          team of child care specialists from around the world and we offer a
          wide range of personalized home-based and other child care services to
          parents who want the best for their little ones. All of our services
          are based on a budget-friendly hourly rate, so that every parent has
          the opportunity to benefit from specialist child care.
        </p>
      </div>
      <div className="flex justify-center pt-4 pb-2">
        <div className="border-t-2 w-4/5 border-white"></div>
      </div>
      <Services />
    </div>
  );
}
