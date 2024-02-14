import React from "react";

type BodyProps = {
  text: string;
  bodyClass?: string;
};

const Body = ({ text, bodyClass }: BodyProps) => {
  return <p className="text-style text-center leading-9">{text}</p>;
};

export default Body;
