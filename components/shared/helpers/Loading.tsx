import React from "react";

type LoadingProps = {
  loadingClass?: string;
};

const Loading = ({ loadingClass }: LoadingProps) => {
  return (
    <div className="h-[100px] w-full flex justify-center items-center p-5">
      <div id="circularG">
        <div id="circularG_1" className="circularG"></div>
        <div id="circularG_2" className="circularG"></div>
        <div id="circularG_3" className="circularG"></div>
        <div id="circularG_4" className="circularG"></div>
        <div id="circularG_5" className="circularG"></div>
        <div id="circularG_6" className="circularG"></div>
        <div id="circularG_7" className="circularG"></div>
        <div id="circularG_8" className="circularG"></div>
      </div>
    </div>
  );
};

export default Loading;
