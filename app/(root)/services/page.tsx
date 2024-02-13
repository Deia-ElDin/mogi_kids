"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import ArrowBtn from "@/components/shared/helpers/ArrowBtn";
import Image from "next/image";
import Title from "@/components/shared/helpers/Title";
import Body from "@/components/shared/helpers/Body";
import Breaker from "@/components/shared/helpers/Breaker";
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

const Services = () => {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col gap-3 text-center pt-3 px-3">
        <Title text="Our Services" />
        <Body
          text="If you are looking for high-quality care for your child in the UAE,
          you need to look no further!"
        />
        <Body
          text="Sitters Company is proud to provide some of the highest quality child
          care services available in the UAE. We are also the first company in
          the UAE to offer these services via a mobile application. Our child
          care specialists are all highly qualified, and share a passion for
          providing good quality, personalized care for the children they look
          after."
        />
        <Body
          text="We provide a wide range of child care services for parents, at your
          choice of location, and all for a budget-friendly hourly rate—so
          you’re in control. Our services include child care in your home, at
          the mall, and at your hotel. We can also provide regular or one-off
          pick-up and drop-off services for school or nursery. If your plans
          change, and you need child care in a hurry, we offer emergency
          service."
        />
        <Body
          text="Whatever services we are providing, your child’s safety and well-being
          is our priority. If we are driving your children, they will always be
          in an approved car seat. You can also use our mobile app to provide
          you with up-to-date information about your child’s location and
          activities, giving you the reassurance you need that your child is in
          specialist hands."
        />
      </div>
      <div className="relative py-10">
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
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-next-img",
            prevEl: ".swiper-prev-img",
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
        >
          {serviceImgs.map((image, index) => (
            <SwiperSlide key={index} className="max-w-[300px]">
              <div className="flex flex-col justify-center max-w-[300px]">
                <Image
                  src={image.url}
                  alt="Child"
                  width={300}
                  height={300}
                  className="rounded-t-lg"
                />
                <p className="flex justify-center items-center text-center w-full  h-[60px] font-bold text-lg bg-white rounded-b-lg max-w-[300px]">
                  {image.title}
                </p>
                <p className="hidden-text max-w-[300px]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Doloribus explicabo maiores aliquid perferendis sit nam odit
                  aliquam doloremque impedit aperiam. Totam fugit corrupti nam
                  est dolore fugiat, commodi nemo porro nostrum facere alias
                  ipsum dolorem quidem autem explicabo vel dicta sint earum
                  rerum pariatur reprehenderit soluta. Aliquid illo explicabo
                  nam officia suscipit amet reiciendis inventore aspernatur
                  voluptatibus, sint fugit corporis itaque. Maiores, quibusdam
                  repudiandae suscipit aliquid veniam aliquam, similique
                  nesciunt laudantium, beatae molestias modi nisi recusandae
                  voluptates accusantium explicabo! Quisquam autem voluptate
                  delectus numquam tempore debitis, molestiae quis nemo dolores,
                  tenetur, sapiente eveniet ipsum? Consequatur, eveniet et.
                  Iure, alias fugiat?
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination"></div>
        <ArrowBtn btnClass="swiper-prev-img" img="Left arrow" />
        <ArrowBtn btnClass="swiper-next-img" img="Right arrow" />
      </div>
      <Breaker />
    </section>
  );
};

export default Services;
