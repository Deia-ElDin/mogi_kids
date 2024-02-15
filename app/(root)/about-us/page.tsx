import React from "react";
import AboutUsCard from "@/components/shared/Cards/AboutUsCard";
import { aboutUsDetails } from "@/constants";

const AboutUs = () => {
  return (
    <section className="section-style gap-20">
      {aboutUsDetails.map((details, index) => (
        <AboutUsCard key={index} details={details} index={index} />
      ))}
    </section>
  );
};

export default AboutUs;
