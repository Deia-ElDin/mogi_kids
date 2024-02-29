"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import { IUser } from "@/lib/database/models/user.model";
import { IReview } from "@/lib/database/models/review.model";
import ArrowBtn from "@/components/shared/btns/ArrowBtn";
import ReviewSheet from "../sheets/ReviewSheet";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

type ReviewsSwiperProps = {
  user: IUser | undefined;
  setUser?: React.Dispatch<React.SetStateAction<IUser | null>>;
  reviews: IReview[] | [];
};

const ReviewsSwiper = ({ user, setUser, reviews }: ReviewsSwiperProps) => {
  if (reviews.length === 0) return;

  return (
    <div className="py-10 relative max-w-[860px] lg:self-center">
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
        {reviews.map((reviewObj, index) => (
          <SwiperSlide
            key={`${reviewObj?._id}-${index}`}
            className="max-w-[300px] mb-3"
          >
            <ReviewSheet user={user} setUser={setUser} reviewObj={reviewObj} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination2 text-center"></div>
      <ArrowBtn btnClass="swiper-prev-img2" img="Left arrow" />
      <ArrowBtn btnClass="swiper-next-img2" img="Right arrow" />
    </div>
  );
};

export default ReviewsSwiper;
