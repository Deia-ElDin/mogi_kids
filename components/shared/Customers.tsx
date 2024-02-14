"use client";

import Title from "./helpers/Title";
import Body from "./helpers/Body";
import Breaker from "./helpers/Breaker";

const Customers = () => {
  return (
    <section id="customers" className="section-style">
      <Title text="Our Customers, Both Parents and Children, Are Our Priority." />
      <Body text="We take immense pride in the service we provide to our customers. Our customer reviews reflect the high level of customer satisfaction that we have achieved." />
      <Breaker />
    </section>
  );
};

export default Customers;
