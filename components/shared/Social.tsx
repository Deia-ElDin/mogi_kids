import React from "react";

const Social = () => {
  return (
  <section>Social</section>
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
