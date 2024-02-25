import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IAboutUs } from "@/lib/database/models/aboutUs.model";
import Text from "../helpers/Text";
import Title from "../helpers/Title";
import UpdateBtn from "../btns/UpdateBtn";
import DeleteBtn from "../btns/DeleteBtn";

type AboutUsCardParams = {
  isAdmin: boolean | undefined;
  aboutUsObj: IAboutUs | Partial<IAboutUs>;
  index: number;
};

const AboutUsCard: React.FC<AboutUsCardParams> = (props) => {
  const { isAdmin, aboutUsObj, index } = props;

  const handleUpdate = async () => {};
  const handleDelete = async () => {};

  return (
    <Card
      className={`flex flex-col ${
        index % 2 ? "md:flex-row" : "md:flex-row-reverse"
      } justify-between items-center w-full border-none bg-transparent`}
    >
      <CardContent
        className={`md:w-[50%] flex ${
          index % 2 ? "justify-start" : "justify-end"
        } `}
      >
        <img
          src={aboutUsObj.imgUrl}
          alt={aboutUsObj.title}
          className="w-[300px] h-[300px]"
        />
      </CardContent>
      <CardContent className="flex flex-col items-start gap-3 md:w-[50%]">
        <Title text={aboutUsObj.title!} />
        <Text text={aboutUsObj.content!} targetClass={2} />
      </CardContent>
      {isAdmin && (
        <CardFooter className="flex items-center gap-3 w-full">
          <UpdateBtn
            updateTarget="Update About Us Article"
            handleClick={handleUpdate}
          />
          <DeleteBtn
            pageId={aboutUsObj._id}
            isAdmin={isAdmin}
            deletionTarget="Delete About Us Article"
            handleClick={handleDelete}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default AboutUsCard;
