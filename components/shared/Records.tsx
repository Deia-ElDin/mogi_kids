"use client";

import { IPage } from "@/lib/database/models/page.model";
import { IRecord } from "@/lib/database/models/record.model";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator";
import { deletePage } from "@/lib/actions/page.actions";
import { deleteAllRecords } from "@/lib/actions/record.actions";
import { handleError } from "@/lib/utils";
import Article from "./helpers/Article";
import PageForm from "./forms/PageForm";
import RecordCard from "./cards/RecordCard";
import RecordForm from "./forms/CreateRecordForm";
import DeleteBtn from "./btns/DeleteBtn";

type RecordsProps = {
  isAdmin: boolean | undefined;
  recordsPage: IPage | Partial<IPage>;
  records: IRecord[] | [];
};

const Records: React.FC<RecordsProps> = ({ isAdmin, recordsPage, records }) => {
  const { toast } = useToast();
  const pageTitle = getPageTitle(recordsPage, isAdmin, "Records Section Title");

  const pageContent = getPageContent(recordsPage, isAdmin);

  const handleDelete = async () => {
    try {
      if (recordsPage?._id) {
        const { success, error } = await deletePage(recordsPage._id, "/");
        if (!success && error) throw new Error(error);
      }
      if (records.length > 0) {
        const { success, error } = await deleteAllRecords();
        if (!success && error) throw new Error(error);
      }
      toast({ description: "Records Page Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete Either The Records Page or The Records, ${handleError(error)}`,
      });
    }
  };

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      {isAdmin && <PageForm page={recordsPage} pageName="Records Page" />}
      {records.length > 0 && (
        <div className="flex flex-wrap justify-center gap-7 mt-10">
          {records.map((record, index) => (
            <RecordCard
              key={`${record.label}-${index}`}
              isAdmin={isAdmin}
              record={record}
            />
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
