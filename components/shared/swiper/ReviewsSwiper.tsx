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
import ReviewCard from "../cards/ReviewCard";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

type ReviewsSwiperProps = {
  user: IUser | undefined;
  reviews: IReview[] | [];
};

const ReviewsSwiper = ({ user, reviews }: ReviewsSwiperProps) => {
  if (reviews.length === 0) return;

  return (
    <div className="py-10">
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
            <ReviewCard user={user} reviewObj={reviewObj} />
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

// Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi minima quia voluptatem ad cumque nisi! Ea similique nemo doloremque temporibus! Fuga obcaecati unde neque ipsa molestias nostrum, voluptatum reiciendis ipsum aspernatur corporis atque quod cum? Ex, quasi nam debitis quibusdam tenetur earum consequuntur quia beatae quas consectetur dignissimos omnis delectus ipsam, sed sapiente adipisci temporibus non blanditiis, voluptas ut vitae. Dolorum nostrum, aliquam possimus nesciunt praesentium eum veritatis pariatur ducimus laborum numquam corporis voluptatem cumque soluta non error illum saepe? Obcaecati placeat laborum tempore assumenda magni animi voluptatum ad veritatis dolor, fugit asperiores consequatur quo ex reprehenderit quos officiis distinctio.
