"use client";

import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { FaStar } from "react-icons/fa";

type RatingProps = {
  rating: number;
  setRating: Dispatch<SetStateAction<number>>;
};

const RatingInput = ({ rating, setRating }: RatingProps) => {
  const pathname = usePathname();

  const handleClick = (value: number) => {
    setRating(value);
  };

  return (
    <div className="flex gap-2">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        console.log("starValue = ", starValue);
        console.log("rating = ", rating);
        return (
          <FaStar
            key={index}
            className={`w-[30px] h-[30px] cursor-pointer  ${
              starValue <= rating
                ? "text-yellow-500"
                : pathname === "/"
                ? "text-gray-900"
                : "text-gray-300"
            }`}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};

export default RatingInput;
