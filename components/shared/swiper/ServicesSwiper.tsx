"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import ArrowBtn from "@/components/shared/btns/ArrowBtn";
import ServiceCard from "@/components/shared/cards/ServiceCard";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ServicesSwiper = ({ serviceImgs }: any) => {
  return (
    <div className="pt-10 relative">
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
        pagination={{ el: ".swiper-pagination2", clickable: true }}
        navigation={{
          nextEl: ".swiper-next-img2",
          prevEl: ".swiper-prev-img2",
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
      >
        {serviceImgs.map((service: any, index: number) => (
          <SwiperSlide key={index} className="max-w-[300px]">
            <ServiceCard service={service} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination2 text-center"></div>
      <ArrowBtn btnClass="swiper-prev-img2" img="Left arrow" />
      <ArrowBtn btnClass="swiper-next-img2" img="Right arrow" />
    </div>
  );
};

export default ServicesSwiper;
