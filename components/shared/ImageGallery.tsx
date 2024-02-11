"use client";

import { useState, useEffect } from "react";
import { careImgs } from "@/constants";
import ArrowBtn from "./btns/ArrowBtn";

const ImageGallery = () => {
  const [imgIndex, setImgIndex] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % careImgs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (careImgs[count] != careImgs[careImgs.length - 1])
      careImgs.push(careImgs[count]);
  }, [count]);

  function showPrevImg() {
    setImgIndex((prevIndex) =>
      prevIndex === 0 ? careImgs.length - 1 : prevIndex - 1
    );
  }

  function showNextImg() {
    console.log(careImgs[-1]);

    setImgIndex((prevIndex) =>
      prevIndex === careImgs.length - 1 ? 0 : prevIndex + 1
    );
  }
  // <ArrowBtn img="Left arrow" handleClick={showPrevImg} />
  //     <ArrowBtn img="Right arrow" handleClick={showNextImg} />
  // console.log("careImgs = ", careImgs);

  return (
    <div className="border-red-500 border-y-4">
      <div style={{ display: "flex", overflow: "hidden" }}>
        {careImgs.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt="Child"
            style={{
              width: "100%",
              height: "auto",
              flexShrink: 0,
              flexGrow: 0,
              translate: `${count * -100}%`,
              transition: "translate 500ms ease-in-out",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
