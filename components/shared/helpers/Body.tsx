import React from "react";

type BodyProps = {
  text: string;
};

const Body = ({ text }: BodyProps) => {
  return <p className="leading-9">{text}</p>;
};

export default Body;
