"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import { Separator } from "@/components/ui/separator";
import ArrowBtn from "@/components/shared/helpers/ArrowBtn";
import Title from "@/components/shared/helpers/Title";
import Text from "@/components/shared/helpers/Text";
import ServiceCard from "@/components/shared/Cards/ServiceCard";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const serviceImgs = [
  {
    title: "Emergency Child Care",
    url: "/assets/images/s1.jpeg",
    paragraph: "",
  },
  {
    title: "Overnight Care",
    url: "/assets/images/s2.jpeg",
    paragraph: "",
  },
  {
    title: "Event Child Care",
    url: "/assets/images/s3.jpeg",
    paragraph: "",
  },
  {
    title: "Nursery & School Pickup & Drop Off",
    url: "/assets/images/s4.jpeg",
    paragraph: "",
  },
  {
    title: "After-School Home Care",
    url: "/assets/images/s5.jpeg",
    paragraph: "",
  },
  {
    title: "Mall Babysitting Care",
    url: "/assets/images/s6.jpeg",
    paragraph: "",
  },
  {
    title: "Holiday Child Care",
    url: "/assets/images/s7.jpeg",
    paragraph: "",
  },
];

const textArr = [
  "• Preschools and Schools.",
  "• Organizing celebrations for local and international occasions.",
  "• Arranging events in alignment with school and nursery curriculum.",
  "• Planning external trips and festivals for schools and nurseries.",
  "• Providing qualified teachers to deliver modern courses for children, such as courses in investment and a comprehensive program accredited by the Ministry of Education. This program enables children to learn about savings and apply their knowledge through practical exercises. Additionally, we offer certified courses in artificial intelligence and more.",
  "• Organizing modern and distinctive birthday celebrations, either at home or at external venues.",
  "• Arranging graduation parties for various age groups. Organizing private family gatherings.",
  "• Catering to children's needs during corporate events and institutional celebrations.",
  "• Organizing public carnivals.",
  "• Weekly varied and refreshing activities.",
  "• Weekly recreational and educational outings.",
  "• Providing all the stationery needs for schools, nurseries, and institutions through a single application, offering the best prices and daily delivery.",
  "• Supplying all school and educational supplies for students of various ages, with the option to customize their own designs.",
];

const Services = () => {
  return (
    <section id="services" className="section-style">
      <Title text="Our Services" />
      {textArr.map((text, index) => (
        <Text key={index} text={text} />
      ))}
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
          {serviceImgs.map((service, index) => (
            <SwiperSlide key={index} className="max-w-[300px]">
              <ServiceCard service={service} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination2 text-center"></div>
        <ArrowBtn btnClass="swiper-prev-img2" img="Left arrow" />
        <ArrowBtn btnClass="swiper-next-img2" img="Right arrow" />
      </div>
      <Separator />
    </section>
  );
};

export default Services;
