import Title from "./helpers/Title";
import Text from "./helpers/Text";
import { IWelcomePage } from "@/lib/database/models/welcome.model";

type ArticleProps = {
  title: string;
  content: string[];
};

const Article = ({ title, content }: ArticleProps) => {
  // if (!page || !title || !content?.length) return null;

  return (
    <>
      <Title text={title} />
      {Array.isArray(content) ? (
        content.map((text) => <Text key={text} text={text} />)
      ) : (
        <Text text={content} />
      )}
    </>
  );
};

export default Article;
