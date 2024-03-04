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

// Lorem ipsum dolor sit, amet consectetur adipisicing elit. Amet voluptatem nesciunt fuga commodi! Atque ratione facilis nemo labore culpa fugiat maxime doloribus incidunt officia quam tempora laudantium impedit temporibus nesciunt non similique, dicta nisi totam! Cumque ipsa saepe cum consectetur est perspiciatis magnam quisquam odit error accusantium delectus, optio provident omnis. Dolores totam sunt, sed ad nisi aspernatur sit, quidem odio aperiam fugit tempore sapiente corrupti amet quas molestias eos eius provident animi accusamus nobis autem. Illum excepturi aut animi voluptate quos minima temporibus, dolorem, consequatur, esse libero recusandae neque. Adipisci, sunt ex non veniam doloremque ullam voluptas beatae numquam ducimus id consequuntur repellat labore odit at obcaecati incidunt veritatis dicta sit fuga consequatur animi autem illum cupiditate laudantium. Dicta repellendus debitis, id voluptatem odit quibusdam nesciunt laudantium, explicabo quas consequuntur error natus laboriosam minima rerum autem soluta. Cum fugit at dignissimos ducimus vero cumque voluptates autem adipisci itaque! Voluptas eum eaque facilis veritatis a, placeat dolore quibusdam fuga dolorem debitis, ratione quod itaque quos? Ullam, consequatur? Quis doloremque modi iusto, delectus illum praesentium maiores enim quia ex aperiam possimus assumenda nostrum necessitatibus cupiditate natus autem porro consequatur quisquam, ratione nihil aut? Architecto voluptas voluptatibus dolores accusamus natus. Minima, culpa!