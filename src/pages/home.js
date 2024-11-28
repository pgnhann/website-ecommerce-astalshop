import React, { useEffect } from "react";
import Banner from "../components/banner/index";
import BannerBottom from "../components/banner/bottom";
import Sale from "../components/home/sale";
import NewBrands from "../components/home/newbrand";
import BestSellers from "../components/home/bestsellers";
import GoldenHour from "../components/home/goldenhour";
import SpecialOffers from "../components/home/specialoffers";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const Home = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get('status');
    const action = queryParams.get('action'); 

    if (status === 'success') {
        toastr.options = {
            closeButton: true,
            timeOut: 2000,
        };

        if (action === 'login') {
            toastr.success("Login successfully!", "");
        } else if (action === 'register') {
            toastr.success("Google account registered successfully!", "");
        }
    } else if (status === 'failure') {
        toastr.error("Google authentication failed. Please try again.", "Error");
    }

    window.history.replaceState({}, document.title, window.location.pathname);
}, []);

  return (
    <div className="w-full mx-auto">
      <Banner/>
      <BannerBottom/>
      <div className="max-w-container mx-auto px-4">
        <Sale/>
        <NewBrands/>
        <BestSellers />
        <GoldenHour />
        <SpecialOffers />
      </div>
    </div>
  );
};

export default Home;