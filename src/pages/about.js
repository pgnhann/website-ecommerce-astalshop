import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../components/pageprops/breadcrumbs";

const About = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location.state.data);
  }, [location]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="About" prevLocation={prevLocation} />
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Text Column */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-semibold text-primeColor mb-3">About Astal</h1>
          <p className="text-base text-lightText mb-8 text-justify">
              Welcome to Astal, your online skincare destination established in 2021 with the mission of bringing authentic, 
              high-quality skincare products from world-renowned brands to customers around the globe. At Astal, we understand 
              that every individual's skin is unique, and caring for your skin is not just a routine but an art form.
          </p>

          <h1 className="text-3xl font-semibold text-primeColor mb-3 ">Vision And Mission</h1>
          <p className="text-base text-lightText mb-8 text-justify">
              Our mission at Astal is to become the leading destination for skincare lovers. We continually expand our product range 
              and stay updated with the latest trends in the skincare industry to meet the growing demands of our customers. With every 
              product we offer, we aim to bring satisfaction and joy as you take care of yourself.
          </p>


          <h1 className="text-3xl font-semibold text-primeColor mb-3">Our Commitment</h1>
          <p className="text-base text-lightText mb-8 text-justify">
              Astal is dedicated to providing genuine skincare products that are carefully curated to ensure effectiveness and 
              safety for our customers. We take pride in offering a diverse selection of serums, cleansers, moisturizers, and more, 
              tailored to meet the needs of various skin types. Each product undergoes rigorous quality checks before reaching our customers, 
              allowing you to enjoy the best skincare experiences with peace of mind.
          </p>

          <h1 className="text-3xl font-semibold text-primeColor mb-3">Our Audience</h1>
          <p className="text-base text-lightText mb-8 text-justify">
              Astal serves a diverse clientele, from those just beginning their skincare journey to seasoned beauty enthusiasts. 
              We recognize that everyone has a unique story when it comes to their skin, and we are here to accompany you in discovering 
              and developing the best skincare habits.
          </p>
          <p className="mb-4">
              Thank you for choosing Astal as your partner in your skincare journey. Let’s explore natural beauty together and shine from within!
          </p>
          <Link to="/shop">
            <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300 mb-16">
              Continue Shopping
            </button>
          </Link>
        </div>
        
        {/* Image Column */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-4 items-center justify-center mb-20">
          <img src={'images/journal/02.png'}  className="col-span-1 object-cover transition-transform duration-300 ease-in-out transform hover:scale-110" />
          <img src={'images/journal/03.png'} className="col-span-1 object-cover transition-transform duration-300 ease-in-out transform hover:scale-110" />
        </div>
      </div>
    </div>
  );
};

export default About;
