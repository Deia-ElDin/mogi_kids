import Title from "./helpers/Title";
import Text from "./helpers/Text";
// import QuoteForm from "./forms/QuoteForm";
import { Separator } from "../ui/separator";

const Quote = () => {
  return (
    <section id="quote" className="section-style">
      <Title text="Find Out More About Our Services Today!" />
      <Text text="Are you ready to put your child in the care of one of our professional child care provider, and take advantage of convenient and customizable child care services?" />
      <Text text="Get in touch with us now" />
      {/* <QuoteForm /> */}
      <Separator />
    </section>
  );
};

export default Quote;
