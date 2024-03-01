"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import { IGallery } from "@/lib/database/models/gallery.model";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

type GallerySwiperProps = {
  gallery: IGallery[];
};

const GallerySwiper: React.FC<GallerySwiperProps> = ({ gallery }) => {
  if (gallery.length === 0) return null;

  return (
    <div className="w-full border-b-4 border-custom-red relative">
      <Swiper
        spaceBetween={100}
        slidesPerView="auto"
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: ".swiper-pagination1", clickable: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
      >
        {gallery.map((imgObj) => (
          <SwiperSlide key={imgObj._id}>
            <img
              src={imgObj.imgUrl}
              alt="Child"
              style={{
                width: "100%",
                height: "auto",
                flexShrink: 0,
                flexGrow: 0,
                aspectRatio: "2/1",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination1 text-center z-20 absolute bottom-0 "></div>
    </div>
  );
};

export default GallerySwiper;

// "use client";

// import { useState, useEffect } from "react";
// import { IGallery } from "@/lib/database/models/gallery.model";

// type GallerySwiperProps = {
//   gallery: IGallery[];
// };

// const GallerySwiper: React.FC<GallerySwiperProps> = ({ gallery }) => {
//   const [count, setCount] = useState(0);

//   console.log("GallerySwiper -> gallery", gallery);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount((prevCount) => (prevCount + 1) % gallery.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (gallery[count] != gallery[gallery.length - 1])
//       gallery.push(gallery[count]);
//   }, [count]);

//   return (
//     Array.isArray(gallery) &&
//     gallery.length > 0 && (
//       <section className="border-custom-red border-b-4">
//         <div style={{ display: "flex", overflow: "hidden" }}>
//           {gallery.map((imgObj, index) => (
//             <img
//               key={`${imgObj._id}-${index}`}
//               src={imgObj.imgUrl}
//               alt="Child"
//               style={{
//                 width: "100%",
//                 height: "auto",
//                 flexShrink: 0,
//                 flexGrow: 0,
//                 aspectRatio: "2/1",
//                 objectFit: "cover",
//                 translate: `${count * -100}%`,
//                 transition: "translate 500ms ease-in-out",
//               }}
//             />
//           ))}
//         </div>
//       </section>
//     )
//   );
// };

// export default GallerySwiper;
