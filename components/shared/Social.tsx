import React from "react";

const Social = () => {
  return (
    <div id="services" className="relative my-10">
      <ArrowBtn img="Left arrow" handleClick={showPrevImg} />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 max-h-[320px] overflow-hidden place-items-center">
        {/* <div className="flex justify-around gap-10 max-h-[320px] overflow-hidden place-items-center"> */}
        {serviceImgs.map((image, index) => (
          <div
            key={index}
            className="m-w-[400px] h-[320px] flex flex-col items-center justify-center cursor-pointer relative"
          >
            <img
              key={image.url}
              src={image.url}
              alt="Child"
              className="m-w-[400px] max-w-[400px] h-[80%] rounded-t-lg"
            />
            <p className="flex justify-center items-center w-full max-w-[400px] h-[20%] font-bold text-lg bg-white rounded-b-lg">
              {image.title}
            </p>
            <p className="hidden-text m-w-[400px]">
              {image.title}
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Consectetur facilis asperiores distinctio suscipit unde recusandae
              neque tempora, nisi natus pariatur.
            </p>
          </div>
        ))}
      </div>
      <ArrowBtn img="Right arrow" handleClick={showNextImg} />
    </div>
  );
};

export default Social;

// "use client";

// import { useState, useEffect } from "react";
// import { careImgs } from "@/constants";

// const Gallery = () => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount((prevCount) => (prevCount + 1) % careImgs.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (careImgs[count] != careImgs[careImgs.length - 1])
//       careImgs.push(careImgs[count]);
//   }, [count]);

//   return (
//     <div className="border-red-500 border-y-4">
//       <div style={{ display: "flex", overflow: "hidden" }}>
//         {careImgs.map((imgUrl, index) => (
//           <img
//             key={index}
//             src={imgUrl}
//             alt="Child"
//             style={{
//               width: "100%",
//               height: "auto",
//               flexShrink: 0,
//               flexGrow: 0,
//               aspectRatio: "2/1",
//               objectFit: "cover",
//               translate: `${count * -100}%`,
//               transition: "translate 500ms ease-in-out",
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Gallery;
