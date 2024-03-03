"use client";

import { IPage } from "@/lib/database/models/page.model";
import { ILogo } from "@/lib/database/models/logo.model";
import { deletePage } from "@/lib/actions/page.actions";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useToast } from "../ui/use-toast";
import { handleError } from "@/lib/utils";
import Article from "./helpers/Article";
import PageForm from "./forms/PageForm";
import QuoteForm from "./forms/QuoteForm";
import DeleteBtn from "./btns/DeleteBtn";

type QuoteProps = {
  isAdmin: boolean | undefined;
  quotePage: IPage | Partial<IPage>;
  logo: ILogo | null;
};

const Quote: React.FC<QuoteProps> = ({ isAdmin, quotePage, logo }) => {
  const { toast } = useToast();

  const pageTitle = getPageTitle(quotePage, isAdmin, "Quote Section Title");

  const pageContent = getPageContent(quotePage, isAdmin);

  const handleDelete = async () => {
    try {
      if (quotePage?._id) {
        const { success, error } = await deletePage(quotePage._id, "/");
        if (!success && error) throw new Error(error);
        toast({ description: "Quotation Page Deleted Successfully." });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Quotation Page, ${handleError(
          error
        )}`,
      });
    }
  };

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      {isAdmin && <PageForm page={quotePage} pageName="Quote Page" />}
      {quotePage?._id && <QuoteForm logo={logo} />}
      <DeleteBtn
        pageId={quotePage?._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Quote Section"
        handleClick={handleDelete}
      />
      <Separator pageId={quotePage?._id} isAdmin={isAdmin} />
    </section>
  );
};

export default Quote;

{
  /* <Title text="Find Out More About Our Services Today!" />
<Text text="Are you ready to put your child in the care of one of our professional child care provider, and take advantage of convenient and customizable child care services?" />
<Text text="Get in touch with us now" /> */
}
