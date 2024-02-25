"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import { useRouter } from "next/navigation";
import { IService } from "@/lib/database/models/service.model";
import ArrowBtn from "@/components/shared/btns/ArrowBtn";
import ServiceCard from "@/components/shared/cards/ServiceCard";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

type ServicesSwiperProps = {
  services: IService[];
};

const ServicesSwiper: React.FC<ServicesSwiperProps> = (props) => {
  const { services } = props;

  if (services.length === 0) return;

  const router = useRouter();

  return (
    <div className="pt-10">
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
        {services.map((service, index) => (
          <SwiperSlide key={index} className="max-w-[300px]">
            <ServiceCard
              serviceObj={service}
              handleNavigate={() => router.push(`/services/${service._id}`)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination1 text-center"></div>
      <ArrowBtn btnClass="swiper-prev-img1" img="Left arrow" />
      <ArrowBtn btnClass="swiper-next-img1" img="Right arrow" />
    </div>
  );
};

export default ServicesSwiper;
