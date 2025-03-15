import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";
import Img from "./../../common/Img";

function Course_Card({ course, Height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <div className="relative flex w-80 flex-col rounded-xl bg-gray-900 bg-clip-border text-white shadow-md hover:scale-[1.03] transition-all duration-200 z-50 mt-10">
      <Link to={`/courses/${course._id}`}>
        <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
          <Img
            src={course?.thumbnail}
            alt="course thumbnail"
            className={`${Height} w-full h-full object-cover`}
          />
        </div>
        <div className="p-6 overflow-hidden">
          <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-white antialiased">
            {course?.courseName}
          </h5>
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
            {course?.courseDescription}
          </p>
          <p className="text-sm text-richblack-50">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>
        </div>
        <div className="p-6 pt-0 text-center"></div>
      </Link>
    </div>
  );
}

export default Course_Card;
