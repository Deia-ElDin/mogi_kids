import Title from "./helpers/Title";
import Text from "./helpers/Text";

type ArticleProps = {
  title: string;
  content: string[];
};

const Article = ({ title, content }: ArticleProps) => {
  if (!title || !content?.length) return null;

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
