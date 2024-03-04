import Title from "./Title";
import Text from "./Text";

type ArticleProps = {
  title: string | null;
  content: string | null;
};

const Article: React.FC<ArticleProps> = ({ title, content }) => {
  if (!title) return null;

  let contentArray: string[] | null = [];

  if (typeof content === "string" && content.includes("\n")) {
    contentArray = content.split("\n");
  } else if (typeof content === "string") {
    contentArray = [content];
  } else {
    contentArray = null;
  }

  return (
    <>
      <Title text={title} />
      {contentArray &&
        contentArray.map((text, index) => (
          <Text key={`${text} - ${index}`} text={text} />
        ))}
    </>
  );
};

export default Article;
