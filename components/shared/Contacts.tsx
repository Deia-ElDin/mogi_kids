import Title from "./helpers/Title";
import Body from "./helpers/Body";
import Image from "next/image";
import { contacts } from "@/constants";

const Contacts = () => {
  return (
    <section id="contacts" className="section-style">
      <Title text="Contact Information" />
      <Body text="Get in touch with Sitters Company to take advantage of our wide range of child care services today!" />
      <div className="flex flex-col items-start gap-5 py-9">
        {contacts.map((contact) => (
          <div
            key={contact.title}
            className="flex items-center justify-center gap-5"
          >
            <Image
              src={contact.icon}
              alt={contact.title}
              height={40}
              width={40}
              className="inline-block"
            />
            <Body text={contact.details} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contacts;