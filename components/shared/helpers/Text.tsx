type TextProps = {
  text: string;
  textClass?: string;
  targetClass?: number;
};

const Text: React.FC<TextProps> = ({ text, textClass, targetClass }) => {
  const cssClass =
    !targetClass || targetClass === 1 ? "text-style" : "text2-style";

  return (
    <p className={`${cssClass} text-center leading-9 ${textClass}`}>{text}</p>
  );
};

export default Text;
