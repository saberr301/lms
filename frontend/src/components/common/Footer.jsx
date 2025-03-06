import React from "react";
import EpbLearnLogo from "../../assets/Logo/1.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="bg-richblack-800 mx-7 rounded-3xl mb-10">
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700"></div>
      </div>

      {/* bottom footer */}
      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm">
        {/* Section 1 */}
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className="flex ">
            <Link to="/">
              <img src={EpbLearnLogo} width={160} height={42} loading="lazy" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
