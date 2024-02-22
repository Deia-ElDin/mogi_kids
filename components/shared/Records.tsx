"use client";

import { IPage } from "@/lib/database/models/page.model";
import { IRecord } from "@/lib/database/models/record.model";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { deletePage } from "@/lib/actions/page.actions";
import { deleteAllRecords } from "@/lib/actions/record.actions";
import { handleError } from "@/lib/utils";
import Article from "./helpers/Article";
import PageForm from "./forms/PageForm";
import RecordCard from "./cards/RecordCard";
import RecordForm from "./forms/RecordForm";
import DeleteBtn from "./btns/DeleteBtn";

type RecordsProps = {
  isAdmin: boolean | undefined;
  recordsPage: IPage | Partial<IPage> | undefined;
  records: IRecord[] | [];
};

const Records = ({ isAdmin, recordsPage, records }: RecordsProps) => {
  const pageTitle = getPageTitle(recordsPage, isAdmin, "Records Section Title");
  const pageContent = getPageContent(recordsPage, isAdmin);

  const handleDelete = async () => {
    try {
      if (recordsPage?._id) await deletePage(recordsPage._id, "/");
      if (records.length > 0) await deleteAllRecords();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      {isAdmin && <PageForm page={recordsPage} pageName="Records Page" />}
      {records.length > 0 && (
        <div className="flex flex-col md:flex-row w-full justify-center gap-7 mt-10">
          {records.map((record) => (
            <RecordCard key={record.label} isAdmin={isAdmin} record={record} />
          ))}
        </div>
      )}
      {isAdmin && recordsPage?._id && <RecordForm record={null} />}
      <DeleteBtn
        pageId={recordsPage?._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Records Section"
        handleClick={handleDelete}
      />
      <Separator pageId={recordsPage?._id} isAdmin={isAdmin} />
    </section>
  );
};

export default Records;

// Our Services Record
// We strive to provide the best customer service. However, we also want you to know exactly what our customers think. Our record will show exactly the level of services we are offering and when we are achieving 100% customer satisfaction.
