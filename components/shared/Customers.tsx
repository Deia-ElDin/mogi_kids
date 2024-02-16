"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import { Separator } from "../ui/separator";
import { cstOpinion } from "@/constants";
import Title from "./helpers/Title";
import Text from "./helpers/Text";
import CstCard from "./card/CstCard";
import ArrowBtn from "./btns/ArrowBtn";

const Customers = () => {
  return (
    <section id="customers" className="section-style">
      <Title text="Our Customers, Both Parents and Children, Are Our Priority" />
      <Text text="We take immense pride in the service we provide to our customers. Our customer reviews reflect the high level of customer satisfaction that we have achieved." />
      <div className="py-10 relative">
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
          navigation={{
            nextEl: ".swiper-next-img1",
            prevEl: ".swiper-prev-img1",
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
        >
          {cstOpinion.map((cst) => (
            <SwiperSlide key={cst.cstName} className="max-w-[300px] mb-3">
              <CstCard cst={cst} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination1 text-center"></div>
        <ArrowBtn btnClass="swiper-prev-img1" img="Left arrow" />
        <ArrowBtn btnClass="swiper-next-img1" img="Right arrow" />
      </div>
      <Separator />
    </section>
  );
};

export default Customers;
