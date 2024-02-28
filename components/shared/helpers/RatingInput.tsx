"use client";

import { Dispatch, SetStateAction } from "react";
import { FaStar } from "react-icons/fa";

type RatingProps = {
  rating: number;
  setRating: Dispatch<SetStateAction<number>>;
};

const RatingInput = ({ rating, setRating }: RatingProps) => {
  const handleClick = (value: number) => {
    setRating(value);
  };


  return (
    <div className="flex gap-2">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className={`text-white w-[30px] h-[30px] cursor-pointer  ${
              starValue <= rating ? "text-yellow-500" : "text-gray-200"
            }`}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};

export default RatingInput;
