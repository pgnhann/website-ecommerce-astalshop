import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import FooterListTitle from "./listtitle";
import Image from "../designlayouts/image";

const Footer = () => {
  const [emailInfo, setEmailInfo] = useState("");
  const [subscription, setSubscription] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const emailValidation = () => {
    return String(emailInfo)
      .toLocaleLowerCase()
      .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
  };

  const handleSubscription = () => {
    if (emailInfo === "") {
      setErrMsg("Please provide an Email!");
    } else if (!emailValidation(emailInfo)) {
      setErrMsg("Please provide a valid Email!");
    } else {
      setSubscription(true);
      setErrMsg("");
      setEmailInfo("");
    }
  };

  return (
    <footer className="w-full bg-[#F5F5F3] py-12">
      <div className="max-w-container mx-auto justify-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 px-6 gap-8">
        {/* About Section */}
        <div className="col-span-2">
          <FooterListTitle title="More about Astal Shop" />
          <div className="flex flex-col gap-6">
            <p className="text-base text-gray-600 leading-relaxed">
              Thank you for visiting our Astal Shop!
            </p>
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-gray-600">
                <FiMapPin className="text-xl text-primeColor" />
                Address: 126 Nguyễn Trãi, Phường 3, Quận 1, TP.HCM.
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <FiPhone className="text-xl text-primeColor" />
                Telephone: 090 321 46 85.
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <FiMail className="text-xl text-primeColor" />
                Email: astalshop2021@gmail.com.
              </p>
            </div>
            <ul className="flex items-center gap-4 mt-4">
              {[FaYoutube, FaFacebook, FaLinkedin].map((Icon, idx) => (
                <li
                  key={idx}
                  className="w-8 h-8 bg-primeColor text-white flex items-center justify-center rounded-full hover:bg-black duration-300 cursor-pointer"
                >
                  <Icon className="text-lg" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shop Section */}
        <div>
          <FooterListTitle title="Shop" />
          <ul className="space-y-2">
            {["New Brands", "Best Sellers", "Special Offers", "Golden Hour"].map(
              (item, idx) => (
                <li
                  key={idx}
                  className="font-titleFont text-base text-gray-600 hover:text-black hover:underline duration-300 cursor-pointer"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Account Section */}
        <div>
          <FooterListTitle title="Your Account" />
          <ul className="space-y-2">
            {[
              "Profile",
              "Carts",
              "Place Order",
              "Account Details",
              "Payment Options",
            ].map((item, idx) => (
              <li
                key={idx}
                className="font-titleFont text-base text-gray-600 hover:text-black hover:underline duration-300 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="col-span-2 flex flex-col items-center">
          <FooterListTitle title="Subscribe to our newsletter." />
          <p className="text-center mb-4 text-gray-600">
            Do not hesitate to contact us if you need anything else.
          </p>
          {subscription ? (
            <motion.p
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-base font-semibold text-green-600"
            >
              Subscribed Successfully!
            </motion.p>
          ) : (
            <div className="flex flex-col xl:flex-row w-full gap-4">
              <div className="w-full">
                <input
                  value={emailInfo}
                  onChange={(e) => setEmailInfo(e.target.value)}
                  className="w-full h-12 border-b border-gray-400 bg-transparent px-4 text-primeColor text-base placeholder-gray-500 outline-none"
                  type="text"
                  placeholder="Insert your email ..."
                />
                {errMsg && (
                  <p className="text-red-600 text-sm mt-2">{errMsg}</p>
                )}
              </div>
              <button
                onClick={handleSubscription}
                className="bg-primeColor text-white px-6 h-12 hover:bg-black duration-300"
              >
                Subscribe
              </button>
            </div>
          )}
          <Image
            className={`mt-${subscription ? "4" : "8"} w-[80%] lg:w-[60%]`}
            imgSrc={"images/payment.png"}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
