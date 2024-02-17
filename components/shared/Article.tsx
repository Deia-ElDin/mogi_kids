import Title from "./helpers/Title";
import Text from "./helpers/Text";

type ArticleProps = {
  page: any;
  title: string;
  content: string[];
};

const Article = ({page, title, content }: ArticleProps) => {
  if (!page || !title || !content?.length) return null;

  return (
    <>
      <Title text={title} />
      {content.map((text) => (
        <Text key={text} text={text} />
      ))}
    </>
  );
};

export default Article;
