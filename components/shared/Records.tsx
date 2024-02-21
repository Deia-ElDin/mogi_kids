"use client";

import { records } from "@/constants";
import { IPage } from "@/lib/database/models/page.model";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { deletePage } from "@/lib/actions/page.actions";
import { handleError } from "@/lib/utils";
import Article from "./helpers/Article";
import PageForm from "./forms/PageForm";
import DeleteBtn from "./btns/DeleteBtn";
import RecordCard from "./cards/RecordCard";

type RecordsProps = {
  isAdmin: boolean | undefined;
  recordsPage: IPage | Partial<IPage> | undefined;
};

const Records = () => (
  <section id="records" className="section-style">
    <div className="flex flex-col md:flex-row w-full justify-center gap-7 mt-10">
      {records.map((statistic) => (
        <RecordCard key={statistic.title} statistic={statistic} />
      ))}
    </div>
    <Separator />
  </section>
);

export default Records;

// Our Services Record
// We strive to provide the best customer service. However, we also want you to know exactly what our customers think. Our record will show exactly the level of services we are offering and when we are achieving 100% customer satisfaction.
