"use client";

import { IUser } from "@/lib/database/models/user.model";
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
  user: IUser | null;
  isAdmin: boolean | undefined;
  quotePage: IPage | Partial<IPage>;
};

const Quote: React.FC<QuoteProps> = ({ user, isAdmin, quotePage }) => {
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
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      {isAdmin && <PageForm page={quotePage} pageName="Quote Page" />}
      {quotePage?._id && <QuoteForm user={user} />}
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
