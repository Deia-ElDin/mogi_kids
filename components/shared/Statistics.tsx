import Title from "./helpers/Title";
import Text from "./helpers/Text";
import { records } from "@/constants";
import StatisticCard from "./cards/StatisticCard";
import { Separator } from "../ui/separator";

const Statistics = () => (
  <section id="records" className="section-style">
    <Title text="Our Services Record" />
    <Text text="We strive to provide the best customer service. However, we also want you to know exactly what our customers think. Our record will show exactly the level of services we are offering and when we are achieving 100% customer satisfaction." />
    <div className="flex flex-col md:flex-row w-full justify-center gap-7 mt-10">
      {records.map((statistic) => (
        <StatisticCard key={statistic.title} statistic={statistic} />
      ))}
    </div>
    <Separator />
  </section>
);

export default Statistics;
