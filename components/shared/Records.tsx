import Title from "./helpers/Title";
import Body from "./helpers/Body";
import Breaker from "./helpers/Breaker";
import Image from "next/image";
import { records } from "@/constants";

const Records = () => (
  <section id="records" className="section-style">
    <Title text="Our Services Record" />
    <Body text="We strive to provide the best customer service. However, we also want you to know exactly what our customers think. Our record will show exactly the level of services we are offering and when we are achieving 100% customer satisfaction." />
    <div className="grid grid-cols-3 h-[200px] w-full justify-center gap-7 mt-10">
      {records.map((record) => (
        <div
          key={record.title}
          className="flex flex-col justify-around items-center border rounded-lg"
          style={{ backgroundColor: record.color }}
        >
          <Image src={record.icon} alt={record.title} height={50} width={70} />
          <p className="text-2xl font-bold">{record.rating}</p>
          <p className="txt-lg">{record.title}</p>
        </div>
      ))}
    </div>
    <Breaker />
  </section>
);

export default Records;
