import Title from "./Title";
import Text from "./Text";

type ArticleProps = {
  title: string | null;
  content: string[] | string | null;
};

const Article: React.FC<ArticleProps> = ({ title, content }) => {
  if (!title) return null;

  return (
    <>
      <Title text={title} />
      {Array.isArray(content) ? (
        content.map((text) => <Text key={text} text={text} />)
      ) : (
        <Text text={content ?? ""} />
      )}
    </>
  );
};

export default Article;
