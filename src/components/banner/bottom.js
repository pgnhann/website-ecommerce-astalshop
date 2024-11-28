import React from "react";
import { MdLocalShipping } from "react-icons/md";
import { MdOutlineSupportAgent } from "react-icons/md";
import { CgRedo } from "react-icons/cg";

const BannerBottom = () => {
  return (
    <div className="w-full bg-white border-b-[1px] py-4 border-b-gray-200 px-4">
      <div className="max-w-container mx-auto h-20 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 w-55 shadow-sm hover:shadow-md duration-300">
          <MdLocalShipping />
          <p className="text-lightText text-base">Express Shipping</p>
        </div>
        <div className="flex md:w-auto items-center gap-2 w-100 shadow-sm hover:shadow-md duration-300">
          <span className="text-xl text-center w-6 ml-1">
            <MdOutlineSupportAgent />
          </span>
          <p className="text-lightText text-base">Support 24/7</p>
        </div>
        <div className="flex md:w-auto items-center gap-2 w-72 shadow-sm hover:shadow-md duration-300">
          <span className="text-2xl text-center w-6">
            <CgRedo />
          </span>
          <p className="text-lightText text-base">Return policy in 14 days</p>
        </div>
      </div>
    </div>
  );
};

export default BannerBottom;
