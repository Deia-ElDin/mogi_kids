"use client";

import { usePathname } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IAboutUs } from "@/lib/database/models/about-us.model";
import { deleteAboutUs } from "@/lib/actions/aboutUs.actions";
import { handleError } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Text from "../helpers/Text";
import Title from "../helpers/Title";
import UpdateAboutUsForm from "../forms/UpdateAboutUsForm";
import DeleteBtn from "../btns/DeleteBtn";

type AboutUsCardParams = {
  isAdmin: boolean | undefined;
  aboutUsObj: IAboutUs;
  index: number;
};

const AboutUsCard: React.FC<AboutUsCardParams> = (props) => {
  const { isAdmin, aboutUsObj, index } = props;

  const pathname = usePathname();

  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { success, error } = await deleteAboutUs(aboutUsObj._id, pathname);

      if (!success && error) {
        if (typeof error === "string") {
          throw new Error(error);
        } else {
          throw error;
        }
      }

      toast({ description: "About Us Article Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The About Us Article, ${handleError(
          error
        )}`,
      });
    }
  };

  return (
    <Card className="flex flex-col gap-5 bg-transparent border-white shadow-xl p-5">
      <div
        className={`flex flex-col ${
          index % 2 ? "md:flex-row" : "md:flex-row-reverse"
        } justify-between items-center w-full border-none bg-transparent`}
      >
        <CardContent
          className={`md:w-[50%] p-0 flex ${
            index % 2 ? "justify-start" : "justify-end"
          } `}
        >
          <img
            src={aboutUsObj.imgUrl}
            alt={aboutUsObj.title}
            className="w-[300px] h-[300px]"
          />
        </CardContent>
        <CardContent className="flex flex-col items-start gap-3 md:w-[50%] p-0">
          <Title text={aboutUsObj.title!} />
          <Text text={aboutUsObj.content!} targetClass={2} />
        </CardContent>
      </div>
      {isAdmin && (
        <CardFooter className="flex justify-center items-center gap-3 w-full p-0">
          <div className="w-[50%]">
            <UpdateAboutUsForm aboutUsArticle={aboutUsObj} />
          </div>
          <div className="w-[50%]">
            <DeleteBtn
              pageId={aboutUsObj._id}
              isAdmin={isAdmin}
              deletionTarget="Delete Article"
              handleClick={handleDelete}
            />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AboutUsCard;
