import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";

import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import Img from "./../../common/Img";

function CourseDetailsCard({
  course,
  setConfirmationModal,
  handleEnrollCourse,
}) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if course exists and has a 'thumbnail', otherwise provide default
  const {
    thumbnail: ThumbnailImage = "default-image-url.jpg", // Use a default image if not present
    price: CurrentPrice,
    _id: courseId,
  } = course || {}; // Default to an empty object if `course` is undefined

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-2xl bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <Img
          src={ThumbnailImage}
          alt={course?.courseName || "Course Image"}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <p className={`my-2 text-xl font-semibold `}>{course?.courseName}</p>
          <p className={`my-2 text-l font-semibold `}>
            {course?.instructor.firstName}
            {course?.instructor.lastName}
          </p>
          <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
            {course?.courseDescription}
          </p>
          <div className="flex flex-col gap-4">
            {/* Enroll Button */}
            <button
              className="yellowButton outline-none"
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses") // Go to course if enrolled
                  : handleEnrollCourse // Enroll if not already enrolled
              }
            >
              {user && course?.studentsEnrolled.includes(user?._id)
                ? "Go To Course"
                : "S'inscrire"}{" "}
            </button>
          </div>

          {/* Course Requirements 
          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              Course Requirements :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                );
              })}
            </div>
          </div>*/}

          {/* Share Button 
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
          */}
        </div>
      </div>
    </>
  );
}

export default CourseDetailsCard;
