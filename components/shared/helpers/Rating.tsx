import { FaStar } from "react-icons/fa";

type RatingProps = {
  rating: number;
};

const Rating = ({ rating }: RatingProps) => {
  return (
    <div className="flex gap-2">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className={`text-white w-[30px] h-[30px] cursor-pointer  ${
              starValue <= rating ? "text-yellow-500" : ""
            }`}
          />
        );
      })}
    </div>
  );
};

export default Rating;
