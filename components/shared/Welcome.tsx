"use client";

import { IPage } from "@/lib/database/models/page.model";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { deletePage } from "@/lib/actions/page.actions";
import { handleError } from "@/lib/utils";
import Article from "./helpers/Article";
import PageForm from "./forms/PageForm";
import DeleteBtn from "./btns/DeleteBtn";

type WelcomeProps = {
  isAdmin: boolean;
  welcomePage: IPage | Partial<IPage>;
};

const Welcome: React.FC<WelcomeProps> = ({ isAdmin, welcomePage }) => {
  const { toast } = useToast();

  const pageTitle = getPageTitle(welcomePage, isAdmin, "Welcome Section Title");

  const pageContent = getPageContent(welcomePage, isAdmin);

  const handleDelete = async () => {
    try {
      if (welcomePage?._id) {
        const { success, error } = await deletePage(welcomePage._id, "/");
        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }
        toast({ description: "Welcomes Page Deleted Successfully." });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Welcomes Page, ${handleError(
          error
        )}`,
      });
    }
  };

  return (
    <section className="section-style relative">
      <Article title={pageTitle} content={pageContent} />
      {isAdmin && <PageForm page={welcomePage} pageName="Welcomes Page" />}
      <DeleteBtn
        pageId={welcomePage._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Welcomes Section"
        handleClick={handleDelete}
      />
      <Separator pageId={welcomePage?._id} isAdmin={isAdmin} />
    </section>
  );
};

export default Welcome;

{
  /* 
Welcome To MOGi KiDS Company – Home To The Finest Child Care Specialists In The UAE!

At MOGi KiDS, we firmly believe that every child is unique and talented, deserving the opportunity to discover their individuality and develop their skills for a successful and joyous future. We are dedicated to paving the way for children through distinctive and innovative entertainment, educational programs, and studies, all delivered in an environment characterized by safety, fun, and stimulation.

The concept originated in 2019 and underwent extensive testing with parents to ensure continuous improvement and quality. As of the latest country statistics, there are approximately 1,145 schools, consisting of 838 private and government nurseries. The United Arab Emirates recorded an average of 35,552 nurseries in the year 2014, aligning with our slogan: 'A healthy childhood for a healthy future and a better society.'

We firmly believe that nurturing children is paramount to fostering a good and healthy society. A majority of well-adjusted individuals contribute positively to society due to their proper upbringing and childhood experiences. Conversely, negative traits in a person may often be attributed to their early experiences, potentially escalating into psychological problems that impact both the individual and society. Our mission is to provide a foundation that corrects and mitigates any potential negative impact from these early experiences.

<Title text="Welcome To MOGi KiDS Company – Home To The Finest Child Care Specialists In The UAE!" />
<Text text="At MOGi KiDS, we firmly believe that every child is unique and talented, deserving the opportunity to discover their individuality and develop their skills for a successful and joyous future. We are dedicated to paving the way for children through distinctive and innovative entertainment, educational programs, and studies, all delivered in an environment characterized by safety, fun, and stimulation." />
<Text text="The concept originated in 2019 and underwent extensive testing with parents to ensure continuous improvement and quality. As of the latest country statistics, there are approximately 1,145 schools, consisting of 838 private and government nurseries. The United Arab Emirates recorded an average of 35,552 nurseries in the year 2014, aligning with our slogan: 'A healthy childhood for a healthy future and a better society.'" />
<Text text="We firmly believe that nurturing children is paramount to fostering a good and healthy society. A majority of well-adjusted individuals contribute positively to society due to their proper upbringing and childhood experiences. Conversely, negative traits in a person may often be attributed to their early experiences, potentially escalating into psychological problems that impact both the individual and society. Our mission is to provide a foundation that corrects and mitigates any potential negative impact from these early experiences." /> */
}
