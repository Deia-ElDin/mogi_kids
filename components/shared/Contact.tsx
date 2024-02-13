import Title from "./helpers/Title";
import Body from "./helpers/Body";
import Image from "next/image";
import { contacts } from "@/constants";

const Contact = () => {
  return (
    <section>
      <Title text="Contact Information" />
      <div className="flex flex-col items-start gap-5 py-9">
        {contacts.map((contact) => (
          <div className="flex items-center justify-center gap-5">
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

export default Contact;
