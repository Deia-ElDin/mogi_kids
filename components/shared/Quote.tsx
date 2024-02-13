import Title from "./helpers/Title";
import Body from "./helpers/Body";
import QuoteForm from "./forms/QuoteForm";
import Breaker from "./helpers/Breaker";

const Quote = () => {
  return (
    <section>
      <Title text="Find Out More About Our Services Today!" />
      <Body text="Are you ready to put your child in the care of one of our professional child care provider, and take advantage of convenient and customizable child care services?" />
      <Body text="Get in touch with us now" />
      <QuoteForm />
      <Breaker />
    </section>
  );
};

export default Quote;
