import React from "react";
import { Link } from "react-router-dom";
import Image from "../designlayouts/image";

const Sale = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-2 mt-8">
      <div className="">
        <Link to="/shop">
          <Image className="object-cover w-[95%]" imgSrc={'images/sale/003.png'} />
        </Link>
      </div>
      <div className="w-full md:w-2/3 lg:w-1/2 h-auto flex flex-col gap-4 lg:gap-4">
        <div className="h-1/2 w-full mt-4">
          <Link to="/shop">
          <Image className="h-full w-full object-cover" imgSrc={'images/sale/001.png'} />
          </Link>
        </div>
        <div className="h-1/2 w-full">
          <Link to="/shop">
            <Image className="h-full w-full object-cover" imgSrc={'images/sale/002.png'} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sale;
