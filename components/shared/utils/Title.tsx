import React from "react";

type TitleProps = {
  text: string;
};

const Title = ({ text }: TitleProps) => {
  return <h1 className="h1-text">{text}</h1>;
};

export default Title;
