// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import { careImgs } from "@/constants";
// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// const Gallery = () => {
//   return (
//     <div className="border-red-500 border-y-4 relative">
//       <Swiper
//         spaceBetween={100}
//         slidesPerView="auto"
//         grabCursor={true}
//         centeredSlides={true}
//         loop={true}
//         coverflowEffect={{
//           rotate: 0,
//           stretch: 0,
//           depth: 100,
//           modifier: 2.5,
//         }}
//         pagination={{ el: ".swiper-pagination-main", clickable: true }}
//         autoplay={{
//           delay: 2500,
//           disableOnInteraction: false,
//           pauseOnMouseEnter: true,
//         }}
//         modules={[Navigation, Pagination, Autoplay]}
//       >
//         {careImgs.map((image) => (
//           <SwiperSlide key={image} className="w-full">
//             <img
//               src={image}
//               alt="Child"
//               className="w-full h-auto aspect-[2/1]"
//             />
//           </SwiperSlide>
//         ))}
//         <div className="swiper-pagination-main absolute inset-x-0 bottom-0 z-10"></div>
//       </Swiper>
//     </div>
//   );
// };

// export default Gallery;

"use client";

import { useState, useEffect } from "react";
import { careImgs } from "@/constants";

const Gallery = () => {
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

  return (
    <section className="border-red-500 border-y-4">
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
              aspectRatio: "2/1",
              objectFit: "cover",
              translate: `${count * -100}%`,
              transition: "translate 500ms ease-in-out",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Gallery;
