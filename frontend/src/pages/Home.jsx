import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import Footer from "../components/common/Footer";
import Hero from "../components/Hero";
import InstructorSection from "../components/core/HomePage/InstructorSection";

// hardcoded

const Home = () => {
  return (
    <div className=" ">
      {/*Section1  */}
      <Hero />
      <InstructorSection />
      <Footer />
    </div>
  );
};

export default Home;
