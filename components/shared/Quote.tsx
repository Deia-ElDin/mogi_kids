"use client";

import { IPage } from "@/lib/database/models/page.model";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { deletePage } from "@/lib/actions/page.actions";
import { handleError } from "@/lib/utils";
import Article from "./helpers/Article";
import PageForm from "./forms/PageForm";
import QuoteForm from "./forms/QuoteForm";
import DeleteBtn from "./btns/DeleteBtn";

type QuoteProps = {
  isAdmin: boolean | undefined;
  quotePage: IPage | Partial<IPage> | undefined;
};

const Quote = ({ isAdmin, quotePage }: QuoteProps) => {
  const pageTitle = getPageTitle(quotePage, isAdmin, "Quote Section Title");
  const pageContent = getPageContent(quotePage, isAdmin);

  const handleDelete = async () => {
    try {
      if (quotePage?._id) await deletePage(quotePage._id, "/");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <section id="quote" className="section-style">
      <Article title={pageTitle} content={pageContent} />
      {isAdmin && <PageForm page={quotePage} pageName="Quote Page" />}
      <DeleteBtn
        pageId={quotePage?._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Quote Section"
        handleClick={handleDelete}
      />
      {quotePage?._id && <QuoteForm />}
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
