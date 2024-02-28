import { FaStar } from "react-icons/fa";

const Rating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-2">
      {[...Array(rating)].map((_, index) => {
        return (
          <FaStar
            key={index}
            className="w-[30px] h-[30px] cursor-pointer text-yellow-500"
          />
        );
      })}
    </div>
  );
};

export default Rating;
