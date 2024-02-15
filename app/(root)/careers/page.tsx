import Title from "@/components/shared/helpers/Title";
import Text from "@/components/shared/helpers/Text";
import CareerForm from "@/components/shared/forms/CareerForm";

const Careers = () => {
  return (
    <section className="section-style">
      <Title text="Join Us For A Great Career In Child Care" />
      <Text
        text="Are you looking for a rewarding and exciting career in child care? Sitters Child Care Services is a team of the best in home child care providers, caregivers, and newborn care providers in UAE. We also have a great administrative team that supports our providers in our mission to deliver the highest quality child care in the UAE.
        Working with us will mean that you deliver the highest quality care and take pride in yourself and the team around you. We can provide you a challenging and rewarding career with lots of opportunities for career growth.
        We are the best-rated child care provider in UAE. Check us out for yourself and fill in the form below. If we find you are a suitable candidate, we will get back to you."
      />
      <CareerForm />
    </section>
  );
};

export default Careers;
