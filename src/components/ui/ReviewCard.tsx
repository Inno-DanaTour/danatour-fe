import React from "react";
import { Review } from "../../pages/home/types";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex gap-4">
      <img
        src={review.avatar}
        alt={review.user}
        className="w-12 h-12 rounded-full object-cover shrink-0"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h5 className="font-bold text-gray-900">{review.user}</h5>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < review.rating ? "currentColor" : "none"}
                className={i < review.rating ? "" : "text-gray-200"}
              />
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
      </div>
    </div>
  );
};

export default ReviewCard;
